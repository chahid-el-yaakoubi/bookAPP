"use client"

import { useState } from "react"
import AdminBookingCalendar from "../ComponentHost/admin-booking-calendar"
// import AdminBookingCalendar from "@/admin-booking-calendar"

export default function Callender() {
  // Example of initially blocked dates
  const [blockedDates, setBlockedDates] = useState([
    // November 2025
    new Date(2025, 10, 21),
    new Date(2025, 10, 22),
    new Date(2025, 10, 25),
    new Date(2025, 10, 26),
    new Date(2025, 10, 28),
    new Date(2025, 10, 29),
    new Date(2025, 10, 30),
  ])

  const handleDatesChange = (newBlockedDates) => {
    setBlockedDates(newBlockedDates)
    console.log("Blocked dates updated:", newBlockedDates)
    // Here you would typically save these dates to your backend
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue to-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">Booking Management</h1>
          <p className="text-blue-600">Manage your property availability</p>
        </div>
        <AdminBookingCalendar initialBlockedDates={blockedDates} priceCode="MAD400" onDatesChange={handleDatesChange} />
      </div>
    </main>
  )
}
