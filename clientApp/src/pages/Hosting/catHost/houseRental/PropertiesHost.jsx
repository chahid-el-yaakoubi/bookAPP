import HostLayout from '../../ComponentHost/HostLayout';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaTimes, FaList, FaThLarge, FaSort, FaSortUp, FaSortDown, FaHotel, FaEye, FaEdit } from 'react-icons/fa';
import TopNavHost from '../../ComponentHost/TopNavHost';
import moment from 'moment';

import { deleteProperty, getProperties, getPropertiesAdmin, updateProperty } from '../../../../Lib/api';
import { AuthContext } from '../../../../contexts/AuthContext';
import { FaFaceSmile, FaHouse } from 'react-icons/fa6';
import { Edit2, EyeIcon, Trash2 } from 'lucide-react';

const PropertiesHost = ({ setHotelsType, setHousesType, ListType }) => {
    const { state } = useContext(AuthContext);
    let adminId = state?.user?.id;
    const { id } = useParams();

    if (id) {
        adminId = id
    }
    const location = useLocation();
    const pathname = location.pathname;
    localStorage.setItem('lastVisitedPage', pathname);
    const queryParams = new URLSearchParams(location.search);
    const partner = queryParams.get('partner');

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Use localStorage for view and items per page with fallback values
    const [view, setView] = useState(() => {
        return localStorage.getItem('propertiesView') || 'table';
    });

    const [itemsPerPage, setItemsPerPage] = useState(() => {
        const storedItemsPerPage = localStorage.getItem('propertiesItemsPerPage');
        return storedItemsPerPage ? parseInt(storedItemsPerPage, 10) : 5;
    });

    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [houses, setHouses] = useState([]);

    // Sorting state
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    const [selectedHouseForStatusUpdate, setSelectedHouseForStatusUpdate] = useState(null);
    const [selectedHouseForDeletion, setSelectedHouseForDeletion] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    // Update localStorage when view changes
    useEffect(() => {
        localStorage.setItem('propertiesView', view);
    }, [view]);

    // Update localStorage when items per page changes
    useEffect(() => {
        localStorage.setItem('propertiesItemsPerPage', itemsPerPage.toString());
    }, [itemsPerPage]);

    const getData = async () => {
        try {
            setIsLoading(true);
            const response = await getPropertiesAdmin(adminId, 'single');
            const data = response.data.map(hotel => ({
                id: hotel._id,
                name: hotel.title,
                location: hotel.location.city,
                price: hotel.pricing.nightly_rate,
                bookingStatus: hotel.status.bookingStatus,
                status: hotel.status.status,
                createdAt: moment(new Date(hotel.createdAt)),
                updatedAt: moment(new Date(hotel.updatedAt)),
                image: hotel.images?.[0],
                type: hotel.type?.type || 'N/A'
            }));
            setHouses(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // Sorting function
    const sortedHouses = [...houses].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Filtering function
    const filteredHouses = sortedHouses
        .filter(house => {
            if (statusFilter === 'all') return true;
            return house.bookingStatus === statusFilter;
        })
        .filter(house =>
            searchQuery === '' ||
            house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            house.location.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHouses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);

    // Sorting handler
    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Render sorting icon
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort />;
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    // Render based on view
    const renderProperties = () => {
        switch (view) {
            case 'table':
                return renderTableView();
            case 'card':
                return renderCardView();
            default:
                return renderTableView();
        }
    };

    const StatusUpdateModal = ({ house, onClose, onUpdateStatus }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Update Booking Status for {house.name}</h2>
                    <div className="space-y-3">
                        {['available', 'maintenance', 'booked'].map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    onUpdateStatus(house.id, status);
                                    onClose();
                                }}
                                className={`w-full py-2 rounded-md transition-colors 
                                    ${status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                        status === 'booked' ? 'bg-blue/20 text-blue hover:bg-blue/40' :
                                            status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                                'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    // Add notification component for property status
    const PropertyStatusNotification = ({ house }) => {
        if (state.user?.role === 'partner' && house.status !== 'accepted') {
            return (
                <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
                    <p>This property needs to be accepted by an admin before you can manage its status.</p>
                </div>
            );
        }
        return null;
    };

    const updatePropertyStatus = async (propertyId, newStatus) => {
        try {
            // Use updateProperty to update the status
            await updateProperty(propertyId, { status: { bookingStatus: newStatus } });

            // Refresh the data after successful update
            await getData();

            // Close the modal
            setSelectedHouseForStatusUpdate(null);
        } catch (error) {
            console.error("Error updating property status:", error);
            // Optionally, show an error notification to the user
        }
    };

    // Update the status badge colors in both table and card views
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'booked':
                return 'bg-blue/20 text-blue';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Add DeleteConfirmationModal component
    const DeleteConfirmationModal = ({ house, onClose, onConfirm }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Delete Property</h2>
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to delete "{house.name}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm(house.id);
                                onClose();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const deleteHouse = async (houseId) => {
        try {
            await deleteProperty(houseId);
            setHouses(houses.filter(house => house.id !== houseId));
        } catch (error) {
            console.error("Error deleting house:", error);
        }
    };

    // Update the table view to show status badge as clickable
    const renderTableView = () => (
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-50">
                        {['name', 'type', 'price', 'status', 'createdAt', 'updatedAt', 'actions'].map((key) => (
                            <th
                                key={key}
                                onClick={() => key !== 'status' && key !== 'actions' && handleSort(key)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            >
                                <div className="flex items-center">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    {key !== 'status' && key !== 'actions' && renderSortIcon(key)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((house) => (
                        <tr
                            key={house.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-orange-500">
                                <div
                                    onClick={() => navigate(`/host/properties/${house.id}/details/rooms`)}
                                    className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">
                                        {house.name}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{house.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">MAD {house.price}/night</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedHouseForStatusUpdate(house);
                                        setShowStatusModal(true);
                                    }}
                                    className={`px-2 py-1 rounded-full text-xs cursor-pointer ${getStatusBadgeClass(house.bookingStatus)}`}
                                >
                                    {house.bookingStatus}
                                </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {house.createdAt.fromNow()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {house.updatedAt.fromNow()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-4  ">
                                <button
                                    onClick={() => setSelectedHouseForDeletion(house)}
                                    className="text-red-600 hover:text-red-800  hover:scale-125"
                                >
                                    <Trash2 />
                                </button>
                                <button
                                    onClick={() => window.open(`/hotel/${house.id}`, '_blank')}
                                    className="text-blue hover:text-blue/90 hover:scale-125"
                                >
                                    <EyeIcon />
                                </button>
                                <button
                                    onClick={() => navigate(`/host/properties/${house.id}/details/rooms`)}
                                    className="text-orange-500 hover:text-orange-600  hover:scale-125"
                                >
                                    <Edit2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Status Update Modal */}
            {selectedHouseForStatusUpdate && (
                <StatusUpdateModal
                    house={selectedHouseForStatusUpdate}
                    onClose={() => setSelectedHouseForStatusUpdate(null)}
                    onUpdateStatus={updatePropertyStatus}
                />
            )}

            {/* Delete Confirmation Modal */}
            {selectedHouseForDeletion && (
                <DeleteConfirmationModal
                    house={selectedHouseForDeletion}
                    onClose={() => setSelectedHouseForDeletion(null)}
                    onConfirm={deleteHouse}
                />
            )}
        </div>
    );

    // Update the card view to show status badge as clickable
    const renderCardView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((house) => (
                <div
                    key={house.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    onClick={(e) => {
                        // Only navigate if clicking on the card itself, not on status or delete buttons
                        if (e.target.closest('button') || e.target.closest('span')) return;
                        navigate(`/host/properties/${house.id}/details`);
                    }}
                >
                    <div className="h-48 bg-gray-200">
                        {house.image ? (
                            <img
                                src={house.image}
                                alt={house.name}
                                className="w-full h-full object-cover"
                                loading='lazy'
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <FaHouse className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{house.name}</h3>
                        <p className="text-gray-600 mb-1">Location: {house.location}</p>
                        <p className="text-gray-600 mb-1">Price: MAD {house.price}/night</p>
                        <p className="text-gray-500 text-sm">Created {house.createdAt.fromNow()}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedHouseForStatusUpdate(house);
                                    setShowStatusModal(true);
                                }}
                                className={`px-2 py-1 rounded-full text-xs cursor-pointer ${getStatusBadgeClass(house.bookingStatus)}`}
                            >
                                {house.bookingStatus}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedHouseForDeletion(house);
                                }}
                                className="text-red-600 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <HostLayout>
            <TopNavHost category="properties" admin={!!id} partner={partner} />


            <div className="flex items-center justify-around gap-4 w-full mt-16  shadow-xl mb-2 py-4 rounded-b-xl bg-blue/80">
                {partner && <h1 className='text-xl'>  {partner}</h1>}

                <div className="flex items-center justify-center gap-4">
                    <button onClick={setHousesType} className={` flex items-center  gap-2 p-2 rounded text-black hover:shadow-xl hover:scale-105 ${ListType === 'houses' ? 'bg-orange-500 text-white' : 'bg-gray-300  text-gray-800'} `}>
                        <FaHouse />
                        <span>Houses</span>
                    </button>
                    <button onClick={setHotelsType} className={` flex items-center gap-2 p-2 rounded text-black bg-gray-300 hover:shadow-xl hover:scale-105 `}>
                        <FaHotel />
                        <span>Hotels</span>
                    </button>
                </div>
            </div>
            <main className="px-2 flex-1 md:p-10  bg-gradient-to-br from-indigo-100 to-blue/60 overflow-auto">
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

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 mr-4">
                            <button
                                onClick={() => setView('table')}
                                className={`p-2 rounded ${view === 'table' ? 'bg-blue text-white' : 'hover:bg-gray-100'}`}
                            >
                                <FaList />
                            </button>
                            <button
                                onClick={() => setView('card')}
                                className={`p-2 rounded ${view === 'card' ? 'bg-blue text-white' : 'hover:bg-gray-100'}`}
                            >
                                <FaThLarge />
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/host/properties/add')}
                            className="hidden md:block px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue hover:scale-110">
                            + Add Listing
                        </button>
                    </div>

                    {/* Add loading indicator */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                {/* Status Filter Buttons */}
                                <div className="mb-6 flex flex-wrap gap-2">
                                    {['all', 'available', 'maintenance', 'booked'].map((status) => {
                                        const count = status === 'all'
                                            ? filteredHouses.length
                                            : filteredHouses.filter(house => house.bookingStatus === status).length;

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    if (status !== statusFilter) {
                                                        setStatusFilter(status);
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                                ${status === statusFilter
                                                        ? 'bg-blue text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                                            </button>
                                        );
                                    })}
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
                            {/* Render properties based on selected view */}
                            {renderProperties()}

                            {/* Pagination Controls */}
                            <div className="mt-4 flex items-center justify-between">

                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
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
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index + 1}
                                                    className={`px-3 py-1 border rounded-md ${currentPage === index + 1
                                                        ? 'bg-blue text-white'
                                                        : 'hover:bg-gray-100'
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
                                            disabled={currentPage === totalPages}
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

export default PropertiesHost;