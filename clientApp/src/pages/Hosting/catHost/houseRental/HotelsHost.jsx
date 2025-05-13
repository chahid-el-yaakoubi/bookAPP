import { useState, useEffect, useContext } from 'react';
import { FaSearch, FaTimes, FaList, FaThLarge, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaEye, FaHotel } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import HostLayout from '../../ComponentHost/HostLayout';
import TopNavHost from '../../ComponentHost/TopNavHost';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';

import { getProperties, getPropertiesAdmin, deleteProperty } from '../../../../Lib/api';
import { AuthContext } from '../../../../contextApi/AuthContext';
import { FaHouse } from 'react-icons/fa6';

const HotelsHost = ({ setHousesType, setHotelsType, ListType }) => {
  const { state } = useContext(AuthContext);
  let adminId = state?.user?.id;
  const { id } = useParams();

  if (id) {
    adminId = id
  }
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const partner = queryParams.get('partner');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const storedItemsPerPage = localStorage.getItem('propertiesItemsPerPage');
    return storedItemsPerPage ? parseInt(storedItemsPerPage, 10) : 5;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'title',
    direction: 'asc'
  });

  // Update localStorage when items per page changes
  useEffect(() => {
    localStorage.setItem('propertiesItemsPerPage', itemsPerPage.toString());
  }, [itemsPerPage]);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await getPropertiesAdmin(adminId, 'multi');
      const formattedData = response.data.map(property => ({
        id: property._id,
        title: property.title,
        type: property.type?.type || 'N/A',
        location: property.location?.city || 'N/A',
        roomsCount: property?.roomSummary?.totalRooms || 0,
        available: property.roomSummary?.roomStatus?.available || 0,
        booked: property.roomSummary?.roomStatus?.booked || 0,
        maintenance: property.roomSummary?.roomStatus?.maintenance || 0,
        status: property.status?.status || 'pending',
        createdAt: moment(new Date(property.createdAt)),
      }));
      setProperties(formattedData);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Sorting function
  const sortedProperties = [...properties].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtering function
  const filteredProperties = sortedProperties
    .filter(property => statusFilter === 'all' ? true : property.status === statusFilter)
    .filter(property =>
      searchQuery === '' ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Render sorting icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;

    try {
      await deleteProperty(propertyId);
      alert("Property deleted successfully!");
      getData();
    } catch (error) {
      alert("Error deleting property.");
    }
  };

  return (
    <HostLayout>
      <TopNavHost category="properties" admin={!!id} partner={partner} />
      <div className="flex items-center justify-around gap-4 w-full mt-16  shadow-xl mb-2 py-4 rounded-b-xl bg-blue/80">
        {partner && <h1 className='text-xl'>  {partner}</h1>}

        <div className="flex items-center justify-center gap-4">
          <button onClick={setHousesType} className={` flex items-center  gap-2 p-2 rounded text-black bg-gray-300 hover:shadow-xl hover:scale-105`}>
            <FaHouse />
            <span>Houses</span>
          </button>
          <button onClick={setHotelsType} className={` flex items-center gap-2 p-2 rounded text-black hover:shadow-xl hover:scale-105 ${ListType === 'hotels' ? 'bg-orange-500 text-white' : 'bg-gray-300  text-gray-800'}`}>
            <FaHotel />
            <span>Hotels</span>
          </button>
        </div>



      </div>
      <main className="px-2 flex-1 md:p-10 bg-gradient-to-br from-indigo-100 to-blue/60 overflow-auto">
        <div>
          {/* Header with Search, View Toggle, and Add Property Button */}
          <div className="flex justify-between items-center mb-6 ">
            <div className="flex items-center gap-4">
              {/* <h1 className="text-2xl font-bold">Properties</h1> */}
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 hover:bg-orange-300 rounded-full transition-colors border-2 border-orange-500  "

                >
                  <FaSearch className="w-5 h-5 text-gray-600" />
                </button>
                <div className={`absolute left-16 -top-2 mt-2 z-10 transition-all duration-300 ease-in-out transform
                  ${showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 p-2 pl-10 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                      autoFocus
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearch(false);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>


            <button
              onClick={() => navigate('/host/properties/add')}
              className="hidden md:block px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue hover:scale-110">
              + Add Listing
            </button>

          </div>

          {/* Add loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
            </div>
          ) : (
            <>

              <div className="flex items-center justify-between">
                {/* Status Filter Buttons */}
              <div className="mb-6 flex flex-wrap gap-2">
                {['all', 'active', 'pending', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${status === statusFilter
                        ? 'bg-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Items per page:</span>
                  <select
                    className="p-1 border rounded-md text-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      const newItemsPerPage = Number(e.target.value);
                      setItemsPerPage(newItemsPerPage);
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Table View */}
              <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        onClick={() => handleSort('title')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Listing Name {renderSortIcon('title')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('type')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Type {renderSortIcon('type')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('location')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Location {renderSortIcon('location')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('roomsCount')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Rooms Count {renderSortIcon('roomsCount')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('available')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Available {renderSortIcon('available')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('booked')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Booked {renderSortIcon('booked')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('maintenance')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Maintenance {renderSortIcon('maintenance')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('status')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Status {renderSortIcon('status')}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((property) => (
                      <tr
                        key={property.id}
                        onClick={() => navigate(`/host/properties/${property.id}/details`)}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{property.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.roomsCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">{property.available}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">{property.booked}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-amber-600">{property.maintenance}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'active' ? 'bg-green-100 text-green-800' :
                            property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              property.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleDelete(property.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 flex items-center justify-between">

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <div className="flex items-center space-x-4">


                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {[...Array(totalPages || 1)].map((_, index) => (
                        <button
                          key={index + 1}
                          className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-blue text-white' : 'hover:bg-gray-100'
                            }`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </HostLayout>
  );
};

export default HotelsHost;