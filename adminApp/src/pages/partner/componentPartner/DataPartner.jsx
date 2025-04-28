import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { FaEye, FaTrash, FaEdit, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";

const CustomPartnerTable = () => {
  const { data: fetchedData, loading, error } = useFetch("/api/hotels/partner/find");
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (fetchedData && Array.isArray(fetchedData.partners)) {
      const formattedData = fetchedData.partners.map((partner) => ({
        id: partner._id,
        _id: partner._id,
        username: partner.username,
        email: partner.email,
        totalProperties: partner.totalProperties,
        statusCount: partner.statusCount || { active: 0, pending: 0, rejected: 0 },
      }));
      setPartners(formattedData);
    }
  }, [fetchedData]);

 

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return <FaSort className="text-gray-300" />;
    if (sortConfig.direction === 'asc') return <FaSortUp className="text-blue-500" />;
    return <FaSortDown className="text-blue-500" />;
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
          return (a.statusCount.active || 0) > (b.statusCount.active || 0) ? 1 : -1;
        } else if (sortConfig.key === 'pending') {
          return (a.statusCount.pending || 0) > (b.statusCount.pending || 0) ? 1 : -1;
        } else if (sortConfig.key === 'rejected') {
          return (a.statusCount.rejected || 0) > (b.statusCount.rejected || 0) ? 1 : -1;
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

  const handleCheckboxChange = (id) => {
    setSelectedPartners(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPartners.length === currentPartners.length) {
      setSelectedPartners([]);
    } else {
      setSelectedPartners(currentPartners.map(partner => partner._id));
    }
  };

  return (
    <div className="my-2 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Partners Management</h2>
        <Link
          to="/partners/new"
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
        >
          Add New Partner
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading partner data: {error.message}
        </div>
      )}

      {/* Search and pagination controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded p-1 mr-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-600">entries</span>
        </div>
      </div>

      {/* Main table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={selectedPartners.length === currentPartners.length && currentPartners.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('_id')}
              >
                <div className="flex items-center">
                  ID {getSortIcon('_id')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('username')}
              >
                <div className="flex items-center">
                  Username {getSortIcon('username')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center">
                  Email {getSortIcon('email')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('totalProperties')}
              >
                <div className="flex items-center justify-center">
                  Total Properties {getSortIcon('totalProperties')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('active')}
              >
                <div className="flex items-center justify-center">
                  Active {getSortIcon('active')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('pending')}
              >
                <div className="flex items-center justify-center">
                  Pending {getSortIcon('pending')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('rejected')}
              >
                <div className="flex items-center justify-center">
                  Rejected {getSortIcon('rejected')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : currentPartners.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  No partners found
                </td>
              </tr>
            ) : (
              currentPartners.map((partner) => (
                <tr key={partner._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={selectedPartners.includes(partner._id)}
                      onChange={() => handleCheckboxChange(partner._id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                    {partner._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {partner.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {partner.totalProperties}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {partner.statusCount.active || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {partner.statusCount.pending || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {partner.statusCount.rejected || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-center gap-3">
                      <Link to={'https://axistay-client.onrender.com'}>
                        <FaEye className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer" />
                      </Link>
                      
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4">
        <div className="text-sm text-gray-500 mb-4 md:mb-0">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedPartners.length)} of {sortedPartners.length} entries
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-blue-500 hover:bg-blue-50 border border-gray-300'
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
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageToShow
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500 hover:bg-blue-50 border border-gray-300'
                }`}
              >
                {pageToShow}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-500 hover:bg-blue-50 border border-gray-300'
            }`}
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPartnerTable;