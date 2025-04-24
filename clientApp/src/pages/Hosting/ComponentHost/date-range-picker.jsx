"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

function DateRangePicker({ reservedDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [calendarDays, setCalendarDays] = useState([])

  // Generate calendar days for the current month view
  useEffect(() => {
    const days = generateCalendarDays(currentMonth)
    setCalendarDays(days)
  }, [currentMonth])

  // Handle date selection
  const handleDateClick = (date) => {
    // Don't allow selection of past dates or reserved dates
    if (isPastDate(date) || isReservedDate(date)) {
      return
    }

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start a new selection
      setCheckInDate(date)
      setCheckOutDate(null)
    } else {
      // If the clicked date is before check-in date, swap them
      if (date < checkInDate) {
        setCheckOutDate(checkInDate)
        setCheckInDate(date)
      } else {
        // Complete the selection
        setCheckOutDate(date)
      }
    }
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Check if a date is reserved
  const isReservedDate = (date) => {
    return reservedDates.some(
      (reservedDate) =>
        reservedDate.getDate() === date.getDate() &&
        reservedDate.getMonth() === date.getMonth() &&
        reservedDate.getFullYear() === date.getFullYear(),
    )
  }

  // Check if a date is within the selected range
  const isInRange = (date) => {
    if (!checkInDate || !checkOutDate) return false
    return date > checkInDate && date < checkOutDate
  }

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Selected Date Range Display */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        {checkInDate && checkOutDate ? (
          <p className="text-center font-medium">
            Check-in: {formatDate(checkInDate)} - Check-out: {formatDate(checkOutDate)}
          </p>
        ) : checkInDate ? (
          <p className="text-center font-medium">Check-in: {formatDate(checkInDate)} - Select check-out date</p>
        ) : (
          <p className="text-center font-medium">Select check-in date</p>
        )}
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-lg shadow p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const isDisabled = isPastDate(date) || isReservedDate(date)
            const isCheckIn =
              checkInDate &&
              date.getDate() === checkInDate.getDate() &&
              date.getMonth() === checkInDate.getMonth() &&
              date.getFullYear() === checkInDate.getFullYear()
            const isCheckOut =
              checkOutDate &&
              date.getDate() === checkOutDate.getDate() &&
              date.getMonth() === checkOutDate.getMonth() &&
              date.getFullYear() === checkOutDate.getFullYear()
            const isRange = isInRange(date)

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled || !isCurrentMonth}
                className={`
                  relative h-10 w-full flex items-center justify-center rounded-full text-sm
                  ${!isCurrentMonth ? "invisible" : ""}
                  ${isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                  ${isCheckIn ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                  ${isCheckOut ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                  ${isRange ? "bg-blue-100" : ""}
                  ${isRange && index % 7 === 0 ? "rounded-l-full" : ""}
                  ${isRange && index % 7 === 6 ? "rounded-r-full" : ""}
                  transition-colors
                `}
                aria-label={date.toLocaleDateString()}
              >
                {date.getDate()}
                {isReservedDate(date) && !isPastDate(date) && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded-full mr-1"></div>
            <span>In Range</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate calendar days for a month
function generateCalendarDays(month) {
  const days = []

  // Get the first day of the month
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)

  // Get the last day of the month
  const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Add days from previous month to fill the first row
  const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1)
  const lastDayOfPrevMonth = new Date(month.getFullYear(), month.getMonth(), 0)

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(lastDayOfPrevMonth)
    day.setDate(lastDayOfPrevMonth.getDate() - i)
    days.push({ date: day, isCurrentMonth: false })
  }

  // Add days of the current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const day = new Date(month.getFullYear(), month.getMonth(), i)
    days.push({ date: day, isCurrentMonth: true })
  }

  // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(month.getFullYear(), month.getMonth() + 1, i)
    days.push({ date: day, isCurrentMonth: false })
  }

  return days
}

export default DateRangePicker