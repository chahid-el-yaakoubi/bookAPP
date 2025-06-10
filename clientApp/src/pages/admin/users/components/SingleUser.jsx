import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt,
  FaLock, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaEdit,
  FaCar, FaHotel, FaHome, FaStore, FaUsers, FaShieldAlt
} from "react-icons/fa";
import useFetch from "../../../../hooks/useFetch";

const SingleUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("user");

  const { data: userData, loading, error } = useFetch(`/api/users/${id}`);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const handleBack = () => {
    navigate("/iAmAdmin/users");
  };

  const handleEdit = () => {
    navigate(`/iAmAdmin/users/edit/${id}`);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue/20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue mb-4"></div>
          <p className="text-gray-600 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue/20">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Error Loading User</h1>
          <p className="text-gray-600 text-center mb-6">{error.message || "There was an issue retrieving the user details."}</p>
          <button
            onClick={handleBack}
            className="w-full py-3 bg-blue text-white font-medium rounded-lg hover:bg-blue/90 transition-colors shadow-md flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Users List
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue/20">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center text-yellow-500 mb-4">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">User Not Found</h1>
          <p className="text-gray-600 text-center mb-6">The user you're looking for doesn't exist or you may not have permission to view it.</p>
          <button
            onClick={handleBack}
            className="w-full py-3 bg-blue text-white font-medium rounded-lg hover:bg-blue/90 transition-colors shadow-md flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Users List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-black font-medium hover:text-black transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Users List
        </button>

        {/* Header section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue to-blue/90 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-white p-4 rounded-full mr-4 shadow-md">
                  <FaUser className="text-3xl text-orange-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-blue/10 transition-colors shadow-md"
                >
                  <FaEdit className="mr-2" /> Edit User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User information grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main user info */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden md:col-span-2">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">User Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="flex items-start">
                  <div className="bg-blue/20 p-3 rounded-lg mr-4">
                    <FaUser className="text-blue0" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium text-gray-800">{user.username}</p>
                  </div>
                </div>

                {/* Full Name */}
                <div className="flex items-start">
                  <div className="bg-blue/20 p-3 rounded-lg mr-4">
                    <FaUser className="text-blue0" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{user.fullName || "Not provided"}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <FaEnvelope className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <FaPhone className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{user.phone || "Not provided"}</p>
                  </div>
                </div>

                {/* City */}
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <FaMapMarkerAlt className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium text-gray-800">{user.city || "Not provided"}</p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-lg mr-4">
                    <FaCalendarAlt className="text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registered On</p>
                    <p className="font-medium text-gray-800">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status and permissions */}
          <div className="space-y-6">
            {/* Status card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Account Status</h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Admin Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                      <FaShieldAlt className="text-gray-500" />
                    </div>
                    <span className="text-gray-700">Admin</span>
                  </div>
                  <div>
                    {user.isAdmin ? (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </div>
                </div>

                {/* Verified Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                      <FaCheckCircle className="text-gray-500" />
                    </div>
                    <span className="text-gray-700">Verified</span>
                  </div>
                  <div>
                    {user.isVerified ? (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                      <FaCalendarAlt className="text-gray-500" />
                    </div>
                    <span className="text-gray-700">Last Updated</span>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Admin permissions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Admin Permissions</h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Admin Users */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue/20 p-2 rounded-lg mr-3">
                      <FaUsers className="text-blue0" />
                    </div>
                    <span className="text-gray-700">Users</span>
                  </div>
                  <div>
                    {user.adminUsers ? (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Cars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue/20 p-2 rounded-lg mr-3">
                      <FaCar className="text-blue0" />
                    </div>
                    <span className="text-gray-700">Cars</span>
                  </div>
                  <div>
                    {user.adminCars ? (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Hotels */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue/20 p-2 rounded-lg mr-3">
                      <FaHotel className="text-blue0" />
                    </div>
                    <span className="text-gray-700">Hotels</span>
                  </div>
                  <div>
                    {user.adminHotels ? (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Houses */}
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue/20 p-2 rounded-lg mr-3">
                      <FaHome className="text-blue0" />
                    </div>
                    <span className="text-gray-700">Admin Houses</span>
                  </div>
                  <div>
                    {user.adminHouses ? (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </div>
                </div> */}

                {/* Admin Shops */}
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue/20 p-2 rounded-lg mr-3">
                      <FaStore className="text-blue0" />
                    </div>
                    <span className="text-gray-700">Admin Shops</span>
                  </div>
                  <div>
                    {user.adminShops ? (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;