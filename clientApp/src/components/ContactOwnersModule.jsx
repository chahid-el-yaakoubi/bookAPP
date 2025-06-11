"use client"

import { useContext, useEffect, useState } from "react"
import { Phone, Mail, MessageCircle, X, CreditCard, Calendar, MapPin, Users, CheckCircle, Lock, User, MailIcon } from 'lucide-react'
import { SearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { getProperty } from "../Lib/api";
import { is } from "date-fns/locale";



function getStoredDates() {
  const stored = localStorage.getItem('dates');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((d) => ({
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      key: d.key || 'selection',
    }));
  } catch (e) {
    return null;
  }
}

// Utility: get booking price and type/name based on property type and roomId
function getBookingDetails(property, selectedRoom) {
  if (!property) return { price: 0, type: '', name: '' };

  if (selectedRoom) {
    return {
      price: selectedRoom?.price ?? 0,
      type: selectedRoom?.type ?? '',
      name: selectedRoom?.type ?? ''
    };
  }

  return {
    price: property?.pricing?.nightly_rate ?? 0,
    type: property?.type?.type ?? '',
    name: property?.title ?? ''
  };
}

const ContactOwnersModule = ({ hotel = {}, roomId, className = "", onClose }) => {
  const [property, setProperty] = useState(null);
  const { id } = useParams();

  const getPropertyData = async () => {
    try {
      const response = await getProperty(id);
      if (response && response.data) {
        setProperty(response.data);
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };

  useEffect(() => {
    getPropertyData();
  }, []);
  const { dates, options, dispatch, city } = useContext(SearchContext);

  let guests = 1; // Default value if parsing fails

  if (options) {
    try {
      const getOptions = options;
      guests = (getOptions.Adult || 0) + (getOptions.Children || 0);
    } catch (error) {
      console.error("Failed to parse options from localStorage", error);
    }
  }


  // Add selectedRoomId state for hotels/guesthouses
  const isHotel = ["hotel", "guesthouse"].includes(property?.type?.type?.toLowerCase() ?? "");

  isHotel && console.log("Selected Room ID:", roomId, "Property Rooms:", property?.rooms);
  const [selectedRoomId, setSelectedRoomId] = useState(() => {
    if (isHotel && Array.isArray(property?.rooms) && property.rooms.length > 0) {
      return roomId || property.rooms[0]._id;
    }
    return null;
  });

  // Keep selectedRoomId in sync with roomId prop if it changes
  useEffect(() => {
    if (isHotel && roomId && Array.isArray(property?.rooms)) {
      setSelectedRoomId(roomId);
    }
  }, [isHotel, roomId, property]);

  // Find the selected room object
  const selectedRoom = isHotel && Array.isArray(property?.rooms)
    ? property.rooms.find(r => r?._id === selectedRoomId)
    : null;


  const storedDates = getStoredDates();
  const initialStart = storedDates?.[0]?.startDate || dates?.[0]?.startDate || new Date();
  const initialEnd = storedDates?.[0]?.endDate || dates?.[0]?.endDate || new Date();

  console.log("Initial Start Date:", initialStart, "Initial End Date:", initialEnd);

  const [activeTab, setActiveTab] = useState("contact")
  const [isLoading, setIsLoading] = useState(false)
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("") // 'whatsapp', 'email', 'card'

  // Booking data state
  const [bookingData, setBookingData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    startDate: initialStart ? initialStart.toISOString().split("T")[0] : "", // Format to YYYY-MM-DD,
    endDate: initialEnd ? initialEnd.toISOString().split("T")[0] : "", // Format to YYYY-MM-DD
    guests: guests || 1, // Default to 1 guest if parsing fails
    roomType: "standard",
    notes: "",
    totalPrice: 0,
  })

  // Payment data state
  const [paymentData, setPaymentData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    cardBrand: "",
  })

  // Contact information
  const CONTACT_INFO = {
    phone: "+212 123-456-789",
    whatsapp: "+212684679961",
    email: "reservations@luxuryhotel.com",
  }

  // WhatsApp client name input state
  const [whatsAppName, setWhatsAppName] = useState("");




  // Universal property/room logic
  const propertyName = property?.title || "Property";
  const propertyCity = property?.location?.city || "Unknown City";
  const roomName = selectedRoom?.type || null;
  const bookingType = roomName ? roomName : property?.type?.type || "Property";





  // In the component, get booking details:
  const bookingDetails = getBookingDetails(property, selectedRoom);
  // Use bookingDetails.price, bookingDetails.type, bookingDetails.name in all booking flows and summaries

  // Utility functions
  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateNights = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0
    const checkIn = new Date(bookingData.startDate)
    const checkOut = new Date(bookingData.endDate)
    const diffTime = Math.abs(checkOut - checkIn)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculatePricing = () => {
    const nights = calculateNights()
    const subtotal = nights * bookingDetails.price
    const taxes = subtotal * 0 // 15% tax
    const serviceFee = subtotal * 0 // 5% service fee
    const total = subtotal + taxes + serviceFee

    return {
      subtotal,
      taxes,
      serviceFee,
      total,
      nights,
      price: bookingDetails.price,
      bookingType: bookingDetails.type,
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  // Detect card brand
  const detectCardBrand = (number) => {
    const num = number.replace(/\D/g, "")
    if (/^4/.test(num)) return "visa"
    if (/^5[1-5]|^2[2-7]/.test(num)) return "mastercard"
    if (/^3[47]/.test(num)) return "amex"
    if (/^6/.test(num)) return "discover"
    return "other"
  }

  // Phone interaction handler
  const handlePhoneCall = (event) => {
    if (event.detail === 2) {
      // Double click: call direct
      window.location.href = `tel:${CONTACT_INFO.phone}`;
    } else {
      // Single click: copy to clipboard and show tooltip
      navigator.clipboard.writeText(CONTACT_INFO.phone);
      setShowPhoneTooltip(true);
      setTimeout(() => setShowPhoneTooltip(false), 2000);
    }
  };

  // WhatsApp booking handler (test data + input name + constant dates)
  const handleWhatsAppBooking = () => {
    const guestName = whatsAppName || "Guest";
    // Add one day to check-in and check-out dates
    let checkInDateObj = initialStart instanceof Date ? new Date(initialStart) : new Date(initialStart);
    let checkOutDateObj = initialEnd instanceof Date ? new Date(initialEnd) : new Date(initialEnd);
    checkInDateObj.setDate(checkInDateObj.getDate() + 1);
    checkOutDateObj.setDate(checkOutDateObj.getDate() + 1);
    const checkInDate = checkInDateObj.toISOString().split("T")[0];
    const checkOutDate = checkOutDateObj.toISOString().split("T")[0];
    // Calculate nights
    let nights = 2;
    if (initialStart && initialEnd) {
      const start = new Date(initialStart);
      const end = new Date(initialEnd);
      nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    }
    const subtotal = nights * bookingDetails.price;
    const taxes = subtotal * 0.15;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + taxes + serviceFee;

    // Add special notes if present
    const specialNotes = bookingData.notes?.trim() ? bookingData.notes.trim() : "This is a test booking via WhatsApp.";

    const message = encodeURIComponent(
      `BOOKING REQUEST\n\n` +
      `Guest: ${guestName}\n` +
      `Property: ${bookingDetails.name}${selectedRoom ? ` (Room: ${selectedRoom.type})` : ""}\n` +
      `Location: ${property?.location?.city || "Unknown City"}\n\n` +
      `Check-in: ${checkInDate}\n` +
      `Check-out: ${checkOutDate}\n` +
      `Nights: ${nights}\n` +
      `Guests: ${guests}\n` +
      `Type: ${bookingDetails.type}\n\n` +
      `PRICING:\n` +
      `Rate: ${bookingDetails.price} MAD/night\n` +
      `Subtotal: ${subtotal.toFixed(2)} MAD\n` +
      `Taxes (0%): ${taxes.toFixed(2)} MAD\n` +
      `Service Fee (0%): ${serviceFee.toFixed(2)} MAD\n` +
      `TOTAL: ${total.toFixed(2)} MAD\n\n` +
      `Notes: ${specialNotes}\n\n` +
      `Please confirm availability and provide payment instructions. Thank you!`
    );
    window.location.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
  };

  // Process online payment
  const processPayment = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const paymentResult = {
        success: true,
        transactionId: `TXN${Date.now()}`,
        cardLast4: paymentData.cardNumber.slice(-4),
        cardBrand: detectCardBrand(paymentData.cardNumber),
      }

      if (paymentResult.success) {
        const { total } = calculatePricing()
        setBookingData((prev) => ({ ...prev, totalPrice: total }))
        setBookingStep(4) // Success step
      }
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Form validation
  const isBookingDetailsValid = () => {
    return (
      bookingData.startDate && bookingData.endDate && new Date(bookingData.endDate) > new Date(bookingData.startDate)
    )
  }

  const isPaymentContactValid = () => {
    const hasName = paymentData.firstName && paymentData.lastName
    const hasContact = paymentData.phone || paymentData.email
    return hasName && hasContact
  }

  const isPaymentInfoValid = () => {
    return (
      paymentData.cardNumber.replace(/\s/g, "").length >= 13 &&
      paymentData.cardExpiry.match(/^\d{2}\/\d{2}$/) &&
      paymentData.cardCvc.length >= 3 &&
      paymentData.cardName.length >= 2
    )
  }

  const resetBooking = () => {
    setBookingData({
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      startDate: "",
      endDate: "",
      guests: 1,
      roomType: "standard",
      notes: "",
      totalPrice: 0,
    })
    setPaymentData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardName: "",
      cardBrand: "",
    })
    setBookingStep(1)
    setPaymentMethod("")
    setActiveTab("contact")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full min-w-[50vw] max-h-[95vh] overflow-y-auto border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue transition-colors z-10 bg-white rounded-full p-2 shadow-md border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-blue mb-1">Book Your Stay</h2>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <MapPin size={16} />
              <span className="text-sm font-medium">
                {propertyName} • {propertyCity}
              </span>
            </div>
            <div className="border-b border-gray-200 mt-4" />
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-gray-50 rounded-xl p-1 mb-8 w-full max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-colors focus:outline-none ${activeTab === "contact"
                ? " text-blue shadow"
                : "text-gray-500 hover:text-blue "}`}
            >
              Quick Contact
            </button>
            <button
              onClick={() => setActiveTab("booking")}
              className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-colors focus:outline-none ${activeTab === "booking"
                ? " text-blue shadow"
                : "text-gray-500 hover:text-blue "}`}
            >
              Online Booking
            </button>
          </div>

          {/* Quick Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phone */}
                <div className="group">
                  <button
                    onClick={handlePhoneCall}
                    className="w-full flex items-center gap-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 h-20"
                  >
                    <Phone size={20} />
                    <div className="flex-1 text-left">
                      <span className="block font-semibold">
                        {showPhoneTooltip ? "Number Copied! Double click to call direct" : "Copy Number"}
                      </span>
                      <span className="block text-xs opacity-90">
                        {showPhoneTooltip ? CONTACT_INFO.phone : "Single click to copy, double click to call"}
                      </span>
                    </div>
                  </button>
                </div>

                {/* WhatsApp */}
                <div className="group">
                  <button
                    onClick={() => {
                      setActiveTab("booking")
                      setPaymentMethod("whatsapp")
                      setBookingStep(1)
                    }}
                    className="w-full flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 h-20"
                  >
                    <MessageCircle size={20} />
                    <div className="flex-1 text-left">
                      <span className="block font-semibold">WhatsApp  </span>
                      <span className="block text-xs opacity-90">Quick booking</span>
                    </div>
                  </button>
                </div>
                {/* credit card */}
                <div className="group">
                  
                    <button
                      onClick={() => {
                        setActiveTab("booking")
                        setPaymentMethod("card")
                        setBookingStep(1)
                      }}
                    className="w-full flex items-center gap-4 bg-teal-500 hover:bg-teal-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 h-20"

                      // className="inline-flex items-center gap-3 bg-blue text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue"
                    >
                      <CreditCard size={20} />
                      <span>Pay with Credit Card</span>
                    </button>
                </div>
              </div>



              <div className="bg-gradient-to-r from-blue to-purple-50 rounded-xl p-6 text-center border border-blue">
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Professional Service</h3>
                <p className="text-sm text-gray-600">
                  Our dedicated reservation team is available around the clock to assist with your booking needs.
                </p>
              </div>
            </div>
          )}

          {/* Online Booking Tab */}
          {activeTab === "booking" && (
            <div>
              {/* Step 1: Booking Details (for WhatsApp/Email) or Contact Info (for Credit Card) */}
              {bookingStep === 1 && (paymentMethod === "whatsapp" || paymentMethod === "email") && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold">Your Name</h3>
                  </div>

                  {isHotel && Array.isArray(property?.rooms) && property.rooms.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Room</label>
                      <select
                        value={selectedRoomId}
                        onChange={e => setSelectedRoomId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                      >
                        {property.rooms.map(room => (
                          <option key={room._id} value={room._id}>{room.type} - {room.price} MAD</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'whatsapp' && (
                    <div className="mb-4">
                      <input
                        type="text"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                        placeholder="Enter your name for WhatsApp booking"
                        value={whatsAppName}
                        onChange={e => setWhatsAppName(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes (Optional)</label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                  {/* Booking Summary */}
                  {isBookingDetailsValid() && (
                    <div className="bg-gray-50 rounded-xl p-5 mt-4 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
                      {(() => {
                        const { subtotal, taxes, serviceFee, total, nights, bookingType } = calculatePricing()
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>
                                {bookingType} × {nights} nights
                              </span>
                              <span>{subtotal.toFixed(2)} MAD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Taxes & Fees (0%)</span>
                              <span>{taxes.toFixed(2)} MAD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Service Fee (0%)</span>
                              <span>{serviceFee.toFixed(2)} MAD</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                              <span>Total Amount</span>
                              <span className="text-blue">{total.toFixed(2)} MAD</span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  <div className="flex justify-between gap-2 mt-4">
                    <button
                      onClick={() => {
                        setActiveTab("contact")
                        setPaymentMethod("")
                      }}
                      className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={paymentMethod === "whatsapp" ? handleWhatsAppBooking : handleEmailBooking}
                      disabled={!isBookingDetailsValid()}
                      className={`px-8 py-3 font-bold rounded-xl transition-colors flex items-center gap-2 ${isBookingDetailsValid()
                        ? paymentMethod === "whatsapp"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-blue text-white hover:bg-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {paymentMethod === "whatsapp" ? (
                        <>
                          <MessageCircle size={16} />
                          Send to WhatsApp
                        </>
                      ) : (
                        <>
                          <Mail size={16} />
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Contact Information (for Credit Card) */}
              {bookingStep === 1 && paymentMethod === "card" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold">Contact Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User size={16} className="inline mr-1" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={paymentData.firstName}
                        onChange={(e) => handlePaymentChange("firstName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User size={16} className="inline mr-1" />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={paymentData.lastName}
                        onChange={(e) => handlePaymentChange("lastName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone size={16} className="inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={paymentData.phone}
                        onChange={(e) => handlePaymentChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                        placeholder="+212 123-456-789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MailIcon size={16} className="inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={paymentData.email}
                        onChange={(e) => handlePaymentChange("email", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="bg-blue border border-blue rounded-lg p-4">
                    <p className="text-sm text-blue">
                      <strong>Note:</strong> Please provide either a phone number or email address (at least one is required for contact purposes).
                    </p>
                  </div>

                  <div className="flex justify-between gap-2 mt-4">
                    <button
                      onClick={() => {
                        setActiveTab("contact")
                        setPaymentMethod("")
                      }}
                      className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBookingStep(2)}
                      disabled={!isPaymentContactValid()}
                      className={`px-6 py-3 font-bold rounded-xl transition-colors ${isPaymentContactValid()
                        ? "bg-blue text-white hover:bg-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Next: Booking Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Booking Details (for Credit Card) */}
              {bookingStep === 2 && paymentMethod === "card" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold">Booking Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-1" />
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-1" />
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users size={16} className="inline mr-1" />
                        Guests
                      </label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => handleInputChange("guests", Number.parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} Guest{num > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes (Optional)</label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                  {/* Booking Summary */}
                  {isBookingDetailsValid() && (
                    <div className="bg-gray-50 rounded-xl p-5 mt-4 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
                      {(() => {
                        const { subtotal, taxes, serviceFee, total, nights, bookingType } = calculatePricing()
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>
                                {bookingType} × {nights} nights
                              </span>
                              <span>{subtotal.toFixed(2)} MAD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Taxes & Fees (0%)</span>
                              <span>{taxes.toFixed(2)} MAD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Service Fee (0%)</span>
                              <span>{serviceFee.toFixed(2)} MAD</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                              <span>Total Amount</span>
                              <span className="text-blue">{total.toFixed(2)} MAD</span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  <div className="flex justify-between gap-2 mt-4">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBookingStep(3)}
                      disabled={!isBookingDetailsValid()}
                      className={`px-6 py-3 font-bold rounded-xl transition-colors ${isBookingDetailsValid()
                        ? "bg-blue text-white hover:bg-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Next: Payment Information
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Credit Card Information */}
              {bookingStep === 3 && paymentMethod === "card" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Lock size={20} className="text-green-600" />
                    <h4 className="text-lg font-bold">Secure Card Information</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value)
                          handlePaymentChange("cardNumber", formatted)
                          handlePaymentChange("cardBrand", detectCardBrand(formatted))
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      />
                      {paymentData.cardBrand && (
                        <p className="text-xs text-gray-500 mt-1 capitalize">{paymentData.cardBrand} detected</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        value={paymentData.cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + "/" + value.substring(2, 4)
                          }
                          handlePaymentChange("cardExpiry", value)
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVC *</label>
                      <input
                        type="text"
                        value={paymentData.cardCvc}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          handlePaymentChange("cardCvc", value)
                        }}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-blue border border-blue rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue">
                      <Lock size={16} />
                      <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                    <p className="text-xs text-blue mt-1">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                    </p>
                  </div>

                  <div className="flex justify-between gap-2 mt-4">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={processPayment}
                      disabled={!isPaymentInfoValid() || isLoading}
                      className={`px-8 py-3 font-bold rounded-xl transition-colors flex items-center gap-2 ${isPaymentInfoValid() && !isLoading
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Validate Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Booking Success */}
              {bookingStep === 4 && (
                <div className="text-center space-y-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-green-900 mb-2">Payment Validated!</h3>
                    <p className="text-gray-600">Your booking has been confirmed and payment processed successfully.</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left max-w-md mx-auto">
                    <h4 className="font-semibold text-green-900 mb-3">Booking Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Guest:</span>
                        <span className="text-green-900 font-medium">
                          {paymentData.firstName} {paymentData.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Check-in:</span>
                        <span className="text-green-900 font-medium">{bookingData.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Check-out:</span>
                        <span className="text-green-900 font-medium">{bookingData.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Room:</span>
                        <span className="text-green-900 font-medium">
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Guests:</span>
                        <span className="text-green-900 font-medium">{bookingData.guests}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 flex justify-between">
                        <span className="text-green-700 font-medium">Total Paid:</span>
                        <span className="text-green-900 font-bold">{bookingData.totalPrice.toFixed(2)} MAD</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      onClick={resetBooking}
                      className="px-6 py-3 font-bold text-blue bg-blue rounded-xl hover:bg-blue transition-colors"
                    >
                      Make Another Booking
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 font-bold text-white bg-blue rounded-xl hover:bg-blue transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default ContactOwnersModule;