import React, { useContext, useEffect, useState } from 'react';
import { User, Camera, Lock, Save, Edit, X } from 'lucide-react';
import axios from 'axios'; // Add axios import
const apiUrl = import.meta.env.VITE_API_URL;

import { Navbar } from './Navbar';
import { Header } from './Header';
import { ChangePassword } from './ChangePassword';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contextApi/AuthContext';
import useFetch from '../hooks/useFetch';
import { LuCircleArrowLeft } from 'react-icons/lu';

export const Profile = () => {
    const { user } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        id: '',
        fullName: '',
        email: '',
        phone: '',
        username: '',
        city: '',
        avatarUrl: `https://static.vecteezy.com/system/resources/previews/002/275/847/non_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg`,
        createdAt: '',
        updatedAt: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(userData);
    const [avatarPreview, setAvatarPreview] = useState(userData.avatarUrl);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false); // Add loading state for update
    const [updateError, setUpdateError] = useState(null); // Add error state for update

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.post(
                    `${apiUrl}/users/${user._id}`,
                    {}, // empty body
                    {
                        withCredentials: true,
                    }
                );
                const data = res.data;
                console.log("User data:", data);

                // Update the state with fetched data
                setUserData({
                    id: data._id,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    username: data.username,
                    city: data.city,
                    avatarUrl: data.avatarUrl || userData.avatarUrl, // Use avatar URL from data if available
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt
                });

                setFormData({
                    id: data._id,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    username: data.username,
                    city: data.city,
                    avatarUrl: data.avatarUrl || userData.avatarUrl,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt
                });

            } catch (err) {
                console.error("Error fetching user data:", err.response?.data?.message || err.message);
            }
        };

        fetchUserData(); // Call fetchUserData function on component mount
    }, [user._id]); // Run this effect when user._id changes

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission with axios PUT request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);

        try {
            const response = await axios.put(`${apiUrl}/users/${user._id}`, formData, {
                withCredentials: true,
            });
            setUserData(response.data); // Update userData after a successful update
            setIsEditing(false);
            console.log('Profile updated successfully:', response.data);
        } catch (err) {
            setUpdateError(err.response?.data?.message || 'Failed to update profile');
            console.error('Error updating profile:', err);
        } finally {
            setUpdateLoading(false);
        }
    };

    // Toggle edit mode
    const toggleEdit = () => {
        if (isEditing) {
            setFormData(userData); // Reset form if canceling
        }
        setIsEditing(!isEditing);
    };

    // Open avatar selection modal
    const openAvatarModal = () => {
        setShowAvatarModal(true);
    };

    // Select avatar from modal
    const selectAvatar = (avatarUrl) => {
        setFormData(prev => ({ ...prev, avatarUrl }));
        setShowAvatarModal(false);
    };

    return (
        <>
            <Navbar />

            {(useLocation().pathname.includes('change-pass')) ? (
                <ChangePassword />
            ) : (
                <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg mb-20 min-h-[80vh] shadow-xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue hover:bg-blue/80 p-2 rounded-full mb-8 mt-5"
                    >
                        <LuCircleArrowLeft className="w-6 h-6 text-white" />
                    </button>

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <User className="mr-2" size={28} />
                            {userData.username}
                        </h1>
                        <button
                            onClick={toggleEdit}
                            className="flex items-center px-4 py-2 bg-blue text-white rounded-md hover:bg-blue transition-colors"
                            disabled={updateLoading}
                        >
                            {isEditing ? (
                                <>
                                    <X size={18} className="mr-1" /> Cancel
                                </>
                            ) : (
                                <>
                                    <Edit size={18} className="mr-1" /> Edit Profile
                                </>
                            )}
                        </button>
                    </div>

                    {updateError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {updateError}
                        </div>
                    )}

                    <div className="mb-8 flex flex-col items-center">
                        <div className="relative mb-4">
                            <img
                                src={avatarPreview}
                                alt="User avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                            />
                            {isEditing && (
                                <button
                                    onClick={openAvatarModal}
                                    className="absolute bottom-0 right-0 bg-blue p-2 rounded-full text-white hover:bg-blue transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">{userData.fullName}</h2>
                        <p className="text-gray-500">
                            Member since {userData.createdAt?.split("T")[0]}
                        </p>
                        <p className="text-gray-500">
                            Last Updated At {userData.updatedAt?.split("T")[0]}
                        </p>
                    </div>

                    {!isEditing && (
                        <div className="mb-6">
                            <Link to='change-pass' className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors w-48">
                                <Lock size={18} className="mr-2" /> Change Password
                            </Link>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                ) : (
                                    <p className="text-gray-800">{userData.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                {isEditing ? (
                                    <input
                                        readOnly
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                ) : (
                                    <p className="text-gray-800">{userData.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <p className="text-gray-800">{userData.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                ) : (
                                    <p className="text-gray-800">{userData.username}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <p className="text-gray-800">{userData.city}</p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue/80 transition-colors"
                                >
                                    {updateLoading ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};
