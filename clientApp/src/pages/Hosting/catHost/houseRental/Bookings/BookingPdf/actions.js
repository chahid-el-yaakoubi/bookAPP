"use server"

import { jsPDF } from "jspdf"
import QRCode from "qrcode"
// Optional font imports for better typography
// import { Roboto } from 'jspdf-font'

export async function generatePDF(bookingData) {
  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format price to include currency symbol and commas
  const formatPrice = (price) => {
    if (!price && price !== 0) return ""

    // If price is already formatted with currency symbol, return as is
    if (typeof price === 'string' && price.includes('$')) {
      return price
    }

    // Otherwise format the number with proper currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Calculate number of nights
  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return ""
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Create a verification URL for the QR code
  const verificationUrl = `https://staywhere.com/verify/${bookingData.bookingId}`

  // Calculate number of nights
  const nights = calculateNights(
    bookingData.startDate || bookingData.checkIn,
    bookingData.endDate || bookingData.checkOut
  )

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 150,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  })

  // Modern color palette
  const PRIMARY = [41, 120, 242]      // #2978F2 - Modern blue
  const SECONDARY = [255, 153, 31]    // #FF991F - Warm orange
  const BLACK = [33, 33, 33]          // #212121 - Soft black
  const GRAY = [112, 112, 112]        // #707070 - Medium gray
  const LIGHT_GRAY = [248, 249, 250]  // #F8F9FA - Off-white
  const WHITE = [255, 255, 255]       // #FFFFFF - White
  const GREEN = [46, 204, 113]        // #2ECC71 - Success green
  const RED = [235, 87, 87]           // #EB5757 - Error red

  // Card dimensions (centered on A4)
  const cardWidth = 180
  const cardHeight = 290
  const marginLeft = (210 - cardWidth) / 2
  const marginTop = (297 - cardHeight) / 2
  const cornerRadius = 5

  // Add white background with shadow effect
  // First add a very slight gray background to make the card pop
  doc.setFillColor(240, 240, 240)
  doc.rect(0, 0, 210, 297, 'F')
  
  // Add card shadow (multiple rectangles with decreasing opacity)
  doc.setFillColor(220, 220, 220)
  doc.roundedRect(marginLeft + 3, marginTop + 3, cardWidth, cardHeight, cornerRadius, cornerRadius, 'F')
  doc.setFillColor(230, 230, 230)
  doc.roundedRect(marginLeft + 2, marginTop + 2, cardWidth, cardHeight, cornerRadius, cornerRadius, 'F')
  doc.setFillColor(240, 240, 240)
  doc.roundedRect(marginLeft + 1, marginTop + 1, cardWidth, cardHeight, cornerRadius, cornerRadius, 'F')
  
  // Main card background
  doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
  doc.roundedRect(marginLeft, marginTop, cardWidth, cardHeight, cornerRadius, cornerRadius, 'F')

  // Add a thin border
  doc.setDrawColor(230, 230, 230)
  doc.setLineWidth(0.5)
  doc.roundedRect(marginLeft, marginTop, cardWidth, cardHeight, cornerRadius, cornerRadius, 'S')

  // Header section with gradient effect
  // Draw color strip at top
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2])
  doc.roundedRect(marginLeft, marginTop, cardWidth, 24, cornerRadius, cornerRadius, 'F')
  // Make the bottom corners square
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2])
  doc.rect(marginLeft, marginTop + 12, cardWidth, 12, 'F')

  // Logo (rounded rectangle with brand mark)
  doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
  doc.roundedRect(marginLeft + 12, marginTop + 7, 36, 10, 5, 5, 'F')

  // Logo text
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2])
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("stay", marginLeft + 18, marginTop + 14)
  doc.setTextColor(SECONDARY[0], SECONDARY[1], SECONDARY[2])
  doc.text("Where", marginLeft + 32, marginTop + 14)

  // Status badge (right-aligned)
  const statusColor = bookingData.status === 'confirmed' ? GREEN : 
                     bookingData.status === 'cancelled' ? RED : SECONDARY
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2])
  doc.roundedRect(marginLeft + cardWidth - 60, marginTop + 7, 48, 10, 5, 5, "F")
  doc.setFontSize(8)
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2])
  doc.text(
    (bookingData.status || 'Processing').toUpperCase(),
    marginLeft + cardWidth - 36,
    marginTop + 13.5, 
    { align: "center" }
  )

  // Content section
  const contentStart = marginTop + 36

  // Title section
  doc.setTextColor(BLACK[0], BLACK[1], BLACK[2])
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Booking Confirmation", marginLeft + 12, contentStart)

  // Booking ID
  doc.setFontSize(9)
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.text(`Booking ID: ${bookingData.bookingId}`, marginLeft + 12, contentStart + 8)

  // Date range summary
  const checkInDate = formatDate(bookingData.startDate || bookingData.checkIn)
  const checkOutDate = formatDate(bookingData.endDate || bookingData.checkOut)
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2])
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(
    `${checkInDate} — ${checkOutDate} · ${nights} ${nights === 1 ? "Night" : "Nights"}`,
    marginLeft + 12, 
    contentStart + 16
  )

  // Divider line
  doc.setDrawColor(240, 240, 240)
  doc.setLineWidth(1)
  doc.line(marginLeft + 12, contentStart + 24, marginLeft + cardWidth - 12, contentStart + 24)

  // Info section - 2 column layout
  const startY = contentStart + 34
  const lineHeight = 20
  const col1X = marginLeft + 12
  const col2X = marginLeft + cardWidth / 2 + 5

  // Helper function to draw info box with icon
  const drawInfoBox = (title, value, x, y, valueColor = BLACK) => {
    // Title
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(title, x, y)

    // Value
    doc.setTextColor(valueColor[0], valueColor[1], valueColor[2])
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(value || "—", x, y + 7)
  }

  // Left column
  drawInfoBox("GUEST", bookingData.guestName, col1X, startY)
  drawInfoBox("PROPERTY", bookingData.propertyId?.title || bookingData.hotelName, col1X, startY + lineHeight)
  drawInfoBox("CHECK-IN", `${formatDate(bookingData.startDate || bookingData.checkIn)} (After 3PM)`, col1X, startY + lineHeight * 2, PRIMARY)
  
  // Location info
  const location = bookingData.propertyId?.location?.city
    ? `${bookingData.propertyId.location.city}, ${bookingData.propertyId.location.country}`
    : bookingData.location || "Location info unavailable"
  drawInfoBox("LOCATION", location, col1X, startY + lineHeight * 3)

  // Right column
  drawInfoBox("GUESTS", `${bookingData.guests || "2"} ${bookingData.guests === 1 ? "Guest" : "Guests"}`, col2X, startY)
  drawInfoBox("ROOM TYPE", bookingData.roomId?.type || bookingData.roomType || "Deluxe Room", col2X, startY + lineHeight)
  drawInfoBox("CHECK-OUT", `${formatDate(bookingData.endDate || bookingData.checkOut)} (Before 11AM)`, col2X, startY + lineHeight * 2, PRIMARY)
  
  // Payment info
  const paymentMethod = bookingData.payment?.method || "Credit Card"
  const paymentStatus = bookingData.payment?.cashReceived ? "Paid" : "Pending"
  drawInfoBox("PAYMENT", `${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} (${paymentStatus})`, col2X, startY + lineHeight * 3)

  // Total price section with bold highlight
  const priceBoxY = startY + lineHeight * 4 + 5
  
  // Price background
  doc.setFillColor(LIGHT_GRAY[0], LIGHT_GRAY[1], LIGHT_GRAY[2])
  doc.roundedRect(marginLeft + 12, priceBoxY, cardWidth - 24, 22, 3, 3, 'F')

  // Price info
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("TOTAL PRICE", marginLeft + 22, priceBoxY + 9)
  
  doc.setTextColor(SECONDARY[0], SECONDARY[1], SECONDARY[2])
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(formatPrice(bookingData.totalPrice), marginLeft + 22, priceBoxY + 18)

  // QR Code section
  const qrY = priceBoxY + 32

  // Center content for QR
  const centerX = marginLeft + cardWidth / 2

  // QR code title
  doc.setTextColor(BLACK[0], BLACK[1], BLACK[2])
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Scan for easy check-in", centerX, qrY, { align: "center" })

  // QR code with styled border
  // First create a background
  doc.setFillColor(LIGHT_GRAY[0], LIGHT_GRAY[1], LIGHT_GRAY[2])
  doc.roundedRect(centerX - 26, qrY + 5, 52, 52, 2, 2, 'F')
  
  // Inner white space
  doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
  doc.roundedRect(centerX - 25, qrY + 6, 50, 50, 1, 1, 'F')
  
  // Add QR code image
  doc.addImage(qrCodeDataUrl, "PNG", centerX - 20, qrY + 11, 40, 40)

  // QR code instructions
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("Present this confirmation at check-in", centerX, qrY + 65, { align: "center" })
  
  // New message for QR code scan
  doc.setFontSize(10)
  doc.text("Scan the QR code for more details", centerX, qrY + 80, { align: "center" })

  // Footer with contact info
  const footerY = marginTop + cardHeight - 18
  
  // Contact info
  doc.setTextColor(BLACK[0], BLACK[1], BLACK[2])
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("Need help? Contact us:", marginLeft + 12, footerY)

  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2])
  doc.setFont("helvetica", "bold")
  doc.text("support@staywhere.com", marginLeft + 60, footerY)

  // Generated timestamp
  const now = new Date()
  const date = now.toLocaleDateString()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text(`Generated: ${date} at ${time}`, marginLeft + cardWidth - 12, footerY, { align: "right" })

  // Convert to blob
  const pdfBlob = doc.output("blob")
  return pdfBlob
}