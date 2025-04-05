import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaHome, FaMapMarked, FaDollarSign, FaCalendarAlt, FaUsers, FaList,
    FaWheelchair, FaUserCircle, FaScroll, FaShieldAlt, FaBan, FaLink,
    FaKey, FaDirections, FaWifi, FaBook, FaClipboardList, FaSignOutAlt,
    FaCamera, FaArrowLeft, FaArrowRight, FaChevronLeft, FaBars, FaTimes
} from 'react-icons/fa';
import { LuCircleArrowLeft } from "react-icons/lu";
import HostLayout from '../../../../ComponentHost/HostLayout';
import TopNavHost from '../../../../ComponentHost/TopNavHost';
 

const MobileMenuPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('your-space');

    const yourSpaceCategories = [
        { id: 'photo-tour', label: 'Photo tour', icon: FaCamera },
        { id: 'title', label: 'Title', icon: FaHome },
        { id: 'property-type', label: 'Property type', icon: FaHome },
        { id: 'pricing', label: 'Pricing', icon: FaDollarSign },
        { id: 'availability', label: 'Availability', icon: FaCalendarAlt },
        { id: 'guests', label: 'Number of guests', icon: FaUsers },
        { id: 'description', label: 'Description', icon: FaBook },
        { id: 'amenities', label: 'Amenities', icon: FaList },
        { id: 'accessibility', label: 'Accessibility features', icon: FaWheelchair },
        { id: 'location', label: 'Location', icon: FaMapMarked },
        { id: 'host', label: 'About the Host', icon: FaUserCircle },
        { id: 'rules', label: 'House rules', icon: FaClipboardList },
        { id: 'safety', label: 'Guest safety', icon: FaShieldAlt },
        { id: 'cancellation', label: 'Cancellation policy', icon: FaBan },
        { id: 'custom-link', label: 'Custom link', icon: FaLink },
    ];

    const arrivalGuideCategories = [
        { id: 'check-in', label: 'Check-in and Checkout', icon: FaKey },
        { id: 'directions', label: 'Directions', icon: FaDirections },
        { id: 'wifi', label: 'Wifi details', icon: FaWifi },
        { id: 'manual', label: 'House manual', icon: FaBook },
        { id: 'house-rules', label: 'House rules', icon: FaClipboardList },
        { id: 'checkout', label: 'Checkout instructions', icon: FaSignOutAlt },
    ];

    const handleCategorySelect = (sectionId) => {
        navigate(`/host/properties/${id}/details/${sectionId}`);
    };

    const toggleTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <HostLayout>
            <TopNavHost category={"properties"} />
            <div className="flex flex-col min-h-screen bg-gray-50 pt-16">
                {/* Header with back button */}
                <div className="sticky top-16 z-10 bg-white p-4 shadow">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(`/host/properties`)}
                            className="bg-gray-600 hover:bg-gray-400 p-2 rounded-full"
                        >
                            <LuCircleArrowLeft className="w-6 h-6 text-blue" />
                        </button>
                        <h1 className="text-2xl font-bold">Ad Edit Tool</h1>
                    </div>
                </div>

                {/* Main tabs */}
                <div className="flex border-b shadow-sm">
                    <button
                        className={`flex-1 py-3 px-4 text-center ${
                            activeTab === 'your-space'
                                ? 'border-b-2 border-blue text-blue font-semibold'
                                : 'text-gray-600'
                        }`}
                        onClick={() => toggleTab('your-space')}
                    >
                        Your space
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 text-center ${
                            activeTab === 'arrival-guide'
                                ? 'border-b-2 border-blue text-blue font-semibold'
                                : 'text-gray-600'
                        }`}
                        onClick={() => toggleTab('arrival-guide')}
                    >
                        Arrival guide
                    </button>
                </div>

                {/* Categories */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                        {(activeTab === 'your-space' ? yourSpaceCategories : arrivalGuideCategories)
                            .map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategorySelect(category.id)}
                                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-white shadow-sm hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <category.icon className="w-5 h-5 text-blue" />
                                        <span className="text-gray-700">{category.label}</span>
                                    </div>
                                    <FaChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                                </button>
                            ))}
                    </div>
                </div>
            </div>
        </HostLayout>
    );
};

export default MobileMenuPage;