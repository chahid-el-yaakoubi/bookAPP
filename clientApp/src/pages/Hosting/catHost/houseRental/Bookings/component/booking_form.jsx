import { useState, useEffect, useRef } from "react"
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns"
import { getPropertiesRooms } from "../../../../../../Lib/api"

export function BookingForm({ booking, onSubmit, onCancel, houses, created_by }) {
  console.log(booking?.propertyId?._id)
  // Form state
  const [formData, setFormData] = useState(
    booking
      ? {
        guestName: booking.guestName,
        guestPhone: booking.guestPhone || "", // Added guest phone field
        propertyId: booking?.propertyId?._id,
        roomType: booking.roomId._id || "", // Changed from roomType to roomId
        dateRange: {
          from: new Date(booking.startDate),
          to: new Date(booking.endDate),
        },
        numberOfGuests: booking?.guests,
        specialRequests: booking?.notes || "", // Changed to match schema field
        status: booking.status,
        // Payment fields
        payment: booking.payment || {
          method: "cash",
          cardLast4: "",
          cardBrand: "",
          transactionId: "",
          cashReceived: true,
          receiptNumber: "",
        }
      }
      : {
        guestName: "",
        guestPhone: "", // Added guest phone field
        propertyId: "",
        roomType: "",
        dateRange: {
          from: new Date(),
          to: addDays(new Date(), 1),
        },
        numberOfGuests: 2,
        specialRequests: "",
        status: "pending",
        // Default payment fields
        payment: {
          method: "cash",
          cardLast4: "",
          cardBrand: "",
          transactionId: "",
          cashReceived: true,
          receiptNumber: "",
        }
      }
  )

  const [rooms, setRooms] = useState([]);
  const [selectedHouse, setSelectedhouse] = useState({});
  const [suggestedGuests, setSuggestedGuests] = useState([]);
  const [basePrice, setBasePrice] = useState(0);

  const getData = async () => {
    if (!formData.propertyId) return;

    try {
      const response = await getPropertiesRooms(formData.propertyId);
      const data = response.data.map(room => ({
        id: room._id,
        name: room.type,
        price: room.price
      }));
      setRooms(data);

      const gethouse = houses.find(house => house.id === formData.propertyId);
      setSelectedhouse(gethouse);

      // Set default price based on house price
      if (gethouse) {
        setBasePrice(gethouse.price || 100);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call getData when the component mounts or propertyId changes
  useEffect(() => {
    getData();
  }, [formData.propertyId]);

  // Errors state
  const [errors, setErrors] = useState({})

  // UI state
  const [totalPrice, setTotalPrice] = useState(booking?.totalPrice || 0)
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const calendarRef = useRef(null)

  // Filter guest suggestions based on input
  const handleGuestNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      guestName: value
    }));

    // Update suggestions

    // Clear error for this field
    if (errors.guestName) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.guestName
        return newErrors
      })
    }
  };

  // Handle room type change
  const handleRoomTypeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update base price based on selected room
    if (value && selectedHouse?.type?.includes('hotel') || selectedHouse?.type?.includes('guesthouse')) {
      const selectedRoom = rooms.find(room => room.id === value);
      if (selectedRoom) {
        setBasePrice(selectedRoom.price || 100);
      }
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle payment field changes
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [name]: type === 'checkbox' ? checked : value
      }
    }))

    // Clear error for this field when user changes it
    if (errors[`payment.${name}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`payment.${name}`]
        return newErrors
      })
    }
  }

  // Handle number input change
  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle clicks outside the calendar to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [calendarRef])

  // Calculate price when relevant fields change
  useEffect(() => {
    if (formData.dateRange?.from && formData.dateRange?.to) {
      const checkIn = new Date(formData.dateRange.from)
      const checkOut = new Date(formData.dateRange.to)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

      // Use the basePrice which now gets set based on property type and room selection
      const price = basePrice * nights
      setTotalPrice(price)
    }
  }, [formData.dateRange?.from, formData.dateRange?.to, basePrice])

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    if (!formData.guestName || formData.guestName.length < 2) {
      newErrors.guestName = "Guest name must be at least 2 characters."
    }

    if (!formData.guestPhone) {
      newErrors.guestPhone = "Guest phone number is required."
    } else if (!/^\+?[0-9\s\-()]{8,15}$/.test(formData.guestPhone)) {
      newErrors.guestPhone = "Please enter a valid phone number."
    }

    if (!formData.propertyId) {
      newErrors.propertyId = "Please select a property."
    }

    if ((selectedHouse?.type?.includes('hotel') || selectedHouse?.type?.includes('guesthouse')) && !formData.roomType) {
      newErrors.roomType = "Please select a room type."
    }

    if (!formData.dateRange?.from) {
      newErrors.dateRangeFrom = "Please select a check-in date."
    }

    if (!formData.dateRange?.to) {
      newErrors.dateRangeTo = "Please select a check-out date."
    }

    if (formData.dateRange?.from && formData.dateRange?.to && formData.dateRange.to <= formData.dateRange.from) {
      newErrors.dateRangeTo = "Check-out date must be after check-in date"
    }

    const numGuests = Number(formData.numberOfGuests)
    if (!numGuests || numGuests < 1) {
      newErrors.numberOfGuests = "At least 1 guest is required."
    } else if (numGuests > 10) {
      newErrors.numberOfGuests = "Maximum 10 guests allowed."
    }

    // Payment validation
    if (!formData.payment.method) {
      newErrors["payment.method"] = "Payment method is required."
    }

    // Validate card details if payment method is card
    if (formData.payment.method === "card") {
      if (!formData.payment.cardLast4 || !/^\d{4}$/.test(formData.payment.cardLast4)) {
        newErrors["payment.cardLast4"] = "Last 4 digits of card are required."
      }
      if (!formData.payment.cardBrand) {
        newErrors["payment.cardBrand"] = "Card brand is required."
      }
      if (!formData.payment.transactionId) {
        newErrors["payment.transactionId"] = "Transaction ID is required for card payments."
      }
    }

    // Validate bank transfer details
    if (formData.payment.method === "bank_transfer" && !formData.payment.receiptNumber) {
      newErrors["payment.receiptNumber"] = "Receipt number is required for bank transfers."
    }

    // Validate transaction ID for online payments
    if (["bank_transfer", "paypal"].includes(formData.payment.method) && !formData.payment.transactionId) {
      newErrors["payment.transactionId"] = "Transaction ID is required."
    }

    return newErrors
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const newBooking = {
      // id: booking?.id || `BK${Math.floor(Math.random() * 10000)}`,
      created_by: created_by,
      guestName: formData.guestName,
      guestPhone: formData.guestPhone,
      userId: 'rfr',
      propertyId: formData.propertyId,
      roomId: formData.roomType || null, // Changed from roomType to roomId
      startDate: format(formData.dateRange.from, "yyyy-MM-dd"),
      endDate: format(formData.dateRange.to, "yyyy-MM-dd"),
      status: formData.status,
      guests: formData.numberOfGuests,
      totalPrice: totalPrice,
      notes: formData.specialRequests, // Changed from specialRequests to notes
      payment: {
        method: formData.payment.method,
        cardLast4: formData.payment.cardLast4 || undefined,
        cardBrand: formData.payment.cardBrand || undefined,
        transactionId: formData.payment.transactionId || undefined,
        cashReceived: formData.payment.method === "cash" ? formData.payment.cashReceived : undefined,
        receiptNumber: formData.payment.method === "bank_transfer" ? formData.payment.receiptNumber : undefined
      }
    }
    booking ? onSubmit(booking._id, newBooking) : onSubmit(newBooking);

  }

  // Calendar helper functions
  const getMonthDays = (month) => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))

    const days = []
    let day = start

    while (day <= end) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }

  const handleDateClick = (day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isBefore(day, today)) {
      return // Don't allow selecting dates in the past
    }

    const currentRange = formData.dateRange || { from: null, to: null }

    if (!currentRange.from || (currentRange.from && currentRange.to)) {
      // Start a new range
      setFormData(prev => ({
        ...prev,
        dateRange: { from: day, to: null }
      }))

      // Clear any date-related errors
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.dateRangeFrom
        delete newErrors.dateRangeTo
        return newErrors
      })
    } else if (isBefore(day, currentRange.from)) {
      // Selected date is before the start date, so make it the new start date
      setFormData(prev => ({
        ...prev,
        dateRange: { from: day, to: null }
      }))
    } else {
      // Complete the range
      setFormData(prev => ({
        ...prev,
        dateRange: { from: currentRange.from, to: day }
      }))
      setShowCalendar(false)
    }
  }

  const isInRange = (day) => {
    const range = formData.dateRange || { from: null, to: null }
    if (!range.from || !range.to) return false
    return isAfter(day, range.from) && isBefore(day, range.to)
  }

  const isRangeStart = (day) => {
    const range = formData.dateRange || { from: null, to: null }
    if (!range.from) return false
    return isSameDay(day, range.from)
  }

  const isRangeEnd = (day) => {
    const range = formData.dateRange || { from: null, to: null }
    if (!range.to) return false
    return isSameDay(day, range.to)
  }

  const isToday = (day) => {
    return isSameDay(day, new Date())
  }

  const isPastDay = (day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return isBefore(day, today)
  }

  const renderCalendar = () => {
    const days = getMonthDays(currentMonth)
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
          <button type="button" onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}

          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isPastDay(day)}
                className={`
                  h-9 w-9 rounded-md flex items-center justify-center text-sm
                  ${!isCurrentMonth ? "text-gray-300" : isPastDay(day) ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}
                  ${isToday(day) ? "border border-blue" : ""}
                  ${isRangeStart(day) ? "bg-blue text-white hover:bg-blue" : ""}
                  ${isRangeEnd(day) ? "bg-blue text-white hover:bg-blue" : ""}
                  ${isInRange(day) ? "bg-blue text-blue" : ""}
                `}
              >
                {format(day, "d")}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={() => setShowCalendar(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              const range = formData.dateRange || { from: null, to: null }
              if (range.from && !range.to) {
                // If only start date is selected, set end date to start date + 1
                setFormData(prev => ({
                  ...prev,
                  dateRange: { from: range.from, to: addDays(range.from, 1) }
                }))
              }
              setShowCalendar(false)
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue rounded-md hover:bg-blue"
          >
            Apply
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 -top-10 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slide-up ">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">{booking ? "Edit Booking" : "Add New Booking"}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {booking ? "Update the booking details below." : "Fill in the details to create a new booking."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Name - Changed to input with datalist for suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name*</label>
              <div className="relative">
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleGuestNameChange}
                  list="guestSuggestions"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                  placeholder="Enter guest name"
                  required
                />
                <datalist id="guestSuggestions">
                  {suggestedGuests.map((guest) => (
                    <option key={guest} value={guest} />
                  ))}
                </datalist>
              </div>
              {errors.guestName && <p className="mt-1 text-sm text-red-600">{errors.guestName}</p>}
            </div>

            {/* Guest Phone Number - New field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Phone*</label>
              <input
                type="tel"
                name="guestPhone"
                value={formData.guestPhone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                placeholder="+1234567890"
                required
              />
              {errors.guestPhone && <p className="mt-1 text-sm text-red-600">{errors.guestPhone}</p>}
            </div>

            {/* Property */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property*</label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                required
              >
                <option value="">Select a property</option>
                {houses?.map((property) => (
                  <option selected={property.id === formData.propertyId} key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              {errors.propertyId && <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>}
            </div>

            {/* Room Type - Only show for hotel or guesthouse types */}
            {(selectedHouse?.type?.includes('hotel') || selectedHouse?.type?.includes('guesthouse')) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type*</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleRoomTypeChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                  required
                >
                  <option value="">Select room type</option>
                  {rooms?.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} - ${room.price}/night
                    </option>
                  ))}
                </select>
                {errors.roomType && <p className="mt-1 text-sm text-red-600">{errors.roomType}</p>}
              </div>
            )}

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests*</label>
              <input
                type="number"
                name="numberOfGuests"
                min="1"
                max="10"
                value={formData.numberOfGuests}
                onChange={handleNumberChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                required
              />
              {errors.numberOfGuests && <p className="mt-1 text-sm text-red-600">{errors.numberOfGuests}</p>}
            </div>

            {/* Date Range */}
            <div className="col-span-2 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Stay Dates*</label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue text-left"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formData.dateRange?.from ? (
                    formData.dateRange.to ? (
                      <>
                        {format(formData.dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(formData.dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(formData.dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span className="text-gray-500">Select date range</span>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {errors.dateRangeFrom && <p className="mt-1 text-sm text-red-600">{errors.dateRangeFrom}</p>}
              {errors.dateRangeTo && <p className="mt-1 text-sm text-red-600">{errors.dateRangeTo}</p>}

              {showCalendar && (
                <div ref={calendarRef} className="absolute z-10 mt-1 w-full">
                  {renderCalendar()}
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="col-span-2 border-t pt-4 mt-2">
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method*</label>
                <select
                  name="method"
                  value={formData.payment.method}
                  onChange={handlePaymentChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Other</option>
                </select>
                {errors["payment.method"] && <p className="mt-1 text-sm text-red-600">{errors["payment.method"]}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card Payment Fields */}
                {formData.payment.method === "card" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 Digits*</label>
                      <input
                        type="text"
                        name="cardLast4"
                        value={formData.payment.cardLast4}
                        onChange={handlePaymentChange}
                        maxLength="4"
                        pattern="\d{4}"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                        placeholder="1234"
                        required
                      />
                      {errors["payment.cardLast4"] && <p className="mt-1 text-sm text-red-600">{errors["payment.cardLast4"]}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Brand*</label>
                      <select
                        name="cardBrand"
                        value={formData.payment.cardBrand}
                        onChange={handlePaymentChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm

                        focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                        required
                      >
                        <option value="">Select card brand</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">MasterCard</option>
                        <option value="amex">American Express</option>
                        <option value="discover">Discover</option>
                        <option value="other">Other</option>
                      </select>
                      {errors["payment.cardBrand"] && <p className="mt-1 text-sm text-red-600">{errors["payment.cardBrand"]}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID*</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.payment.transactionId}
                        onChange={handlePaymentChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                        placeholder="Enter transaction ID"
                        required
                      />
                      {errors["payment.transactionId"] && <p className="mt-1 text-sm text-red-600">{errors["payment.transactionId"]}</p>}
                    </div>
                  </>
                )}

                {/* Cash Payment Fields */}
                {formData.payment.method === "cash" && (
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="cashReceived"
                        name="cashReceived"
                        checked={formData.payment.cashReceived}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-blue focus:ring-blue border-gray-300 rounded"
                      />
                      <label htmlFor="cashReceived" className="ml-2 block text-sm text-gray-700">
                        Cash received
                      </label>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Fields */}
                {formData.payment.method === "bank_transfer" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number*</label>
                      <input
                        type="text"
                        name="receiptNumber"
                        value={formData.payment.receiptNumber}
                        onChange={handlePaymentChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                        placeholder="Enter receipt number"
                        required
                      />
                      {errors["payment.receiptNumber"] && <p className="mt-1 text-sm text-red-600">{errors["payment.receiptNumber"]}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID*</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.payment.transactionId}
                        onChange={handlePaymentChange}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                        placeholder="Enter transaction ID"
                        required
                      />
                      {errors["payment.transactionId"] && <p className="mt-1 text-sm text-red-600">{errors["payment.transactionId"]}</p>}
                    </div>
                  </>
                )}

                {/* PayPal Fields */}
                {formData.payment.method === "paypal" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID*</label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.payment.transactionId}
                      onChange={handlePaymentChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                      placeholder="Enter transaction ID"
                      required
                    />
                    {errors["payment.transactionId"] && <p className="mt-1 text-sm text-red-600">{errors["payment.transactionId"]}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Total Price Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
              <div className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3">
                ${totalPrice.toFixed(2)}
              </div>
            </div>

            {/* Special Requests - Full width */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                placeholder="Enter any special requests or notes"
              ></textarea>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue border border-transparent rounded-md shadow-sm hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
            >
              {booking ? "Update Booking" : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}