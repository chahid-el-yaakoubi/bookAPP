import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEye, FaTrash, FaEdit, FaChevronLeft, FaChevronRight,
    FaSort, FaSortUp, FaSortDown, FaSearch, FaCar, FaPlus,
    FaCheckCircle, FaFilter, FaTags, FaRegCalendarAlt, FaMapMarkerAlt
} from "react-icons/fa";
import useFetch from "../../../../../hooks/useFetch";
import { deleteCar } from "../../../../../Lib/api";

const OptimizedCarsTable = () => {
    const navigate = useNavigate();
    const { data: fetchedData, loading, error, reFetch } = useFetch("/api/cars");

    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'carDetails.carMake', direction: 'asc' });
    const [selectedCars, setSelectedCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [success, setSuccess] = useState(false);
    const [filterType, setFilterType] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [regionFilter, setRegionFilter] = useState(null);

    // Process the fetched data
    useEffect(() => {
        if (fetchedData && Array.isArray(fetchedData)) {
            const formattedData = fetchedData.map((car) => ({
                _id: car._id,
                created_by: car.created_by,
                carDetails: {
                    carMake: car.carDetails?.carMake || '',
                    carModel: car.carDetails?.carModel || '',
                    year: car.carDetails?.year || '',
                    color: car.carDetails?.color || '',
                    plateNumber: car.carDetails?.plateNumber || '',
                },
                specifications: car.specifications || {},
                location: car.location || {},
                category: car.category || '',
                pricing: car.pricing || {},
                status: car.status || 'Unavailable',
                averageRating: car.averageRating || 0,
                verification: car.verification || {},
                media: car.media || {},
                createdAt: car.createdAt || '',
                reviews: car.reviews || [],
                bookingHistory: car.bookingHistory || [],
            }));
            setCars(formattedData);
        }
    }, [fetchedData]);

    const handleView = (id) => {
        navigate(`/iAmAdmin/cars/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/iAmAdmin/cars/edit/${id}`);
    };
    
    const handleDelete = async (id) => {
        // Confirm deletion
        const confirmDelete = window.confirm("Are you sure you want to delete this car?");
        if (confirmDelete) {
            setSuccess(true);
            const res = await deleteCar(id);
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
        navigate('/host/cars/add');
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

    const handleCategoryFilter = (category) => {
        setCategoryFilter(category === categoryFilter ? null : category);
    };

    const handleRegionFilter = (region) => {
        setRegionFilter(region === regionFilter ? null : region);
    };

    const filteredCars = React.useMemo(() => {
        let carsToDisplay = [...cars];

        // Apply filter based on selected status type
        if (filterType) {
            carsToDisplay = carsToDisplay.filter(car => car.status === filterType);
        }

        // Apply category filter
        if (categoryFilter) {
            carsToDisplay = carsToDisplay.filter(car => car.category === categoryFilter);
        }

        // Apply region filter
        if (regionFilter) {
            carsToDisplay = carsToDisplay.filter(car => car.location.region === regionFilter);
        }

        // Search logic
        if (searchTerm) {
            carsToDisplay = carsToDisplay.filter(car =>
                car.carDetails.carMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.carDetails.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.carDetails.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (car.location.city && car.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Sort logic - handling nested properties
        if (sortConfig.key) {
            carsToDisplay.sort((a, b) => {
                // Handle nested properties with dot notation
                const keys = sortConfig.key.split('.');
                let aValue = a;
                let bValue = b;
                
                // Navigate through the object structure
                for (const key of keys) {
                    aValue = aValue?.[key];
                    bValue = bValue?.[key];
                }
                
                // Handle undefined or null values
                if (aValue === undefined || aValue === null) aValue = '';
                if (bValue === undefined || bValue === null) bValue = '';
                
                // Compare the values
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return carsToDisplay;
    }, [cars, sortConfig, searchTerm, filterType, categoryFilter, regionFilter]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

    // Count the number of cars by status
    const availableCount = cars.filter(car => car.status === 'Available').length;
    const rentedCount = cars.filter(car => car.status === 'Rented').length;
    const maintenanceCount = cars.filter(car => car.status === 'Maintenance').length;
    const unavailableCount = cars.filter(car => car.status === 'Unavailable').length;
    
    // Count verified cars
    const verifiedCount = cars.filter(car => car.verification?.isVerified).length;

    // Get unique categories and regions for filters
    const categories = [...new Set(cars.map(car => car.category))];
    const regions = [...new Set(cars.map(car => car.location?.region).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue/50 p-2 md:p-6">
            <div className="px-0 md:px-10 mx-auto">
                {/* Header with decorative elements */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue opacity-5 rounded-lg transform -skew-y-2"></div>
                    <div className="relative flex flex-col md:flex-row justify-between items-center p-6 bg-white rounded-lg shadow-lg">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-blue p-3 rounded-lg mr-4 text-white">
                                <FaCar className="text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Car Rentals Dashboard</h1>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center px-6 py-3 bg-blue text-white font-medium rounded-lg hover:bg-blue transition-colors transform hover:scale-105 shadow-md"
                        >
                            <FaPlus className="mr-2" /> Add New Car
                        </button>
                    </div>
                </div>

                {success ? <div className="min-h-screen flex items-center justify-center bg-opacity-90 fixed inset-0 z-50">
                    <div className="bg-green-500 p-8 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex items-center justify-center text-green mb-4">
                            <FaCheckCircle className="w-16 h-16 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-center text-white mb-4">Car Deleted Successfully! </h1>
                        <p className="text-white text-center mb-6">Refreshing data...</p>
                    </div>
                </div> : ''}

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Total Cars</h2>
                            <div className="bg-blue/20 p-2 rounded-full">
                                <FaCar className="text-blue" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{cars.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Registered on platform</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Available</h2>
                            <div className="bg-green-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{availableCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Ready to rent</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Rented</h2>
                            <div className="bg-blue/20 p-2 rounded-full">
                                <div className="w-4 h-4 bg-blue rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{rentedCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Currently rented</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Maintenance</h2>
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{maintenanceCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Under maintenance</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Verified</h2>
                            <div className="bg-purple-100 p-2 rounded-full">
                                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{verifiedCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Admin verified</p>
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
                                    Error loading car data: {error?.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Control panel */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-4 space-y-4 lg:space-y-0">
                        {/* Search input */}
                        <div className="relative w-full lg:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue bg-gray-50"
                                placeholder="Search cars by make, model, plate..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter buttons for status */}
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => handleFilterSelect('Available')} 
                                className={`px-3 py-2 rounded-lg flex items-center ${filterType === 'Available' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
                            >
                                <span className="mr-1">●</span> Available
                            </button>
                            <button 
                                onClick={() => handleFilterSelect('Rented')} 
                                className={`px-3 py-2 rounded-lg flex items-center ${filterType === 'Rented' ? 'bg-blue text-white' : 'bg-blue/20 text-blue'}`}
                            >
                                <span className="mr-1">●</span> Rented
                            </button>
                            <button 
                                onClick={() => handleFilterSelect('Maintenance')} 
                                className={`px-3 py-2 rounded-lg flex items-center ${filterType === 'Maintenance' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}
                            >
                                <span className="mr-1">●</span> Maintenance
                            </button>
                            <button 
                                onClick={() => handleFilterSelect(null)} 
                                className={`px-3 py-2 rounded-lg flex items-center ${filterType === null ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                All Status
                            </button>
                        </div>

                        {/* Entries selector */}
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

                    {/* Additional filters */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        {/* Category filter */}
                        <div className="relative">
                            <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                                <FaTags className="mr-2 text-gray-500" /> 
                                {categoryFilter || 'Filter by Category'}
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 overflow-hidden hidden group-hover:block">
                                {categories.map((category, idx) => (
                                    <button 
                                        key={idx} 
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${categoryFilter === category ? 'bg-blue/10 text-blue/90' : ''}`}
                                        onClick={() => handleCategoryFilter(category)}
                                    >
                                        {category || 'Uncategorized'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Region filter */}
                        <div className="relative">
                            <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                {regionFilter || 'Filter by Region'}
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 overflow-hidden hidden group-hover:block">
                                {regions.map((region, idx) => (
                                    <button
                                        key={idx}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${regionFilter === region ? 'bg-blue/10 text-blue/90' : ''}`}
                                        onClick={() => handleRegionFilter(region)}
                                    >
                                        {region || 'Unknown'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cars table */}
                <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center cursor-pointer" onClick={() => requestSort('carDetails.carMake')}>
                                                    Car Details
                                                    {getSortIcon('carDetails.carMake')}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center cursor-pointer" onClick={() => requestSort('location.region')}>
                                                    Location
                                                    {getSortIcon('location.region')}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center cursor-pointer" onClick={() => requestSort('pricing.hourlyRate')}>
                                                    Pricing
                                                    {getSortIcon('pricing.hourlyRate')}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center cursor-pointer" onClick={() => requestSort('status')}>
                                                    Status
                                                    {getSortIcon('status')}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center cursor-pointer" onClick={() => requestSort('verification.isVerified')}>
                                                    Verification
                                                    {getSortIcon('verification.isVerified')}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center cursor-pointer" onClick={() => requestSort('createdAt')}>
                                                    Added Date
                                                    {getSortIcon('createdAt')}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentCars.length > 0 ? (
                                            currentCars.map((car) => (
                                                <tr key={car._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                {car.media?.mainImage ? (
                                                                    <img 
                                                                        src={car.media.mainImage} 
                                                                        alt={`${car.carDetails.carMake} ${car.carDetails.carModel}`}
                                                                        className="h-10 w-10 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <FaCar className="text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {car.carDetails.carMake} {car.carDetails.carModel}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Year: {car.carDetails.year} • {car.carDetails.color}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    Plate: {car.carDetails.plateNumber}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 flex items-center">
                                                            <FaMapMarkerAlt className="text-red-500 mr-1" />
                                                            {car.location?.city || 'N/A'}, {car.location?.region || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            ${car.pricing?.dailyRate || 0}/day
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ${car.pricing?.hourlyRate || 0}/hour
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 
                                                            car.status === 'Rented' ? 'bg-blue/20 text-blue' : 
                                                            car.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                                                            'bg-gray-100 text-gray-800'}`}>
                                                            {car.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${car.verification?.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {car.verification?.isVerified ? 'Verified' : 'Unverified'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <FaRegCalendarAlt className="mr-1 text-gray-400" />
                                                            {new Date(car.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleView(car._id)}
                                                                className="text-blue hover:text-primary p-1 rounded-full hover:bg-blue/10"
                                                                title="View Details"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(car._id)}
                                                                className="text-yellow-600 hover:text-yellow-700 p-1 rounded-full hover:bg-yellow-50"
                                                                title="Edit Car"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(car._id)}
                                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                                                title="Delete Car"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-6 py-12 text-center" colSpan="7">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <FaCar className="text-gray-300 text-5xl mb-4" />
                                                        <p className="text-lg text-gray-500 font-medium">No cars found</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {searchTerm ? 'Try adjusting your search' : 'Add some cars to get started'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    
                    {/* Pagination controls */}
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                    currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{filteredCars.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
                                    <span className="font-medium">{Math.min(indexOfLastItem, filteredCars.length)}</span> of{' '}
                                    <span className="font-medium">{filteredCars.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    
                                    {/* Simple pagination numbers */}
                                    {[...Array(totalPages).keys()].map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => setCurrentPage(number + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === number + 1
                                                    ? 'z-10 bg-blue border-blue text-white'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {number + 1}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                            currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizedCarsTable;