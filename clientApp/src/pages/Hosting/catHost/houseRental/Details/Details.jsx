import { useState, useEffect } from 'react';
import {
    FaHome, FaMapMarked, FaDollarSign, FaCalendarAlt, FaUsers, FaList,
    FaWheelchair, FaUserCircle, FaShieldAlt, FaBan, FaLink,
    FaKey, FaDirections, FaWifi, FaBook, FaClipboardList, FaSignOutAlt,
    FaCamera, FaArrowLeft,
    FaBed
} from 'react-icons/fa';
import { LuCircleArrowLeft } from "react-icons/lu";
import PhotoTour from './components/YourSpace/PhotoTour';
import Title from './components/YourSpace/Title';
import PropertyType from './components/YourSpace/PropertyType';
import Pricing from './components/YourSpace/Pricing';
import Availability from './components/YourSpace/Availability';
import Guests from './components/YourSpace/Guests';
import Description from './components/YourSpace/Description';
import Accessibility from './components/YourSpace/Accessibility';
import Location from './components/YourSpace/Location';
import Host from './components/YourSpace/Host';
import HouseRules from './components/YourSpace/HouseRules';
import GuestSafety from './components/YourSpace/GuestSafety';
import Cancellation from './components/YourSpace/Cancellation';


import CheckInOut from './components/ArrivalGuide/CheckInOut';
import Directions from './components/ArrivalGuide/Directions';
import WifiDetails from './components/ArrivalGuide/WifiDetails';
import CheckoutInstructions from './components/ArrivalGuide/CheckoutInstructions';
import HostLayout from '../../../ComponentHost/HostLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectProperty } from '../../../../../redux/actions/propertyActions';

import axios from 'axios';
import TopNavHost from '../../../ComponentHost/TopNavHost';
import { useTranslation } from 'react-i18next';
import RoomLayout from './components/YourSpace/C_photos/Layou_Room';
import Amenities from './components/YourSpace/Amenities';
import { Bathrooms } from './components/YourSpace/Bathrooms';

