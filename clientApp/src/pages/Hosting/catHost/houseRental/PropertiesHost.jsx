import HostLayout from '../../ComponentHost/HostLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import TopNavHost from '../../ComponentHost/TopNavHost';

const PropertiesHost = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Sample house data
    const houses = [
        { id: 1, name: "Beachfront Villa", location: "Miami Beach", price: 250, status: "active" },
        { id: 2, name: "Mountain Cabin", location: "Aspen", price: 180, status: "pending" },
        { id: 3, name: "City Apartment", location: "New York", price: 150, status: "active" },
        { id: 4, name: "Lake House", location: "Lake Tahoe", price: 200, status: "rejected" },
        { id: 5, name: "Country Cottage", location: "Vermont", price: 120, status: "pending" },
        
    ];

    const filteredHouses = houses
        .filter(house => statusFilter === 'all' ? true : house.status === statusFilter)
        .filter(house => 
            searchQuery === '' || 
            house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            house.location.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHouses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);

    // Define status options
    const statusOptions = [
        { value: 'all', label: 'All Properties' },
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' }
    ];

    const handleHouseClick = (houseId) => {
        navigate(`/host/properties/${houseId}/details`);
    };

    return (
        <HostLayout>
            <TopNavHost category="properties" />
            <main className="flex-1 p-4 md:p-6 bg-blue/30">
                {/* Header with Search and Add Property Button */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">Properties</h1>
                        <div className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaSearch className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className={`absolute left-0 top-full mt-2 z-10 transition-all duration-300 ease-in-out transform
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
                        className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue/90 transition-colors"
                        onClick={() => navigate('/host/properties/welcome')}
                    >
                        Add Property
                    </button>
                </div>

                {/* Status Filter Buttons */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${statusFilter === option.value
                                    ? 'bg-blue text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Properties Table */}
                <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Night</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((house) => (
                                <tr 
                                    key={house.id} 
                                    onClick={() => handleHouseClick(house.id)}
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">{house.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{house.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${house.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${house.status === 'active' ? 'bg-green-100 text-green-800' : 
                                                house.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'}`}>
                                            {house.status.charAt(0).toUpperCase() + house.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Items per page:</span>
                        <select
                            className="p-1 border rounded-md text-sm"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
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
                                        className={`px-3 py-1 border rounded-md ${
                                            currentPage === index + 1
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
            </main>
        </HostLayout>
    );
};

export default PropertiesHost; 