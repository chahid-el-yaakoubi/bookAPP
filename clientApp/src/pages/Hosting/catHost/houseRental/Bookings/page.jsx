
// import { useEffect, useState } from "react"
// import { mockBookings } from "../../../../../Lib/moc_data"
// import { BookingForm } from "./component/booking_form"
// import { useNavigate } from 'react-router-dom';

// export default function BookingDetailsPage({ params }) {
//   const [booking, setBooking] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [loading, setLoading] = useState(true)

//   const navigate = useNavigate()

//   useEffect(() => {
//     // In a real app, this would be an API call
//     const foundBooking = mockBookings.find((b) => b.id === params?.id || "BK1001")
//     setBooking(foundBooking || null)
//     setLoading(false)
//   }, [params?.id])

//   const handleUpdateBooking = (updatedBooking) => {
//     setBooking(updatedBooking)
//     setIsEditing(false)
//     // In a real app, this would update the database
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-10">
//         <div className="flex items-center justify-center h-64">
//           <p className="text-lg">Loading booking details...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!booking) {
//     return (
//       <div className="container mx-auto py-10">
//         <button onClick={() => {
//           navigate('/host/properties/bookings')
//         }} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//             <path
//               fillRule="evenodd"
//               d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Back to Bookings
//         </button>
//         <div className="flex items-center justify-center h-64">
//           <p className="text-lg">Booking not found</p>
//         </div>
//       </div>
//     )
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "cancelled":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   // Calculate nights
//   const checkIn = new Date(booking.checkInDate)
//   const checkOut = new Date(booking.checkOutDate)
//   const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

//   // Format dates
//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <button onClick={() => {
//           navigate('/host/properties/bookings')
//         }} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//             <path
//               fillRule="evenodd"
//               d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Back to Bookings
//         </button>

//       <div className="grid gap-6 md:grid-cols-3">
//         <div className="md:col-span-2 space-y-6">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b">
//               <div>
//                 <h2 className="text-2xl font-bold">Booking #{booking.id}</h2>
//                 <p className="text-sm text-gray-500 mt-1">Created on April 23, 2023</p>
//               </div>
//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 sm:mt-0 ${getStatusColor(booking.status)}`}
//               >
//                 {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//               </span>
//             </div>
//             <div className="p-6">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-gray-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium leading-none">Guest</p>
//                       <p className="text-sm text-gray-500">{booking.guestName}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-gray-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium leading-none">Property</p>
//                       <p className="text-sm text-gray-500">{booking.propertyName}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-gray-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
//                       <path
//                         fillRule="evenodd"
//                         d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium leading-none">Payment</p>
//                       <p className="text-sm text-gray-500">Visa ending in 4242</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-gray-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium leading-none">Check-in</p>
//                       <p className="text-sm text-gray-500">{formatDate(booking.checkInDate)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-gray-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium leading-none">Check-out</p>
//                       <p className="text-sm text-gray-500">{formatDate(booking.checkOutDate)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-gray-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div>
//                       <p className="text-sm font-medium leading-none">Duration</p>
//                       <p className="text-sm text-gray-500">{nights} nights</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <hr className="my-6" />

//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium">Room Details</h3>
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="rounded-lg border p-3">
//                     <p className="font-medium">Room Type</p>
//                     <p className="text-sm text-gray-500">Deluxe Room</p>
//                   </div>
//                   <div className="rounded-lg border p-3">
//                     <p className="font-medium">Guests</p>
//                     <p className="text-sm text-gray-500">2 Adults, 1 Child</p>
//                   </div>
//                   <div className="rounded-lg border p-3">
//                     <p className="font-medium">Bed Type</p>
//                     <p className="text-sm text-gray-500">King Size</p>
//                   </div>
//                   <div className="rounded-lg border p-3">
//                     <p className="font-medium">Amenities</p>
//                     <p className="text-sm text-gray-500">Wi-Fi, Breakfast, Pool Access</p>
//                   </div>
//                 </div>
//               </div>

//               <hr className="my-6" />

