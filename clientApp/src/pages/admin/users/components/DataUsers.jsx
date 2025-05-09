import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEye, FaTrash, FaEdit, FaChevronLeft, FaChevronRight,
    FaSort, FaSortUp, FaSortDown, FaSearch, FaUsers, FaPlus,
    FaCheckCircle
} from "react-icons/fa";
import useFetch from "../../../../hooks/useFetch";
import { deleteUser } from "../../../../Lib/api";

const OptimizedUsersTable = () => {
    const navigate = useNavigate();
    const { data: fetchedData, loading, error, reFetch } = useFetch("/api/users");

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [success, setSuccess] = useState(false);
    const [filterType, setFilterType] = useState(null);

    // Process the fetched data
    useEffect(() => {
        if (fetchedData && Array.isArray(fetchedData)) {
            const formattedData = fetchedData.map((user) => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName || '',
                city: user.city || '',
                phone: user.phone || '',
                isAdmin: user.isAdmin || false,
                adminCars: user.adminCars || false,
                adminUsers: user.adminUsers || false,
                adminHotels: user.adminHotels || false,
                adminHouses: user.adminHouses || false,
                adminShops: user.adminShops || false,
                isVerified: user.isVerified || false,
                createdAt: user.createdAt || '',
            }));
            setUsers(formattedData);
        }
    }, [fetchedData]);

    const handleView = (id, name) => {
        navigate(`/iAmAdmin/users/${id}?user=${name}`);
    };

    const handleEdit = (id) => {
        navigate(`/iAmAdmin/users/edit/${id}`);
    };
    const handleDelete = async (id) => {
        // Confirm deletion
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            setSuccess(true);
            const res = await deleteUser(id);
            if (res.status === 200) {
                reFetch();
                // Add a 2-second delay before setting success to false
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            }
        }
    };

    const handleAddNew = () => {
        navigate('/iAmAdmin/users/add');
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

    const handleFilterSelect = (type) => {
        setFilterType(type);
    };

    const filteredUsers = React.useMemo(() => {
        let usersToDisplay = [...users];

        // Apply filter based on selected type
        if (filterType) {
            usersToDisplay = usersToDisplay.filter(user => {
                if (filterType === 'admin') return user.isAdmin;
                if (filterType === 'verified') return user.isVerified;
                return true; // No filter
            });
        }

        // Existing search and sort logic
        if (searchTerm) {
            usersToDisplay = usersToDisplay.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Sort logic
        if (sortConfig.key) {
            usersToDisplay.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return usersToDisplay;
    }, [users, sortConfig, searchTerm, filterType]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Count the number of admin users
    const adminCount = users.filter(user => user.isAdmin).length;
    const verifiedCount = users.filter(user => user.isVerified).length;

    // Count users with specific admin permissions
    const adminCarsCount = users.filter(user => user.adminCars).length;
    const adminHousesCount = users.filter(user => user.adminHouses).length;
    const adminShopsCount = users.filter(user => user.adminShops).length;
    const adminHotelsCount = users.filter(user => user.adminHotels).length;
    const adminUsersCount = users.filter(user => user.adminUsers).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue/50 p-6">
            <div className="px-10 mx-auto">
                {/* Header with decorative elements */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue opacity-5 rounded-lg transform -skew-y-2"></div>
                    <div className="relative flex flex-col md:flex-row justify-between items-center p-6 bg-white rounded-lg shadow-lg">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-blue p-3 rounded-lg mr-4 text-white">
                                <FaUsers className="text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Users Dashboard</h1>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center px-6 py-3 bg-blue text-white font-medium rounded-lg hover:bg-blue transition-colors transform hover:scale-105 shadow-md"
                        >
                            <FaPlus className="mr-2" /> Add New User
                        </button>
                    </div>
                </div>

                {success ? <div className="min-h-screen flex items-center justify-center  bg-opacity-90 fixed inset-0">
                    <div className="bg-green-500 p-8 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex items-center justify-center text-green mb-4">
                            <FaCheckCircle className="w-16 h-16" />
                        </div>
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">User Deleted Successfully! </h1>
                        <p className="text-gray-600 text-center mb-6">Refreching data...</p>
                    </div>
                </div> : ''}

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
                            <div className="bg-blue/20 p-2 rounded-full">
                                <FaUsers className="text-blue" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{users.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Registered on platform</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex">
                        <div className="w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-700">Admins</h2>
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{adminCount}</p>
                            <p className="text-sm text-gray-500 mt-1">With admin privileges</p>
                        </div>
                        <div className="flex justify-between items-start flex-col w-full ps-10">
                            <span>Cars {adminCarsCount} </span>
                            <span>Hotels {adminHotelsCount} </span>
                            <span>Houses {adminHousesCount} </span>
                            <span>shops {adminShopsCount} </span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Verified Users</h2>
                            <div className="bg-green-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{verifiedCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Email verified</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Admin Modules</h2>
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {adminUsersCount}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Special permissions</p>
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
                                    Error loading user data: {error?.message}
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
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* New filter buttons */}
                        <div className="flex space-x-4 mb-4">
                            <button 
                                onClick={() => handleFilterSelect('admin')} 
                                className={`p-2 ${filterType === 'admin' ? 'bg-blue' : 'bg-orange-500 text-white'} rounded`}

                            >
                                Show Admins
                            </button>
                            <button 
                                onClick={() => handleFilterSelect('verified')} 
                                className={`p-2 ${filterType === 'verified' ? 'bg-blue' : 'bg-green-500 text-white'} rounded`}
                            >
                                Show Verified
                            </button>
                            <button 
                                onClick={() => handleFilterSelect(null)} 
                                className={`p-2 ${filterType === null ? 'bg-blue' : 'bg-gray-500 text-white'} rounded`}
                            >
                                Show All
                            </button>
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
                <div className="bg-white rounded-xl shadow-xl  overflow-x-scroll ">
                    {/* Table header */}
                    <div className="bg-gradient-to-r from-blue/50 to-blue text-white py-4 px-6 min-w-[1100px]">
                        <div className="grid grid-cols-12 gap-4 items-center">
                            <div
                                className="col-span-2 flex items-center cursor-pointer"
                                onClick={() => requestSort('username')}
                            >
                                <span className="font-medium">Username</span>
                                {getSortIcon('username')}
                            </div>
                            <div
                                className="col-span-2 flex items-center cursor-pointer"
                                onClick={() => requestSort('email')}
                            >
                                <span className="font-medium">Email</span>
                                {getSortIcon('email')}
                            </div>
                            <div
                                className="col-span-2 flex items-center cursor-pointer"
                                onClick={() => requestSort('fullName')}
                            >
                                <span className="font-medium">Full Name</span>
                                {getSortIcon('fullName')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('city')}
                            >
                                <span className="font-medium">City</span>
                                {getSortIcon('city')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('isAdmin')}
                            >
                                <span className="font-medium">Admin</span>
                                {getSortIcon('isAdmin')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('isVerified')}
                            >
                                <span className="font-medium">Verified</span>
                                {getSortIcon('isVerified')}
                            </div>
                            <div
                                className="col-span-1 text-center flex items-center justify-center cursor-pointer"
                                onClick={() => requestSort('createdAt')}
                            >
                                <span className="font-medium">Created</span>
                                {getSortIcon('createdAt')}
                            </div>
                            <div className="col-span-2 text-center">
                                <span className="font-medium">Actions</span>
                            </div>
                        </div>
                    </div>

                    {/* Table body */}
                    <div className="min-w-[1100px]">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
                                </div>
                                <p className="text-gray-500 font-medium">Loading users data...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-20 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-4 text-gray-500 font-medium">No users found</p>
                                <p className="text-gray-400">Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <div
                                    key={user._id}
                                    className={`border-b border-gray-100 hover:bg-blue/10 transition-colors ${selectedUsers.includes(user._id) ? 'bg-blue/20' : index % 2 === 0 ? 'bg-gray-50' : ''}`}
                                >
                                    <div className="grid grid-cols-12 gap-4 items-center py-4 px-6">
                                        <div className="col-span-2 font-medium text-gray-800">{user.username}</div>
                                        <div className="col-span-2 text-gray-600">{user.email}</div>
                                        <div className="col-span-2 text-gray-600">{user.fullName}</div>
                                        <div className="col-span-1 text-center">{user.city}</div>
                                        <div className="col-span-1 flex justify-center">
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {user.isAdmin ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {user.isVerified ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-center text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex justify-center space-x-3">
                                                <button
                                                    onClick={() => handleView(user._id, user.username)}
                                                    className="p-2 bg-blue/20 text-blue rounded-lg hover:bg-blue/40 transition-colors"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => { handleEdit(user._id) }}
                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => { handleDelete(user._id) }}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    <FaTrash />
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
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
                        </div>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-blue/10 border border-gray-200 shadow-sm'
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
                                            : 'bg-white text-gray-700 hover:bg-blue/10 border border-gray-200 shadow-sm'
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
                                    : 'bg-white text-black hover:bg-blue/10 border border-gray-200 shadow-sm'
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

export default OptimizedUsersTable;