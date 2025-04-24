"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Home, Hotel, Calendar } from "lucide-react"

export default function AdminBookingCalendar({ initialBlockedDates = [], priceCode = "MAD400", onDatesChange }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates)
  const [calendarDays, setCalendarDays] = useState([])
  const [propertyType, setPropertyType] = useState("house")
  const [viewMode, setViewMode] = useState("monthly")

  // Generate calendar days for the current month view
  useEffect(() => {
    const days = generateCalendarDays(currentDate)
    setCalendarDays(days)
  }, [currentDate])

  // Handle date click to block/unblock
  const handleDateClick = (date) => {
    // Don't allow selection of past dates
    if (isPastDate(date)) return

    const isBlocked = isDateBlocked(date)

    if (isBlocked) {
      // Unblock the date
      const newBlockedDates = blockedDates.filter(
        (blockedDate) =>
          !(
            blockedDate.getDate() === date.getDate() &&
            blockedDate.getMonth() === date.getMonth() &&
            blockedDate.getFullYear() === date.getFullYear()
          ),
      )
      setBlockedDates(newBlockedDates)
      onDatesChange?.(newBlockedDates)
    } else {
      // Block the date
      const newBlockedDates = [...blockedDates, new Date(date)]
      setBlockedDates(newBlockedDates)
      onDatesChange?.(newBlockedDates)
    }
  }

  // Navigate to previous month/year
  const goToPrevious = () => {
    if (viewMode === "monthly") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1))
    }
  }

  // Navigate to next month/year
  const goToNext = () => {
    if (viewMode === "monthly") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1))
    }
  }

  // Check if a date is blocked
  const isDateBlocked = (date) => {
    return blockedDates.some(
      (blockedDate) =>
        blockedDate.getDate() === date.getDate() &&
        blockedDate.getMonth() === date.getMonth() &&
        blockedDate.getFullYear() === date.getFullYear(),
    )
  }

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Format month name
  const formatMonth = (date, locale = "en-US") => {
    return date.toLocaleDateString(locale, { month: "long", year: "numeric" })
  }

  // Format year
  const formatYear = (date) => {
    return date.getFullYear().toString()
  }

  // Handle month selection in yearly view
  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1))
    setViewMode("monthly")
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative inline-block">
            <select
              className="appearance-none bg-white border border-blue text-blue py-2 pl-10 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="house">House</option>
              <option value="room">Room</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-blue">
              {propertyType === "house" ? <Home className="h-5 w-5" /> : <Hotel className="h-5 w-5" />}
            </div>
          </div>

          <div className="relative inline-block">
            <select
              className="appearance-none bg-white border border-blue text-blue py-2 pl-10 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="monthly">Monthly View</option>
              <option value="yearly">Yearly View</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-blue">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-blue hover:bg-blue text-blue transition-colors"
            aria-label={viewMode === "monthly" ? "Previous month" : "Previous year"}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-4 items-center">
            <h2 className="text-lg font-medium text-blue">
              {viewMode === "monthly" ? formatMonth(currentDate).toLowerCase() : formatYear(currentDate)}
            </h2>
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-blue hover:bg-blue text-blue transition-colors"
            aria-label={viewMode === "monthly" ? "Next month" : "Next year"}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Monthly View */}
      {viewMode === "monthly" && (
        <div className="bg-white border border-blue rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 bg-blue">
            {["L", "M", "M", "J", "V", "S", "D"].map((day) => (
              <div key={day} className="text-center py-3 text-blue font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const isBlocked = isDateBlocked(date)
              const isPast = isPastDate(date)

              // Only show days from the current month
              if (!isCurrentMonth) {
                return <div key={`empty-${index}`} className="min-h-[80px]"></div>
              }

              return (
                <div
                  key={`day-${index}`}
                  className={`
                    min-h-[80px] border-t border-r last:border-r-0 p-1 transition-colors
                    ${isPast ? "bg-gray-100" : ""}
                    ${isBlocked && !isPast ? "bg-blue text-white" : ""}
                    ${!isPast && !isBlocked ? "hover:bg-blue" : ""}
                    ${isPast ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                  onClick={() => !isPast && handleDateClick(date)}
                >
                  <div className="flex flex-col h-full">
                    <div
                      className={`
                        text-sm p-1 font-medium 
                        ${isBlocked && !isPast ? "text-white" : ""}
                        ${isPast ? "text-gray-400" : ""}
                      `}
                    >
                      {date.getDate()}
                    </div>
                    <div
                      className={`
                        text-xs mt-auto 
                        ${isBlocked && !isPast ? "text-orange-300" : "text-orange-500"}
                        ${isPast ? "text-gray-400" : ""}
                      `}
                    >
                      {priceCode}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Yearly View */}
      {viewMode === "yearly" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date(currentDate.getFullYear(), i, 1)
            const monthName = monthDate.toLocaleDateString("en-US", { month: "long" })

            // Count blocked days in this month
            const daysInMonth = new Date(currentDate.getFullYear(), i + 1, 0).getDate()
            let blockedCount = 0

            for (let day = 1; day <= daysInMonth; day++) {
              const date = new Date(currentDate.getFullYear(), i, day)
              if (isDateBlocked(date)) {
                blockedCount++
              }
            }

            return (
              <div
                key={`month-${i}`}
                className="bg-white border border-blue rounded-lg overflow-hidden shadow-sm cursor-pointer hover:border-blue transition-colors"
                onClick={() => handleMonthSelect(i)}
              >
                <div className="bg-blue py-2 text-center text-blue font-medium">{monthName}</div>
                <div className="p-3 text-center">
                  <div className="text-3xl font-bold text-blue">{blockedCount}</div>
                  <div className="text-xs text-blue">blocked days</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex gap-6 text-sm bg-white p-4 rounded-lg border border-blue shadow-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue mr-2 rounded"></div>
          <span className="text-blue">Blocked dates</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 mr-2 rounded"></div>
          <span className="text-blue">Past dates</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border border-blue mr-2 rounded"></div>
          <span className="text-blue">Available dates</span>
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
  // Adjust for Monday as first day of week (European calendar)
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7

  // Add placeholder days for the first row
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ date: new Date(), isCurrentMonth: false })
  }

  // Add days of the current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const day = new Date(month.getFullYear(), month.getMonth(), i)
    days.push({ date: day, isCurrentMonth: true })
  }

  // Calculate remaining days to fill the grid (6 rows x 7 days = 42 cells)
  const remainingDays = 42 - days.length

  // Add placeholder days for the last rows
  for (let i = 0; i < remainingDays; i++) {
    days.push({ date: new Date(), isCurrentMonth: false })
  }

  return days
}
