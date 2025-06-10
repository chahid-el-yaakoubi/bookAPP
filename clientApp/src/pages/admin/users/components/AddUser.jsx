import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt,
    FaLock, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaSave,
    FaCar, FaHotel, FaHome, FaStore, FaUsers, FaShieldAlt
} from "react-icons/fa";
import useFetch from "../../../../hooks/useFetch";
import { updateUser } from "../../../../Lib/api";

const AddUserPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        isAdmin: false,
        isVerified: false,
        adminUsers: false,
        adminCars: false,
        adminHotels: false,
        adminHouses: false,
        adminShops: false
    });

    const { id } = useParams()
    const { data } = useFetch(`/api/users/${id}`)

    useEffect(() => {
        if (data) {
            setFormData({
                username: data.username || "",
                fullName: data.fullName || "",
                email: data.email || "",
                password: "", // Don't populate password for editing
                phone: data.phone || "",
                city: data.city || "",
                isAdmin: data.isAdmin || false,
                isVerified: data.isVerified || false,
                adminUsers: data.adminUsers || false,
                adminCars: data.adminCars || false,
                adminHotels: data.adminHotels || false,
                adminHouses: data.adminHouses || false,
                adminShops: data.adminShops || false
            });
        }
    }, [data])

    const handleBack = () => {
        navigate("/iAmAdmin/users");
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate required fields
        if (!formData.username.trim()) {
            setError("Username is required");
            setLoading(false);
            return;
        }
        
        if (!formData.email.trim()) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        if (!id && !formData.password.trim()) {
            setError("Password is required for new users");
            setLoading(false);
            return;
        }

        if (id) {
            // Update existing user
            try {
                // Remove password from update if it's empty
                const updateData = { ...formData };
                if (!updateData.password.trim()) {
                    delete updateData.password;
                }

                const response = await updateUser(id, updateData);

                if (response.status !== 200) {
                    const errorData = response.error;
                    throw new Error(errorData?.message || "Failed to update user");
                }

                const userData = response.data;
                setSuccess(true);

                // Redirect to the user's page after 2 seconds
                setTimeout(() => {
                    navigate(`/iAmAdmin/users/${userData._id || id}`);
                }, 2000);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            // Create new user
            try {
                console.log("Creating user with data:", formData);

                // For creating a new user, use a different endpoint or ensure the register endpoint handles admin fields
                const response = await fetch("/api/auth/register", { // Changed from /api/auth/register to /api/users
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Add authorization header if needed
                        // "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to create user");
                }

                const userData = await response.json();
                setSuccess(true);

                // Redirect to the new user's page after 2 seconds
                setTimeout(() => {
                    navigate(`/iAmAdmin/users/${userData._id || userData.userId}`);
                }, 2000);

            } catch (err) {
                console.error("Error creating user:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue/20">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue mb-4"></div>
                    <p className="text-gray-600 font-medium">{id ? 'Updating user...' : 'Creating new user...'}</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue/20">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex items-center justify-center text-green mb-4">
                        <FaCheckCircle className="w-16 h-16" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        {id ? 'User Updated Successfully!' : 'User Created Successfully!'}
                    </h1>
                    <p className="text-gray-600 text-center mb-6">Redirecting to user profile...</p>
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
                    className="mb-6 flex items-center text-gray-900 font-medium hover:text-gray-500 transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Back to Users List
                </button>

                {/* Header section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue to-blue/50 p-6">
                        <div className="flex items-center">
                            <div className="bg-white p-4 rounded-full mr-4 shadow-md">
                                <FaUser className="text-3xl text-blue" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    {id ? 'Edit User' : 'Add New User'}
                                </h1>
                                <p className="text-gray-800">
                                    {id ? 'Update user account details' : 'Create a new user account'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red text-red-700 p-4 mb-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <FaTimesCircle className="mr-2" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main user info */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden md:col-span-2">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800">User Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Username */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Username <span className="text-red">*</span>
                                        </label>
                                        <div className="flex">
                                            <div className="bg-blue/20 p-3 rounded-l-lg">
                                                <FaUser className="text-blue" />
                                            </div>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 border border-gray-300 p-2 rounded-r-lg focus:ring-blue focus:border-blue"
                                                placeholder="Enter username"
                                            />
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <div className="flex">
                                            <div className="bg-blue/20 p-3 rounded-l-lg">
                                                <FaUser className="text-blue" />
                                            </div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="flex-1 border border-gray-300 p-2 rounded-r-lg focus:ring-blue focus:border-blue"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email <span className="text-red">*</span>
                                        </label>
                                        <div className="flex">
                                            <div className="bg-purple-100 p-3 rounded-l-lg">
                                                <FaEnvelope className="text-purple" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="flex-1 border border-gray-300 p-2 rounded-r-lg focus:ring-blue focus:border-blue"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Password {!id && <span className="text-red">*</span>}
                                            {id && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
                                        </label>
                                        <div className="flex">
                                            <div className="bg-gray-100 p-3 rounded-l-lg">
                                                <FaLock className="text-gray" />
                                            </div>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!id}
                                                className="flex-1 border border-gray-300 p-2 rounded-r-lg focus:ring-blue focus:border-blue"
                                                placeholder={id ? "Enter new password (optional)" : "Enter password"}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <div className="flex">
                                            <div className="bg-green-100 p-3 rounded-l-lg">
                                                <FaPhone className="text-green" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="flex-1 border border-gray-300 p-2 rounded-r-lg focus:ring-blue focus:border-blue"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <div className="flex">
                                            <div className="bg-yellow-100 p-3 rounded-l-lg">
                                                <FaMapMarkerAlt className="text-yellow" />
                                            </div>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="flex-1 border border-gray-300 p-2 rounded-r-lg focus:ring-blue focus:border-blue"
                                                placeholder="Enter city"
                                            />
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
                                                <FaShieldAlt className="text-gray" />
                                            </div>
                                            <span className="text-gray-700">Admin</span>
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="isAdmin"
                                                    checked={formData.isAdmin}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-blue/90"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Verified Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-gray-100 p-2 rounded-lg mr-3">
                                                <FaCheckCircle className="text-gray" />
                                            </div>
                                            <span className="text-gray-700">Verified</span>
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="isVerified"
                                                    checked={formData.isVerified}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-blue/90"
                                                />
                                            </label>
                                        </div>
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
                                                <FaUsers className="text-blue" />
                                            </div>
                                            <span className="text-gray-700"> Users</span>
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="adminUsers"
                                                    checked={formData.adminUsers}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-blue/90"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Admin Cars */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-blue/20 p-2 rounded-lg mr-3">
                                                <FaCar className="text-blue" />
                                            </div>
                                            <span className="text-gray-700">Cars</span>
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="adminCars"
                                                    checked={formData.adminCars}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-blue/90"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Admin Hotels */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-blue/20 p-2 rounded-lg mr-3">
                                                <FaHotel className="text-blue" />
                                            </div>
                                            <span className="text-gray-700"> Hotels</span>
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="adminHotels"
                                                    checked={formData.adminHotels}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-blue/90"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Admin Houses */}
                                    {/* <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-blue/20 p-2 rounded-lg mr-3">
                                                <FaHome className="text-blue" />
                                            </div>
                                            <span className="text-gray-700">Admin Houses</span>
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="adminHouses"
                                                    checked={formData.adminHouses}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-blue/90"
                                                />
                                            </label>
                                        </div>
                                    </div> */}

                                    {/* Admin Shops */}
                                    {/* <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-blue/20 p-2 rounded-lg mr-3">
                                                <FaStore className="text-blue" />
                                            </div>
                                            <span className="text-gray-700">Admin Shops</span>
                                        </div>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="adminShops"
                                                    checked={formData.adminShops}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-blue/90"
                                                />
                                            </label>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue/90 text-white font-medium rounded-lg hover:bg-blue/80 transition-colors shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave className="mr-2" /> 
                                {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update User' : 'Create User')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserPage;