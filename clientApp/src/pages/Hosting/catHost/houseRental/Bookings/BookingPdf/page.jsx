"use client"

import { useState } from "react"
import { generatePDF } from "./actions"
import BookingPreview from "./components/booking-preview"

export default function BookingConfirmation({bookingData }) {
  

  const [isGenerating, setIsGenerating] = useState(false)



  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true)
      const pdfBlob = await generatePDF(bookingData)

      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob)

      // Create a link element and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `booking-confirmation-${bookingData?.bookingId}.pdf`
      alert(link.download )
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-center text-gray-800">Hotel Booking Confirmation</h1>
        </div>

        
          <>
            <div className="p-6">
              <BookingPreview bookingData={bookingData} />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
              >
                Back to Edit
              </button>
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </>
      </div>
    </div>
  )
}
