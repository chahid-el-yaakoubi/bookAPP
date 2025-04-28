import HostLayout from '../../ComponentHost/HostLayout';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaList, FaThLarge, FaSort, FaSortUp, FaSortDown, FaHotel } from 'react-icons/fa';
import TopNavHost from '../../ComponentHost/TopNavHost';
import moment from 'moment';

import { deleteProperty, getProperties, updateProperty } from '../../../../Lib/api';
import { AuthContext } from '../../../../contextApi/AuthContext';
import { FaHouse } from 'react-icons/fa6';

const PropertiesHost = ({ setHotelsType, setHousesType, ListType }) => {
    const { state } = useContext(AuthContext);
    const navigate = useNavigate();

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
            const response = await getProperties('', 'single');
            const data = response.data.map(hotel => ({
                id: hotel._id,
                name: hotel.title,
                location: hotel.location.city,
                price: hotel.pricing.nightly_rate,
                status: hotel.status.status,
                createdAt: moment(new Date(hotel.createdAt)),
                updatedAt: moment(new Date(hotel.updatedAt))
            }));
            setHouses(data);
        } catch (error) {
            console.error("Error fetching data:", error);
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
        .filter(house => statusFilter === 'all' ? true : house.status === statusFilter)
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
            case 'list':
                return renderListView();
            case 'card':
                return renderCardView();
            default:
                return renderTableView();
        }
    };

    const StatusUpdateModal = ({ house, onClose, onUpdateStatus }) => {
        const statuses = ['active', 'pending', 'rejected'];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Update Status for {house.name}</h2>
                    <div className="space-y-3">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    onUpdateStatus(house.id, status);
                                    onClose();
                                }}
                                className={`w-full py-2 rounded-md transition-colors 
                                    ${status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                        status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                            'bg-red-100 text-red-800 hover:bg-red-200'}`}
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

    const updatePropertyStatus = async (propertyId, newStatus) => {
        try {
            // Use updateProperty to update the status
            await updateProperty(propertyId, { status: { status: newStatus } });

            // Optimistically update the local state
            setHouses(prevHouses =>
                prevHouses.map(house =>
                    house.id === propertyId
                        ? { ...house, status: newStatus }
                        : house
                )
            );
        } catch (error) {
            console.error("Error updating property status:", error);
            // Optionally, show an error notification to the user
        }
    };

    const renderTableView = () => (
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-50">
                        {['name', 'price', 'status', 'createdAt', 'updatedAt'].map((key) => (
                            <th
                                key={key}
                                onClick={() => key !== 'status' && handleSort(key)}
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider 
                                    ${key !== 'status' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                            >
                                <div className="flex items-center">
                                    {key === 'name' ? 'Name' :
                                        key === 'price' ? 'Price/Night' :
                                            key === 'status' ? 'Status' :
                                                key === 'createdAt' ? 'Created At' :
                                                    'Updated At'}
                                    {key !== 'status' && <span className="ml-2">{renderSortIcon(key)}</span>}
                                </div>
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((house) => (
                        <tr
                            key={house.id}
                            onClick={() => navigate(`/host/properties/${house.id}/details`)}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">{house.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">MAD {house.price}</td>
                            <td
                                className="px-6 py-4 whitespace-nowrap"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedHouseForStatusUpdate(house);
                                }}
                            >
                                <span className={`px-2 py-1 rounded-full text-xs cursor-pointer
                                    ${house.status === 'active' ? 'bg-green-100 text-green-800' :
                                        house.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'}`}>
                                    {house.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{house.createdAt.fromNow()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{house.updatedAt.fromNow()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteHouse(house.id);
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

            {/* Status Update Modal */}
            {selectedHouseForStatusUpdate && (
                <StatusUpdateModal
                    house={selectedHouseForStatusUpdate}
                    onClose={() => setSelectedHouseForStatusUpdate(null)}
                    onUpdateStatus={updatePropertyStatus}
                />
            )}
        </div>
    );

    const renderListView = () => (
        <div className="space-y-4">
            {currentItems.map((house) => (
                <div
                    key={house.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/host/properties/${house.id}/details`)}
                >
                    <div>
                        <h3 className="text-lg font-semibold">{house.name}</h3>
                        <p className="text-gray-600">Location: {house.location}</p>
                        <p className="text-gray-600">Price: MAD {house.price}/night</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteHouse(house.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );

    const renderCardView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((house) => (
                <div
                    key={house.id}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/host/properties/${house.id}/details`)}
                >
                    <h3 className="text-lg font-semibold mb-2">{house.name}</h3>
                    <p className="text-gray-600 mb-1">Location: {house.location}</p>
                    <p className="text-gray-600 mb-1">Price: MAD {house.price}/night</p>
                    <p className="text-gray-500 text-sm">Created {house.createdAt.fromNow()}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs 
                            ${house.status === 'active' ? 'bg-green-100 text-green-800' :
                                house.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'}`}>
                            {house.status}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteHouse(house.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const deleteHouse = async (houseId) => {
        try {
            await deleteProperty(houseId);
            setHouses(houses.filter(house => house.id !== houseId));
        } catch (error) {
            console.error("Error deleting house:", error);
        }
    };

    return (
        <HostLayout>
            <TopNavHost category="properties" />

            <div className="flex items-center justify-center gap-4 w-full mt-20 mb-3 ">
                <button onClick={setHousesType} className={` flex items-center  gap-2 p-2 rounded text-black ${ListType === 'houses' ? 'bg-blue text-white' : 'bg-gray-300 text-gray-800'}`}>
                    <FaHouse />
                    <span>Properties</span>
                </button>
                <button onClick={setHotelsType} className={` flex items-center gap-2 p-2 rounded text-black ${ListType === 'hotels' ? 'bg-blue text-white' : 'bg-gray-300  text-gray-800'}`}>
                    <FaHotel />
                    <span>Hotels</span>
                </button>
            </div>
            <main className="px-2 flex-1 md:p-10 mt-4 bg-blue/30 overflow-auto">
                <div>

                    {/* Header with Search, View Toggle, and Add Property Button */}
                    <div className="flex justify-between items-center mb-6 pt-16">

                        <div className="flex items-center gap-4">
                            {/* <h1 className="text-2xl font-bold">Properties</h1> */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                                onClick={() => setView('list')}
                                className={`p-2 rounded ${view === 'list' ? 'bg-blue text-white' : 'hover:bg-gray-100'}`}
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
                            className="group cursor-pointer outline-none  duration-300 shadow-xl shadow-blue hover:scale-110  w-12 h-12 rounded-full"
                            title="Add New"
                        >
                            <svg
                                className="stroke-primary fill-none group-hover:fill-blue group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
                                viewBox="0 0 40 40"
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

                    {/* Render properties based on selected view */}
                    {renderProperties()}

                    {/* Pagination Controls */}
                    <div className="mt-4 flex items-center justify-between">
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

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>

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
                </div>
            </main>
        </HostLayout>
    );
};

export default PropertiesHost;