//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium">Special Requests</h3>
//                 <p className="text-sm text-gray-500">{booking.specialRequests || "No special requests provided."}</p>
//               </div>
//             </div>
//             <div className="flex justify-between p-6 border-t">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                 </svg>
//                 Edit Booking
//               </button>
//               <button className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700">
//                 Cancel Booking
//               </button>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h3 className="text-lg font-medium">Booking Timeline</h3>
//             </div>
//             <div className="p-6">
//               <div className="space-y-4">
//                 <div className="flex">
//                   <div className="mr-4 flex flex-col items-center">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
//                       <Check className="h-5 w-5 text-white" />
//                     </div>
//                     <div className="h-full w-px bg-gray-200" />
//                   </div>
//                   <div className="space-y-1 pt-2">
//                     <p className="text-sm font-medium">Booking Created</p>
//                     <p className="text-xs text-gray-500">April 23, 2023 at 2:45 PM</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <div className="mr-4 flex flex-col items-center">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-white"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
//                         <path
//                           fillRule="evenodd"
//                           d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <div className="h-full w-px bg-gray-200" />
//                   </div>
//                   <div className="space-y-1 pt-2">
//                     <p className="text-sm font-medium">Payment Processed</p>
//                     <p className="text-xs text-gray-500">April 23, 2023 at 2:47 PM</p>
//                   </div>
//                 </div>
//                 <div className="flex">
//                   <div className="mr-4 flex flex-col items-center">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
//                       <Mail
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-white"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-1 pt-2">
//                     <p className="text-sm font-medium">Confirmation Email Sent</p>
//                     <p className="text-xs text-gray-500">April 23, 2023 at 2:50 PM</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h3 className="text-lg font-medium">Price Breakdown</h3>
//             </div>
//             <div className="p-6">
//               <div className="space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-sm">Room Rate ({nights} nights)</span>
//                   <span className="text-sm font-medium">
//                     {new Intl.NumberFormat("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     }).format(booking.totalPrice * 0.8)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm">Taxes & Fees</span>
//                   <span className="text-sm font-medium">
//                     {new Intl.NumberFormat("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     }).format(booking.totalPrice * 0.2)}
//                   </span>
//                 </div>
//                 <hr />
//                 <div className="flex justify-between font-medium">
//                   <span>Total</span>
//                   <span>
//                     {new Intl.NumberFormat("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     }).format(booking.totalPrice)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>Deposit Paid</span>
//                   <span>
//                     {new Intl.NumberFormat("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     }).format(booking.totalPrice * 0.3)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between font-medium">
//                   <span>Balance Due</span>
//                   <span>
//                     {new Intl.NumberFormat("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     }).format(booking.totalPrice * 0.7)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h3 className="text-lg font-medium">Guest Information</h3>
//             </div>
//             <div className="p-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Contact Information</p>
//                   <p className="text-sm">Email: guest@example.com</p>
//                   <p className="text-sm">Phone: +1 (555) 123-4567</p>
//                 </div>
//                 <hr />
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Address</p>
//                   <p className="text-sm">123 Main Street</p>
//                   <p className="text-sm">Anytown, CA 12345</p>
//                   <p className="text-sm">United States</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h3 className="text-lg font-medium">Property Information</h3>
//             </div>
//             <div className="p-6">
//               <div className="space-y-4">
//                 <div className="aspect-video overflow-hidden rounded-md">
//                   <img
//                     src="/placeholder.svg?height=200&width=400"
//                     alt="Property"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Address</p>
//                   <p className="text-sm">789 Resort Drive</p>
//                   <p className="text-sm">Paradise Bay, FL 67890</p>
//                   <p className="text-sm">United States</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Contact</p>
//                   <p className="text-sm">Phone: +1 (555) 987-6543</p>
//                   <p className="text-sm">Email: info@property.com</p>
//                 </div>
//                 <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
//                   View Property Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isEditing && (
//         <BookingForm booking={booking} onSubmit={handleUpdateBooking} onCancel={() => setIsEditing(false)} />
//       )}
//     </div>
//   )
// }

// function Check(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polyline points="20 6 9 17 4 12" />
//     </svg>
//   )
// }

// function Mail(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect width="20" height="16" x="2" y="4" rx="2" />
//       <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//     </svg>
//   )
// }
