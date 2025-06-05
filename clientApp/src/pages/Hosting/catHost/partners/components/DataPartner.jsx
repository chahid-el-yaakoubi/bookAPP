import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    FaEye, FaTrash, FaEdit, FaChevronLeft, FaChevronRight,
    FaSort, FaSortUp, FaSortDown, FaSearch, FaUserFriends, FaPlus
} from "react-icons/fa";
import useFetch from "../../../../../hooks/useFetch";

const OptimizedPartnersTable = () => {
    // Use the useFetch hook to get data from the API endpoint

    const navigate = useNavigate()
    const { data: fetchedData, loading, error } = useFetch("/api/hotels/partner/admin/find");

    const [partners, setPartners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
    const [selectedPartners, setSelectedPartners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Process the fetched data
    useEffect(() => {
        if (fetchedData && Array.isArray(fetchedData.partners)) {
            const formattedData = fetchedData.partners.map((partner) => ({
                _id: partner._id,
                username: partner.username,
                email: partner.email,
                totalProperties: partner.totalProperties || 0,
                statusCount: partner.statusCount || { active: 0, pending: 0, rejected: 0 },
            }));
            setPartners(formattedData);
        }
    }, [fetchedData]);


    const handleView = (id, name) => {
        navigate(`/iAmAdmin/partners/${id}/listining?partner=${name}`)
    };

    const handleAddNew = () => {
        navigate('/iAmAdmin/users/add')
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) return <FaSort className="text-gray-300" />;
        if (sortConfig.direction === 'asc') return <FaSortUp className="text-black" />;
        return <FaSortDown className="text-black" />;
    };

    const sortedPartners = React.useMemo(() => {
        let sortablePartners = [...partners];

        // First filter by search term
        if (searchTerm) {
            sortablePartners = sortablePartners.filter(partner =>
                partner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                partner.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Then sort
        if (sortConfig.key) {
            sortablePartners.sort((a, b) => {
                // Handle special fields that need to access nested objects
                if (sortConfig.key === 'active') {
                    const valueA = a.statusCount?.active || 0;
                    const valueB = b.statusCount?.active || 0;
                    return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
                } else if (sortConfig.key === 'pending') {
                    const valueA = a.statusCount?.pending || 0;
                    const valueB = b.statusCount?.pending || 0;
                    return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
                } else if (sortConfig.key === 'rejected') {
                    const valueA = a.statusCount?.rejected || 0;
                    const valueB = b.statusCount?.rejected || 0;
                    return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
                } else {
                    // For regular fields
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortablePartners;
    }, [partners, sortConfig, searchTerm]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPartners = sortedPartners.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedPartners.length / itemsPerPage);





    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue/60 p-6">
            <div className=" px-10 mx-auto">
                {/* Header with decorative elements */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue opacity-5 rounded-lg transform -skew-y-2"></div>
                    <div className="relative flex flex-col md:flex-row justify-between items-center p-6 bg-white rounded-lg shadow-lg">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-blue p-3 rounded-lg mr-4 text-white">
                                <FaUserFriends className="text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Partners Dashboard</h1>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center px-6 py-3 bg-blue text-white font-medium rounded-lg hover:bg-blue/80 transition-colors transform hover:scale-105 shadow-md"
                        >
                            <FaPlus className="mr-2" /> Add New Partner
                        </button>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Total Partners</h2>
                            <div className="bg-blue p-2 rounded-full">
                                <FaUserFriends className="text-black" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{partners.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Managing the platform</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Active Properties</h2>
                            <div className="bg-green-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {partners.reduce((sum, partner) => sum + (partner.statusCount?.active || 0), 0)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Currently listed</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Pending Review</h2>
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {partners.reduce((sum, partner) => sum + (partner.statusCount?.pending || 0), 0)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Total Properties</h2>
                            <div className="bg-purple-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {partners.reduce((sum, partner) => sum + (partner.totalProperties || 0), 0)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Across all partners</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    Error loading partner data: {error?.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Control panel */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <div className="relative w-full md:w-96 mb-4 md:mb-0">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue bg-gray-50"
                                placeholder="Search partners by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-600 font-medium">Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg p-2 mr-2 focus:ring-2 focus:ring-blue focus:border-blue bg-gray-50"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-gray-600 font-medium">entries</span>
                        </div>
                    </div>


                </div>

                {/* Main table */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Table header */}
                    <div className="bg-gradient-to-r from-blue to-blue text-white py-4 px-6">
                        <div className="grid grid-cols-12 gap-4 items-center">

                            <div
                                className="col-span-2 flex items-center cursor-pointer"
                                onClick={() => requestSort('username')}
                            >
                                <span className="font-medium">Username</span>
                                {getSortIcon('username')}
                            </div>
                            <div
                                className="col-span-3 flex items-center cursor-pointer"
                                onClick={() => requestSort('email')}
                            >
                                <span className="font-medium">Email</span>
                                {getSortIcon('email')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('totalProperties')}
                            >
                                <span className="font-medium">Properties</span>
                                {getSortIcon('totalProperties')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('active')}
                            >
                                <span className="font-medium">Active</span>
                                {getSortIcon('active')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('pending')}
                            >
                                <span className="font-medium">Pending</span>
                                {getSortIcon('pending')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('rejected')}
                            >
                                <span className="font-medium">Rejected</span>
                                {getSortIcon('rejected')}
                            </div>
                            <div className="col-span-2 text-center">
                                <span className="font-medium">Show</span>
                            </div>
                        </div>
                    </div>

                    {/* Table body */}
                    <div>
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
                                </div>
                                <p className="text-gray-500 font-medium">Loading partners data...</p>
                            </div>
                        ) : currentPartners.length === 0 ? (
                            <div className="py-20 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-4 text-gray-500 font-medium">No partners found</p>
                                <p className="text-gray-400">Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            currentPartners.map((partner, index) => (
                                <div
                                    key={partner._id}
                                    className={`border-b border-gray-100 hover:bg-blue/50 transition-colors ${selectedPartners.includes(partner._id) ? 'bg-blue' : index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                >
                                    <div className="grid grid-cols-12 gap-4 items-center py-4 px-6">

                                        <div className="col-span-2 font-medium text-gray-800">{partner.username}</div>
                                        <div className="col-span-3 text-gray-600">{partner.email}</div>
                                        <div className="col-span-1 text-center font-medium">{partner.totalProperties}</div>
                                        <div className="col-span-1 flex justify-center">
                                            <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                                                {partner.statusCount.active || 0}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                {partner.statusCount.pending || 0}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                                                {partner.statusCount.rejected || 0}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex justify-center space-x-3">
                                                <button onClick={() => { handleView(partner._id, partner.username) }} className="p-2 bg-blue text-black rounded-lg hover:bg-blue/50 transition-colors">
                                                    <FaEye />
                                                </button>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-4 md:mb-0">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedPartners.length)} of {sortedPartners.length} entries
                        </div>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-blue/50 border border-gray-200 shadow-sm'
                                    }`}
                            >
                                <FaChevronLeft className="text-sm" />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Logic to show pages around current page
                                let pageToShow;
                                if (totalPages <= 5) {
                                    pageToShow = i + 1;
                                } else if (currentPage <= 3) {
                                    pageToShow = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageToShow = totalPages - 4 + i;
                                } else {
                                    pageToShow = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageToShow}
                                        onClick={() => setCurrentPage(pageToShow)}
                                        className={`px-4 py-2 rounded-md ${currentPage === pageToShow
                                            ? 'bg-blue text-white font-medium shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-blue/50 border border-gray-200 shadow-sm'
                                            }`}
                                    >
                                        {pageToShow}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`px-3 py-2 rounded-md ${currentPage === totalPages || totalPages === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-blue/50 border border-gray-200 shadow-sm'
                                    }`}
                            >
                                <FaChevronRight className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default OptimizedPartnersTable;