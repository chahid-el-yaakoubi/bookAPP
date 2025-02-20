import { useState } from 'react';
import { FaHome, FaMapMarked, FaDollarSign, FaCalendarAlt, FaUsers, FaList, 
         FaWheelchair, FaUserCircle, FaScroll, FaShieldAlt, FaBan, FaLink,
         FaKey, FaDirections, FaWifi, FaBook, FaClipboardList, FaSignOutAlt,
         FaCamera } from 'react-icons/fa';
import PhotoTour from './components/YourSpace/PhotoTour';
import Title from './components/YourSpace/Title';
import PropertyType from './components/YourSpace/PropertyType';
import Pricing from './components/YourSpace/Pricing';
import Availability from './components/YourSpace/Availability';
import Guests from './components/YourSpace/Guests';
import Description from './components/YourSpace/Description';
import Amenities from './components/YourSpace/Amenities';
import Accessibility from './components/YourSpace/Accessibility';
import Location from './components/YourSpace/Location';
import Host from './components/YourSpace/Host';
import HouseRules from './components/YourSpace/HouseRules';
import GuestSafety from './components/YourSpace/GuestSafety';
import Cancellation from './components/YourSpace/Cancellation';
import CustomLink from './components/YourSpace/CustomLink';

import CheckInOut from './components/ArrivalGuide/CheckInOut';
import Directions from './components/ArrivalGuide/Directions';
import WifiDetails from './components/ArrivalGuide/WifiDetails';
import HouseManual from './components/ArrivalGuide/HouseManual';
import ArrivalHouseRules from './components/ArrivalGuide/HouseRules';
import CheckoutInstructions from './components/ArrivalGuide/CheckoutInstructions';

const Details = () => {
    const [activeTab, setActiveTab] = useState('your-space');
    const [activeSection, setActiveSection] = useState('photo-tour');

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

    const renderContent = () => {
        if (activeTab === 'your-space') {
            switch (activeSection) {
                case 'photo-tour': return <PhotoTour />;
                case 'title': return <Title />;
                case 'property-type': return <PropertyType />;
                case 'pricing': return <Pricing />;
                case 'availability': return <Availability />;
                case 'guests': return <Guests />;
                case 'description': return <Description />;
                case 'amenities': return <Amenities />;
                case 'accessibility': return <Accessibility />;
                case 'location': return <Location />;
                case 'host': return <Host />;
                case 'rules': return <HouseRules />;
                case 'safety': return <GuestSafety />;
                case 'cancellation': return <Cancellation />;
                case 'custom-link': return <CustomLink />;
                default: return null;
            }
        } else {
            switch (activeSection) {
                case 'check-in': return <CheckInOut />;
                case 'directions': return <Directions />;
                case 'wifi': return <WifiDetails />;
                case 'manual': return <HouseManual />;
                case 'house-rules': return <ArrivalHouseRules />;
                case 'checkout': return <CheckoutInstructions />;
                default: return null;
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200">
                <div className="p-4">
                    {/* Main tabs */}
                    <div className="flex mb-6 border-b">
                        <button
                            className={`pb-2 px-4 ${activeTab === 'your-space' 
                                ? 'border-b-2 border-blue text-blue' 
                                : 'text-gray-600'}`}
                            onClick={() => setActiveTab('your-space')}
                        >
                            Your space
                        </button>
                        <button
                            className={`pb-2 px-4 ${activeTab === 'arrival-guide' 
                                ? 'border-b-2 border-blue text-blue' 
                                : 'text-gray-600'}`}
                            onClick={() => setActiveTab('arrival-guide')}
                        >
                            Arrival guide
                        </button>
                    </div>

                    {/* Categories */}
                    <nav className="space-y-1">
                        {(activeTab === 'your-space' ? yourSpaceCategories : arrivalGuideCategories)
                            .map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveSection(category.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                                        activeSection === category.id
                                            ? 'bg-blue text-white'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <category.icon className={`w-5 h-5 ${
                                        activeSection === category.id ? 'text-white' : 'text-gray-500'
                                    }`} />
                                    {category.label}
                                </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white m-6 rounded-lg shadow-sm">
                {renderContent()}
            </div>
        </div>
    );
};

export default Details; 