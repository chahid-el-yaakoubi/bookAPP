// clientApp/src/pages/Hosting/catHost/houseRental/Bookings/page.jsx
import { useEffect, useState } from "react"
import { BookingForm } from "./component/booking_form"
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from "../../../../../hooks/useFetch";
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaEnvelope, FaHotel } from 'react-icons/fa';
import BookingPreview from "./BookingPdf/components/booking-preview";
import BookingConfirmation from "./BookingPdf/page";

export default function BookingDetailsPage({ houses }) {
  const [booking, setBooking] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const { id } = useParams()
  const { data, loading: fetchLoading, error, reFetch } = useFetch(`/api/bookings/${id}`);
  const navigate = useNavigate()
  console.log(booking?.property_details)
  useEffect(() => {
    if (data) {
      setBooking(data)
      setLoading(false)
    }
  }, [data])

  const handleUpdateBooking = (updatedBooking) => {
    setBooking(updatedBooking)
    setIsEditing(false)
    reFetch() // Refresh data after update
  }

  if (loading || fetchLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-10">
        <button onClick={() => {
          navigate('/host/properties/bookings')
        }} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Bookings
        </button>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Booking not found</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate nights
  const checkIn = new Date(booking?.startDate)
  const checkOut = new Date(booking?.endDate)
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format price for Moroccan Dirham
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("ar-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Get creation date
  const createdAt = new Date(booking?.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  return (
    <div className="container mx-auto py-10">
      <button onClick={() => {
        navigate('/host/properties/bookings')
      }} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Bookings
      </button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Booking #{booking?.bookingId}</h2>
                <p className="text-sm text-gray-500 mt-1">Created on {createdAt}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 sm:mt-0 ${getStatusColor(booking?.status)}`}
              >
                {booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1)}
              </span>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium leading-none">Guest</p>
                      <p className="text-sm text-gray-500">{booking?.guestName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaHotel className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium leading-none">Property</p>
                      <p className="text-sm text-gray-500">{booking?.propertyId?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium leading-none">Payment</p>
                      <p className="text-sm text-gray-500">{booking?.payment?.method} {booking?.payment?.cashReceived ? '(Received)' : '(Pending)'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium leading-none">Check-in</p>
                      <p className="text-sm text-gray-500">{formatDate(booking?.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium leading-none">Check-out</p>
                      <p className="text-sm text-gray-500">{formatDate(booking?.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCheckCircle className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium leading-none">Duration</p>
                      <p className="text-sm text-gray-500">{nights} nights</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Room Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Room Type</p>
                    <p className="text-sm text-gray-500">{booking?.roomId?.type}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Guests</p>
                    <p className="text-sm text-gray-500">{booking?.guests} Adults</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Room Size</p>
                    <p className="text-sm text-gray-500">{booking?.roomId?.size?.value} {booking?.roomId?.size?.unit}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Room Status</p>
                    <p className="text-sm text-gray-500">{booking?.roomId?.status}</p>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Room Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {booking?.roomId?.roomFeatures?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {feature.split('_').map(word => word?.charAt(0).toUpperCase() + word?.slice(1)).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">View</h3>
                <div className="flex flex-wrap gap-2">
                  {booking?.roomId?.view?.map((viewType, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {viewType}
                    </span>
                  ))}
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notes</h3>
                <p className="text-sm text-gray-500">{booking?.notes || "No notes provided."}</p>
              </div>
            </div>
            <div className="flex justify-between p-6 border-t">
              {/* <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Booking
              </button> */}
              <button className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700">
                Cancel Booking
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Booking Timeline</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                      <FaCheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-full w-px bg-gray-200" />
                  </div>
                  <div className="space-y-1 pt-2">
                    <p className="text-sm font-medium">Booking Created</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking?.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                      <FaMoneyBillWave className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-full w-px bg-gray-200" />
                  </div>
                  <div className="space-y-1 pt-2">
                    <p className="text-sm font-medium">Payment {booking?.payment?.cashReceived ? 'Received' : 'Processing'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking?.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                      <FaEnvelope className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1 pt-2">
                    <p className="text-sm font-medium">Confirmation Email Sent</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking?.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <BookingConfirmation bookingData={booking} />
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Price Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Room Rate ({nights} nights)</span>
                  <span className="text-sm font-medium">
                    {booking?.totalPrice * 1} MAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taxes & Fees</span>
                  <span className="text-sm font-medium">
                    {/* {formatPrice(booking?.totalPrice * 0.2)} */}
                    0 Mad
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {booking?.totalPrice} MAD
                  </span>
                </div>
                {booking?.payment?.method === 'cash' && (
                  <>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{booking?.payment?.cashReceived ? 'Cash Received' : 'Cash Expected'}</span>
                      <span>
                        {booking?.totalPrice} MAD
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Balance Due</span>
                      <span>
                        {booking?.payment?.cashReceived ? 0 : booking?.totalPrice} MAD
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>


          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Guest Information</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Contact Information</p>
                  <p className="text-sm">Name: {booking?.guestName}</p>
                  <p className="text-sm">Phone: {booking?.guestPhone}</p>
                </div>
                <hr />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Booking Created By</p>
                  <p className="text-sm">Name: {booking?.created_by?.fullName}</p>
                  <p className="text-sm">Email: {booking?.created_by?.email}</p>
                  <p className="text-sm">Phone: {booking?.created_by?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Property Information</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-md">
                  <img
                    src={booking?.propertyId?.property_details?.photos[0]?.url}
                    alt="Property"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm">{booking?.propertyId?.location?.neighborhood}</p>
                  <p className="text-sm">{booking?.propertyId?.location?.city}, {booking?.propertyId?.location?.region}</p>
                  <p className="text-sm">{booking?.propertyId?.location?.country}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Property Features</p>
                  <div className="flex flex-wrap gap-2">
                    {booking?.propertyId?.accessibility_features && Object.entries(booking?.propertyId?.accessibility_features)
                      .filter(([_, value]) => value === true)
                      .map(([key, _], index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs">
                          {key.split('_').map(word => word?.charAt(0).toUpperCase() + word?.slice(1)).join(' ')}
                        </span>
                      ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.open(`/hotel/${booking?.propertyId?._id}`, '_blank')
                  }}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  View Property Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <BookingForm booking={booking} onSubmit={handleUpdateBooking} onCancel={() => setIsEditing(false)} />
      )}
    </div>
  )
}

function Check(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function Mail(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}