const Details = ({ sectionPath, job }) => {

    
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation(['properties']);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    // Map route paths to section IDs
    const pathToSectionMap = {
        'photo-tour': { tab: 'your-space', section: 'photo-tour' },
        'rooms': { tab: 'your-space', section: 'rooms' },
        'title': { tab: 'your-space', section: 'title' },
        'property-type': { tab: 'your-space', section: 'property-type' },
        'pricing': { tab: 'your-space', section: 'pricing' },
        'availability': { tab: 'your-space', section: 'availability' },
        'guests': { tab: 'your-space', section: 'guests' },
        'description': { tab: 'your-space', section: 'description' },
        'amenities': { tab: 'your-space', section: 'amenities' },
        'propertyfeatures': { tab: 'your-space', section: 'propertyfeatures' },
        'accessibility': { tab: 'your-space', section: 'accessibility' },
        'location': { tab: 'your-space', section: 'location' },
        'host': { tab: 'your-space', section: 'host' },
        'bathrooms': { tab: 'your-space', section: 'bathrooms' },
        'rules': { tab: 'your-space', section: 'rules' },
        'safety': { tab: 'your-space', section: 'safety' },
        'cancellation': { tab: 'your-space', section: 'cancellation' },
        'check-in': { tab: 'arrival-guide', section: 'check-in' },
        'proximity': { tab: 'your-space', section: 'proximity' },
        'wifi': { tab: 'arrival-guide', section: 'wifi' },
        'manual': { tab: 'arrival-guide', section: 'manual' },
        'house-rules': { tab: 'arrival-guide', section: 'house-rules' },
        'checkout': { tab: 'arrival-guide', section: 'checkout' },
    };

    const [activeTab, setActiveTab] = useState('your-space');
    const [activeSection, setActiveSection] = useState('title');

    // Handle window resize to detect mobile/desktop
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect to set default section based on activeTab
    useEffect(() => {
        if (activeTab === 'your-space' && activeSection !== 'title' && !pathToSectionMap[sectionPath]) {
            setActiveSection('title');
            navigate(`/host/properties/${id}/details/title`);
        } else if (activeTab === 'arrival-guide' && !['check-in', 'wifi', , 'house-rules', 'checkout'].includes(activeSection)) {
            setActiveSection('check-in');
            navigate(`/host/properties/${id}/details/check-in`);
        }
    }, [activeTab, activeSection, id, navigate, sectionPath]);

    useEffect(() => {
        // Find the property by ID
        const getHotel = async () => {
            try {
                const response = await axios.get(`/api/hotels/find/${id}`);
                const property = response.data;
                if (property) {
                    dispatch(selectProperty(property));
                }
            } catch (error) {
                console.error("Error fetching hotel data:", error);
            }
        };

        getHotel();
    }, [id, dispatch]);

    // Effect to handle section changes from route
    useEffect(() => {
        if (sectionPath && pathToSectionMap[sectionPath]) {
            const { tab, section } = pathToSectionMap[sectionPath];
            setActiveTab(tab);
            setActiveSection(section);
        } else {
            // Default to photo-tour if no valid sectionPath
            setActiveTab('your-space');
            setActiveSection('title');
            navigate(`/host/properties/${id}/details/title`);
        }
    }, [sectionPath, id, navigate]);
    const selectedProperty = useSelector(state => state.property.selectedProperty);
 
    const filteredCategories = [
        { id: 'title', label: t('properties:menu.title'), icon: FaHome },
        { id: 'photo-tour', label: t('properties:menu.photoTour'), icon: FaCamera },
        { id: 'rooms', label: t('properties:menu.rooms'), icon: FaBed },
        { id: 'bathrooms', label: t('properties:menu.bathrooms'), icon: FaBed },
        { id: 'property-type', label: t('properties:menu.propertyType'), icon: FaHome },
        { id: 'pricing', label: t('properties:menu.pricing'), icon: FaDollarSign },
        { id: 'availability', label: t('properties:menu.availability'), icon: FaCalendarAlt },
        { id: 'guests', label: t('properties:menu.numberOfGuests'), icon: FaUsers },
        { id: 'description', label: t('properties:menu.description'), icon: FaBook },
        { id: 'amenities', label: t('properties:menu.amenities'), icon: FaList },
        { id: 'propertyfeatures', label: t('properties:menu.propertyFeatures'), icon: FaList },
        { id: 'accessibility', label: t('properties:menu.accessibilityFeatures'), icon: FaWheelchair },
        { id: 'location', label: t('properties:menu.location'), icon: FaMapMarked },
        { id: 'proximity', label: t('properties:menu.proximity'), icon: FaDirections },
        { id: 'host', label: t('properties:menu.aboutTheHost'), icon: FaUserCircle },
        { id: 'rules', label: t('properties:menu.houseRules'), icon: FaClipboardList },
        { id: 'safety', label: t('properties:menu.guestSafety'), icon: FaShieldAlt },
        { id: 'cancellation', label: t('properties:menu.cancellationPolicy'), icon: FaBan },
    ];
    
    // Filter out the 'guests' category if the property type is not 'Hotel' or 'Luxury'
    const hotelTypes = ['hotel', 'guesthouse', 'hostel', 'boutique-hotel'];

    const yourSpaceCategories = hotelTypes.includes(selectedProperty?.type?.type)
      ? filteredCategories.filter(category => 
          category.id !== 'guests' &&
          category.id !== 'pricing' &&
          category.id !== 'amenities' &&
          category.id !== 'bathrooms' 

        )
      : filteredCategories;
    
        
    const arrivalGuideCategories = [
        { id: 'check-in', label: t('properties:menu.checkInAndCheckout'), icon: FaKey },
        { id: 'wifi', label: t('properties:menu.wifiDetails'), icon: FaWifi },
        { id: 'house-rules', label: t('properties:menu.houseRules'), icon: FaClipboardList },
        { id: 'checkout', label: t('properties:menu.checkoutInstructions'), icon: FaSignOutAlt },
    ];

    // Navigate to the section's dedicated route when a sidebar item is clicked
    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        navigate(`/host/properties/${id}/details/${sectionId}`);
    };

    const handleBackToMenu = () => {
        navigate(`/host/properties/${id}/menu`);
    };

    const setTabAndSection = (tab, section) => {
        setActiveTab(tab);
        setActiveSection(section);
        navigate(`/host/properties/${id}/details/${section}`);
    };

  

    // Get the current section's info
    const getCurrentSectionInfo = () => {
        const categories = activeTab === 'your-space' ? yourSpaceCategories : arrivalGuideCategories;
        return categories.find(item => item.id === activeSection) || categories[0];
    };

    const currentSection = getCurrentSectionInfo();

    const renderContent = () => {
        if (activeTab === 'your-space') {
            switch (activeSection) {
                case 'title': return <Title title={t('title')} />;
                case 'photo-tour': return <PhotoTour />;
                case 'property-type': return <PropertyType />;
                case 'pricing': return <Pricing />;
                case 'availability': return <Availability />;
                case 'guests': return <Guests />;
                case 'description': return <Description />;
                case 'amenities': return <Amenities mode ={'amenities'} />;
                case 'propertyfeatures': return <Amenities mode ={'properties'} />;
                case 'accessibility': return <Accessibility />;
                case 'location': return <Location />;
                case 'host': return <Host />;
                case 'rooms': return <RoomLayout job={job} />;
                case 'bathrooms': return <Bathrooms />;
                case 'rules': return <HouseRules />;
                case 'safety': return <GuestSafety />;
                case 'cancellation': return <Cancellation />;
                case 'custom-link': return <CustomLink />;
                case 'proximity': return <Directions />;

                default: return <PhotoTour />;
            }
        } else {
            switch (activeSection) {
                case 'check-in': return <CheckInOut />;
                case 'wifi': return <WifiDetails />;
                case 'house-rules': return <HouseRules />;
                case 'checkout': return <CheckoutInstructions />;
                default: return <CheckInOut />;
            }
        }
    };

    // Mobile version of the Details page
    if (isMobile) {
        return (
            <HostLayout>
                <TopNavHost category={"properties"} />
                <div className="flex flex-col min-h-screen bg-gray-50 pt-16">
                    {/* Mobile header with back button and section title */}
                    <div className="sticky top-16 z-10 bg-white p-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <button 
                                onClick={handleBackToMenu}
                                className="bg-blue hover:bg-blue-600 p-2 rounded-full"
                            >
                                <FaArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <div className="flex items-center gap-2">
                                {currentSection.icon && (
                                    <currentSection.icon className="w-5 h-5 text-blue" />
                                )}
                                <h1 className="text-lg font-semibold">{currentSection.label}</h1>
                            </div>
                            <div className="w-8"></div> {/* Empty div for balanced spacing */}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-blue/10 m-2 rounded-lg shadow-sm">
                        {selectedProperty ? (
                            <div className="p-4">
                                <h1 className="text-xl font-bold mb-4 text-gray-800">{selectedProperty.name}</h1>
                                {renderContent()}
                            </div>
                        ) : (
                            <div className="p-4 flex justify-center items-center h-full">
                                <p className="text-gray-600">Loading property details...</p>
                            </div>
                        )}
                    </div>
                </div>
            </HostLayout>
        );
    }

    // Desktop version remains mostly unchanged
    return (
        <HostLayout>
            <TopNavHost category={"properties"} />
            <div className="flex min-h-screen bg-gray-50 pt-16">
                {/* Sidebar - Always visible on desktop */}
                <div className="lg:w-[400px] bg-white border-r border-gray-200 fixed top-20 bottom-0 overflow-y-auto z-40 hidden md:block">
                    <div className="p-4">
                        {/* Back button */}
                        <div className="flex items-center gap-4 mx-20 my-6 ">
                            <button 
                                onClick={() => navigate(`/host/properties`)}
                                className="bg-gray-600 hover:bg-gray-400 p-2 rounded-full"
                            >
                                <LuCircleArrowLeft className="w-6 h-6 text-blue" />
                            </button>
                            <h1 className="text-3xl"> {t('properties:menu.adEditTool')}</h1>
                        </div>
                        
                        {/* Main tabs */}
                        <div className="flex mb-6 border-b ">
                            <button
                                className={`pb-2 px-4 ${activeTab === 'your-space'
                                    ? 'border-b-2 border-blue text-blue'
                                    : 'text-gray-600'}`}
                                onClick={() => setTabAndSection('your-space', 'photo-tour')}
                            >
                                {t('properties:menu.yourSpace')}
                            </button>
                            <button
                                className={`pb-2 px-4 ${activeTab === 'arrival-guide'
                                    ? 'border-b-2 border-blue text-blue'
                                    : 'text-gray-600'}`}
                                onClick={() => setTabAndSection('arrival-guide', 'check-in')}
                            >
                                 {t('properties:menu.arrivalGuide')}
                            </button>
                        </div>

                        {/* Categories */}
                        <nav className="space-y-1">
                            {(activeTab === 'your-space' ? yourSpaceCategories : arrivalGuideCategories)
                                .map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleSectionChange(category.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left   ${activeSection === category.id
                                                ? 'bg-blue text-white'
                                                : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <category.icon className={`w-5 h-5 ${activeSection === category.id ? 'text-white' : 'text-gray-500'
                                            }`} />
                                        {category.label}
                                    </button>
                                ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-blue/10 m-0 md:m-6 rounded-lg shadow-sm md:ms-[420px]">
                    {selectedProperty ? (
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">{selectedProperty.name}</h1>
                            {renderContent()}
                        </div>
                    ) : (
                        <div className="p-6">
                            <p>Loading property details...</p>
                        </div>
                    )}
                </div>
            </div>
        </HostLayout>
    );
};

export default Details;