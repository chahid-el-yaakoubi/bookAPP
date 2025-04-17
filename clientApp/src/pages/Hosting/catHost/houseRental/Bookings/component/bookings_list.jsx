
import { useContext, useEffect, useState } from "react"
import { BookingForm } from "./booking_form"
import { mockBookings } from "../../../../../../Lib/moc_data"
import { createBooking, deleteBooking, getBookings, getProperties, updateBooking } from "../../../../../../Lib/api"
import { AuthContext } from "../../../../../../contextApi/AuthContext"

export function BookingsList() {
  const [data, setData] = useState([])
  const [isAddingBooking, setIsAddingBooking] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [removeBooking, setRemoveBooking] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })

  const { state } = useContext(AuthContext);
  const created_by = state.user?.id;

  const [houses, setHouses] = useState([]);

  const getData = async () => {
    try {
      const response = await getProperties();
      const data = response.data.map(hotel => ({
        id: hotel._id,
        name: hotel.title,
        type: hotel.type.type,
        rooms: hotel.rooms,
        price: hotel.pricing.nightly_rate
      }));
      setHouses(data);
      const res = await getBookings();
      setData(res.data)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 
  // Handle deleting a booking
  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const res = await deleteBooking(id);
      if(res.status === 200){
        getData()
      }

    }
  }
  // Call getData when the component mounts
  useEffect(() => {
    getData();
  }, []);

  // Sorting function
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0

    const key = sortConfig.key

    // Handle null or undefined values
    if (a[key] === undefined || a[key] === null) return 1
    if (b[key] === undefined || b[key] === null) return -1

    if (key === "totalPrice") {
      return sortConfig.direction === "ascending" ? a[key] - b[key] : b[key] - a[key]
    }

    if (key === "startDate" || key === "endDate") {
      return sortConfig.direction === "ascending"
        ? new Date(a[key]) - new Date(b[key])
        : new Date(b[key]) - new Date(a[key])
    }

    return sortConfig.direction === "ascending" ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
  })

  // Filtering function
  const filteredData = sortedData.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredData ? filteredData.slice(indexOfFirstRow, indexOfLastRow) : []
  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage)

  // Request sort
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Handle adding a new booking
  const handleAddBooking = async (newBooking) => {
    await createBooking(newBooking)
    getData() // Refresh data after adding
    setIsAddingBooking(false)
  }

  // Handle updating a booking
  const handleUpdateBooking = async (id, updatedBooking) => {
    await updateBooking(id, updatedBooking)
    getData() // Refresh data after update
    setEditingBooking(false)
  }



  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? "↑" : "↓"
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
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

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Get property name by ID
  const getPropertyName = (propertyId) => {
    const property = houses.find(house => house.id === propertyId);
    return property ? property.name : "Unknown Property";
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by guest name or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue mt-3"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-8 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="w-full sm:w-40 space-y-2 flex justify-between gap-4 items-center ">
            {["all", "confirmed", "pending", "cancelled"].map((status, i) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`${i === 0 ? 'mt-2 px-4' : ''} w-full px-3 py-2 text-left border rounded-full ${statusFilter === status
                  ? "bg-blue text-white border-blue"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddingBooking(true)}
          className="group cursor-pointer outline-none hover:rotate-90 duration-300 shadow-xl shadow-blue w-14 rounded-full"
          title="Add New"
        >
          <svg
            className="stroke-primary fill-none group-hover:fill-blue group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
            viewBox="0 0 24 24"
            height="50px"
            width="50px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeWidth="1.5"
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            ></path>
            <path strokeWidth="1.5" d="M8 12H16"></path>
            <path strokeWidth="1.5" d="M12 16V8"></path>
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Booking ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("guestName")}
              >
                Guest Name {getSortIndicator("guestName")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Property/Hotel Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("startDate")}
              >
                Check-In Date {getSortIndicator("startDate")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Check-Out Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("totalPrice")}
              >
                Total Price {getSortIndicator("totalPrice")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.length > 0 ? (
              currentRows.map((booking, i) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i<10 ? ("BK_0" + (i+1)) : 'BK_' +(i+1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guestName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPropertyName(booking.propertyId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(booking.startDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(booking.endDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(booking.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingBooking(booking)} className="text-blue hover:text-blue">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => window.open(`/host/properties/bookings/${booking._id}`, "_blank")}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredData.length)} of {filteredData.length}{" "}
          entries
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 || totalPages === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages || totalPages === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isAddingBooking && <BookingForm onSubmit={handleAddBooking} onCancel={() => setIsAddingBooking(false)} houses={houses} created_by={created_by} />}

      {editingBooking && (
        <BookingForm booking={editingBooking} onSubmit={handleUpdateBooking} onCancel={() => setEditingBooking(null)} houses={houses} created_by={created_by} />
      )}
    </div>
  )
}