import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// Action creators
import { selectProperty } from '../../../../../../../redux/actions/propertyActions';

// Icon imports consolidated 
import {
    FaFan, FaThermometerHalf, FaHome, FaLightbulb, FaVolumeMute,
    FaTv, FaVolumeUp, FaGamepad, FaLaptopHouse, FaLaptop,
    FaChair, FaWifi, FaUtensils, FaCoffee, FaFire, FaBath, FaShower,
    FaHotTub, FaTshirt, FaCut, FaSoap, FaParking, FaBus, FaBiking,
    FaCarAlt, FaUmbrellaBeach, FaLock, FaPhone, FaClock,
    FaFilm, FaBook, FaNetworkWired, FaPrint, FaUsb, FaPlug,
    FaPen, FaBlender, FaWater, FaWineGlass, FaTemperatureHigh,
    FaWeight, FaCloudRain, FaChargingStation, FaTaxi, FaSubway,
    FaMotorcycle, FaSwimmingPool, FaDumbbell, FaSpa, FaLeaf, FaArrowUp,
    FaBuilding, FaSuitcase, FaUserClock, FaBriefcase,
    FaUsers, FaWheelchair, FaToilet, FaHandsHelping, FaEye,
    FaExclamationTriangle, FaFireExtinguisher, FaMedkit,
    FaCamera, FaUserShield, FaKey, FaBaby, FaChild, FaTree, FaUmbrella,
    FaSkiing, FaHiking, FaTableTennis, FaGolfBall, FaSun, FaRecycle,
    FaRobot, FaMicrophone, FaProjectDiagram, FaPaw, FaBed, FaDog,
    FaHandHoldingHeart, FaBroom, FaConciergeBell, FaGlassMartini,
    FaShoppingBasket, FaHandsWash, FaMap, FaExchangeAlt,
    FaHatCowboy, FaChevronDown, FaPlus, FaSave, FaChevronUp, FaTimes,
    FaSnowflake, FaDoorOpen
} from 'react-icons/fa';

import { FcDvdLogo } from "react-icons/fc";
import { MdCurtainsClosed, MdOutlineCleaningServices, MdSmokeFree, MdBalcony, MdIron, MdOutlineLocalLaundryService } from 'react-icons/md';
import { GiMirrorMirror, GiToaster, GiTable, GiChessKing, GiKnifeFork, GiSaltShaker, GiSocks, GiIronMask, GiWashingMachine, GiHouse, GiKitchenKnives } from 'react-icons/gi';
import { BiFridge } from 'react-icons/bi';
import { BiStore, BiBuildingHouse } from 'react-icons/bi';
import { RiMedicineBottleLine, RiBankFill } from 'react-icons/ri';
import { IoMdBusiness } from 'react-icons/io';
import { ImSpoonKnife } from 'react-icons/im';
import { BsPrinter } from 'react-icons/bs';
import { TbAirConditioning, TbIroning } from 'react-icons/tb';

/**
 * Universal Amenities Component
 * Reusable component that can handle both room amenities and property features
 * based on the mode prop
 */
const Amenities = ({ mode }) => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const { id } = useParams();

    // State management
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [customItem, setCustomItem] = useState('');
    const [customItems, setCustomItems] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Define property type categories
    const hotelTypes = ['hotel', 'guesthouse', 'hostel', 'boutique-hotel'];
    const residentialTypes = ['apartment', 'house', 'villa', 'condo'];

    // Get title and description based on mode
    const getComponentInfo = () => {
        return mode === 'amenities'
            ? {
                title: 'Amenities',
                description: 'Select the amenities available in your property\'s rooms/units.'
            }
            : {
                title: 'Property Features',
                description: 'Select the features available throughout your property.'
            };
    };

    // Define all possible amenities
    const roomAmenities = [
        // Room Features
        { id: 'air_conditioning', label: 'Air Conditioning', icon: FaFan, category: 'Room Features' },
        { id: 'heating_system', label: 'Heating System', icon: FaThermometerHalf, category: 'Room Features' },
        { id: 'fan', label: 'Fan', icon: FaFan, category: 'Room Features' },
        { id: 'wardrobe', label: 'Wardrobe/Closet', icon: FaHome, category: 'Room Features' },
        { id: 'full_length_mirror', label: 'Full-Length Mirror', icon: GiMirrorMirror, category: 'Room Features' },
        { id: 'blackout_curtains', label: 'Blackout Curtains', icon: MdCurtainsClosed, category: 'Room Features' },
        { id: 'reading_lights', label: 'Reading Lights', icon: FaLightbulb, category: 'Room Features' },
        { id: 'soundproofing', label: 'Soundproofing', icon: FaVolumeMute, category: 'Room Features' },
        { id: 'balcony', label: 'Balcony', icon: FaDoorOpen, category: 'Room Features' },
        { id: 'terrace', label: 'Terrace', icon: FaUmbrellaBeach, category: 'Room Features' },
        { id: 'safe', label: 'In-Room Safe', icon: FaLock, category: 'Room Features' },
        { id: 'iron', label: 'Iron & Ironing Board', icon: GiIronMask, category: 'Room Features' },
        { id: 'luggage_rack', label: 'Luggage Rack', icon: FaSuitcase, category: 'Room Features' },
        { id: 'telephone', label: 'Telephone', icon: FaPhone, category: 'Room Features' },
        { id: 'alarm_clock', label: 'Alarm Clock', icon: FaClock, category: 'Room Features' },

        // Entertainment
        { id: 'tv', label: 'TV', icon: FaTv, category: 'Entertainment' },
        { id: 'satellite_tv', label: 'Satellite/Cable TV', icon: FaTv, category: 'Entertainment' },
        { id: 'smart_tv', label: 'Smart TV', icon: FaTv, category: 'Entertainment' },
        { id: 'netflix', label: 'Netflix', icon: FaTv, category: 'Entertainment' },
        { id: 'speakers', label: 'Speakers', icon: FaVolumeUp, category: 'Entertainment' },
        { id: 'game_console', label: 'Game Console', icon: FaGamepad, category: 'Entertainment' },
        { id: 'streaming_services', label: 'Streaming Services', icon: FaFilm, category: 'Entertainment' },
        { id: 'books', label: 'Books & Magazines', icon: FaBook, category: 'Entertainment' },
        { id: 'board_games', label: 'Board Games', icon: GiChessKing, category: 'Entertainment' },
        { id: 'premium_channels', label: 'Premium TV Channels', icon: FaTv, category: 'Entertainment' },
        { id: 'dvd_player', label: 'DVD Player', icon: FcDvdLogo, category: 'Entertainment' },

        // Workspace
        { id: 'desk', label: 'Desk / Workspace', icon: FaLaptopHouse, category: 'Workspace' },
        { id: 'laptop_friendly_desk', label: 'Laptop-Friendly Desk', icon: FaLaptop, category: 'Workspace' },
        { id: 'office_chair', label: 'Office Chair', icon: FaChair, category: 'Workspace' },
        { id: 'high_speed_wifi', label: 'High-Speed WiFi', icon: FaWifi, category: 'Workspace' },
        { id: 'ethernet_connection', label: 'Ethernet Connection', icon: FaNetworkWired, category: 'Workspace' },
        { id: 'printer', label: 'Printer Access', icon: FaPrint, category: 'Workspace' },
        { id: 'usb_ports', label: 'USB Charging Ports', icon: FaUsb, category: 'Workspace' },
        { id: 'power_outlets', label: 'Multiple Power Outlets', icon: FaPlug, category: 'Workspace' },
        { id: 'stationery', label: 'Stationery', icon: FaPen, category: 'Workspace' },

        // Kitchen & Dining
        { id: 'refrigerator', label: 'Refrigerator', icon: BiFridge, category: 'Kitchen & Dining' },
        { id: 'microwave', label: 'Microwave', icon: FaUtensils, category: 'Kitchen & Dining' },
        { id: 'electric_kettle', label: 'Electric Kettle', icon: FaCoffee, category: 'Kitchen & Dining' },
        { id: 'toaster', label: 'Toaster', icon: GiToaster, category: 'Kitchen & Dining' },
        { id: 'coffee_machine', label: 'Coffee Machine', icon: FaCoffee, category: 'Kitchen & Dining' },
        { id: 'oven', label: 'Oven', icon: FaFire, category: 'Kitchen & Dining' },
        { id: 'stovetop', label: 'Stovetop', icon: FaFire, category: 'Kitchen & Dining' },
        { id: 'dining_table', label: 'Dining Table & Chairs', icon: GiTable, category: 'Kitchen & Dining' },
        { id: 'kitchenware', label: 'Kitchenware', icon: FaUtensils, category: 'Kitchen & Dining' },
        { id: 'dishwasher', label: 'Dishwasher', icon: MdOutlineCleaningServices, category: 'Kitchen & Dining' },
        { id: 'blender', label: 'Blender', icon: FaBlender, category: 'Kitchen & Dining' },
        { id: 'water_purifier', label: 'Water Purifier', icon: FaWater, category: 'Kitchen & Dining' },
        { id: 'wine_glasses', label: 'Wine Glasses', icon: FaWineGlass, category: 'Kitchen & Dining' },
        { id: 'cutting_board', label: 'Cutting Board & Knives', icon: GiKnifeFork, category: 'Kitchen & Dining' },
        { id: 'spices', label: 'Basic Spices & Cooking Oil', icon: GiSaltShaker, category: 'Kitchen & Dining' },
        { id: 'food_processor', label: 'Food Processor', icon: FaBlender, category: 'Kitchen & Dining' },

        // Bathroom Facilities
        { id: 'private_bathroom', label: 'Private Bathroom', icon: FaBath, category: 'Bathroom Facilities' },
        { id: 'shared_bathroom', label: 'Shared Bathroom', icon: FaBath, category: 'Bathroom Facilities' },
        { id: 'toilet_bidet', label: 'Toilet & Bidet', icon: FaToilet, category: 'Bathroom Facilities' },
        { id: 'shower', label: 'Shower', icon: FaShower, category: 'Bathroom Facilities' },
        { id: 'bathtub', label: 'Bathtub', icon: FaBath, category: 'Bathroom Facilities' },
        { id: 'jacuzzi', label: 'Jacuzzi / Hot Tub', icon: FaHotTub, category: 'Bathroom Facilities' },
        { id: 'towels_bathrobes', label: 'Towels & Bathrobes', icon: FaTshirt, category: 'Bathroom Facilities' },
        { id: 'hairdryer', label: 'Hairdryer', icon: FaCut, category: 'Bathroom Facilities' },
        { id: 'toiletries', label: 'Toiletries', icon: FaSoap, category: 'Bathroom Facilities' },
        { id: 'makeup_mirror', label: 'Makeup Mirror', icon: GiMirrorMirror, category: 'Bathroom Facilities' },
        { id: 'heated_towel_rack', label: 'Heated Towel Rack', icon: FaTemperatureHigh, category: 'Bathroom Facilities' },
        { id: 'bathroom_scale', label: 'Bathroom Scale', icon: FaWeight, category: 'Bathroom Facilities' },
        { id: 'rain_shower', label: 'Rain Shower', icon: FaCloudRain, category: 'Bathroom Facilities' },
        { id: 'shower_cap', label: 'Shower Cap', icon: FaHatCowboy, category: 'Bathroom Facilities' },
        { id: 'slippers', label: 'Slippers', icon: GiSocks, category: 'Bathroom Facilities' },

        // Technology
        { id: 'smart_home', label: 'Smart Home Features', icon: FaRobot, category: 'Technology' },
        { id: 'voice_assistant', label: 'Voice Assistant', icon: FaMicrophone, category: 'Technology' },
        { id: 'usb_charging', label: 'USB Charging Ports', icon: FaUsb, category: 'Technology' },
        { id: 'international_outlets', label: 'International Power Outlets', icon: FaPlug, category: 'Technology' },
        { id: 'digital_key', label: 'Digital Key/Smart Lock', icon: FaKey, category: 'Technology' },
        { id: 'projector', label: 'Projector', icon: FaProjectDiagram, category: 'Technology' },
        { id: 'bluetooth_speaker', label: 'Bluetooth Speaker', icon: FaVolumeUp, category: 'Technology' },

        // Family Features
        { id: 'baby_cot', label: 'Baby Cot/Crib', icon: FaBaby, category: 'Family Features' },
        { id: 'high_chair', label: 'High Chair', icon: FaChair, category: 'Family Features' },
        { id: 'child_safety', label: 'Child Safety Features', icon: FaChild, category: 'Family Features' },
        { id: 'baby_bath', label: 'Baby Bath', icon: FaBath, category: 'Family Features' },
        { id: 'baby_monitor', label: 'Baby Monitor', icon: FaBaby, category: 'Family Features' },
    ];

    // Define property features
    const propertyFeatures = [
        // Essentials
        { id: 'wifi', label: 'Free Wi-Fi', icon: FaWifi, category: 'Essentials' },
        { id: 'air_conditioning', label: 'Air Conditioning', icon: FaSnowflake, category: 'Essentials' },
        { id: 'heating', label: 'Heating', icon: FaFire, category: 'Essentials' },
        { id: 'kitchen', label: 'Fully Equipped Kitchen', icon: GiKitchenKnives, category: 'Essentials' },
        { id: 'parking', label: 'Free Parking', icon: FaParking, category: 'Essentials' },
        { id: 'elevator', label: 'Elevator', icon: FaArrowUp, category: 'Essentials' },

        // Outdoor
        { id: 'garden', label: 'Garden', icon: FaLeaf, category: 'Outdoor' },
        { id: 'terrace_balcony', label: 'Terrace / Balcony', icon: MdBalcony, category: 'Outdoor' },
        { id: 'bbq_area', label: 'BBQ Area', icon: ImSpoonKnife, category: 'Outdoor' },
        { id: 'picnic_area', label: 'Picnic Area', icon: FaUmbrellaBeach, category: 'Outdoor' },
        { id: 'patio', label: 'Patio / Outdoor Seating', icon: FaChair, category: 'Outdoor' },
        { id: 'outdoor_furniture', label: 'Outdoor Furniture', icon: FaChair, category: 'Outdoor' },
        { id: 'beach_access', label: 'Beach Access', icon: FaUmbrella, category: 'Outdoor' },
        { id: 'ski_access', label: 'Ski-in / Ski-out', icon: FaSkiing, category: 'Outdoor' },
        { id: 'hiking_trails', label: 'Hiking Trails', icon: FaHiking, category: 'Outdoor' },
        { id: 'outdoor_pool', label: 'Outdoor Pool', icon: FaSwimmingPool, category: 'Outdoor' },
        { id: 'tennis_court', label: 'Tennis Court', icon: FaTableTennis, category: 'Outdoor' },
        { id: 'golf_course', label: 'Golf Course', icon: FaGolfBall, category: 'Outdoor' },

        // Wellness
        { id: 'indoor_pool', label: 'Indoor Pool', icon: FaSwimmingPool, category: 'Wellness' },
        { id: 'fitness_center', label: 'Gym / Fitness Center', icon: FaDumbbell, category: 'Wellness' },
        { id: 'spa', label: 'Spa & Wellness Center', icon: FaSpa, category: 'Wellness' },
        { id: 'sauna', label: 'Sauna / Steam Room', icon: FaHotTub, category: 'Wellness' },
        { id: 'massage', label: 'Massage Services', icon: FaHandHoldingHeart, category: 'Wellness' },

        // Laundry
        { id: 'washing_machine', label: 'Washing Machine', icon: GiWashingMachine, category: 'Laundry' },
        { id: 'dryer', label: 'Dryer', icon: MdOutlineLocalLaundryService, category: 'Laundry' },
        { id: 'iron_board', label: 'Iron & Ironing Board', icon: MdIron, category: 'Laundry' },
        { id: 'laundry_service', label: 'Laundry Service', icon: MdOutlineCleaningServices, category: 'Laundry' },

        // Business
        { id: 'conference_room', label: 'Conference Room', icon: IoMdBusiness, category: 'Business' },
        { id: 'printing_scanning', label: 'Printing / Scanning', icon: BsPrinter, category: 'Business' },
        { id: 'business_center', label: 'Business Center', icon: FaBriefcase, category: 'Business' },

        // Services
        { id: 'daily_housekeeping', label: 'Daily Housekeeping', icon: FaBroom, category: 'Services' },
        { id: 'breakfast_included', label: 'Breakfast Included', icon: FaCoffee, category: 'Services' },
        { id: 'room_service', label: 'Room Service', icon: FaConciergeBell, category: 'Services' },
        { id: 'restaurant', label: 'On-site Restaurant', icon: FaUtensils, category: 'Services' },
        { id: 'bar', label: 'Bar/Lounge', icon: FaGlassMartini, category: 'Services' },
        { id: 'grocery_delivery', label: 'Grocery Delivery', icon: FaShoppingBasket, category: 'Services' },
        { id: 'childcare', label: 'Childcare Services', icon: FaBaby, category: 'Services' },
        { id: 'dry_cleaning', label: 'Dry Cleaning', icon: FaTshirt, category: 'Services' },
        { id: 'tour_desk', label: 'Tour Desk', icon: FaMap, category: 'Services' },
        { id: 'currency_exchange', label: 'Currency Exchange', icon: FaExchangeAlt, category: 'Services' },
        { id: 'concierge', label: 'Concierge Service', icon: FaConciergeBell, category: 'Services' },
        { id: 'luggage_storage', label: 'Luggage Storage', icon: FaSuitcase, category: 'Services' },
        { id: '24h_front_desk', label: '24-Hour Front Desk', icon: FaUserClock, category: 'Services' },

        // // Pet-Friendly Features
        // { id: 'pets_allowed', label: 'Pets Allowed', icon: FaPaw, category: 'Pet-Friendly Features' },
        // { id: 'pet_beds', label: 'Pet Beds', icon: FaBed, category: 'Pet-Friendly Features' },
        // { id: 'pet_bowls', label: 'Pet Bowls', icon: FaUtensils, category: 'Pet-Friendly Features' },
        // { id: 'dog_walking', label: 'Dog Walking Service', icon: FaDog, category: 'Pet-Friendly Features' },
        // { id: 'pet_sitting', label: 'Pet Sitting Service', icon: FaPaw, category: 'Pet-Friendly Features' },

        // Nearby Services
        { id: 'supermarket', label: 'Supermarket Nearby', icon: BiStore, category: 'Nearby Services' },
        { id: 'pharmacy', label: 'Pharmacy Nearby', icon: RiMedicineBottleLine, category: 'Nearby Services' },
        { id: 'atm_bank', label: 'ATM / Bank Nearby', icon: RiBankFill, category: 'Nearby Services' },
        { id: 'public_transport', label: 'Public Transport Nearby', icon: FaSubway, category: 'Nearby Services' },
        { id: 'hospital', label: 'Hospital Nearby', icon: FaMedkit, category: 'Nearby Services' },
        { id: 'shopping_center', label: 'Shopping Center Nearby', icon: FaShoppingBasket, category: 'Nearby Services' },
    ];

    // Get the appropriate items list based on mode
    const getItems = useCallback(() => {
        return mode === 'amenities' ? roomAmenities : propertyFeatures;
    }, [mode]);

    // Load saved items from redux store on component mount
    useEffect(() => {
        if (!selectedProperty?.property_details) return;

        const propertyType = selectedProperty?.type?.type || '';
        const savedItems = mode === 'amenities'
            ? selectedProperty.property_details.amenities?.standard || []
            : selectedProperty.property_details.propertyFeatures?.standard || [];

        const savedCustomItems = mode === 'amenities'
            ? selectedProperty.property_details.amenities?.custom || []
            : selectedProperty.property_details.propertyFeatures?.custom || [];

        // Convert the array of item IDs to a Set for easier manipulation
        setSelectedItems(new Set(savedItems));
        setCustomItems(savedCustomItems);

        // Filter items based on property type
        filterItemsByPropertyType(propertyType);

        // Initialize all categories as expanded by default
        const allItems = getItems();
        const categories = [...new Set(allItems.map(item => item.category))];
        const initialExpandedState = {};
        categories.forEach(category => {
            initialExpandedState[category] = true;
        });
        setExpandedCategories(initialExpandedState);
    }, [selectedProperty, mode, getItems]);

    // Filter items based on property type
    const filterItemsByPropertyType = useCallback((propertyType) => {
        const allItems = getItems();
        let filteredList = [...allItems];

        // Apply property type filtering
        if (hotelTypes.includes(propertyType)) {
            // For hotels, show only hotel-relevant amenities
            if (mode === 'amenities') {
                // Hotel room amenities - exclude certain categories
                filteredList = filteredList.filter(item =>
                    !['Kitchen & Dining', 'Family Features'].includes(item.category)
                );
            } else {
                // Hotel property features - emphasize certain categories
                // No specific filtering needed, show all property features
            }
        } else if (residentialTypes.includes(propertyType)) {
            // For apartments/houses, emphasize residential amenities
            if (mode === 'amenities') {
                // No specific filtering needed, show all amenities
            } else {
                // For property features, prioritize residential features
                // No specific filtering needed, show all property features
            }
        }

        setFilteredItems(filteredList);
    }, [getItems, mode]);

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === '') {
            // If no search term, use the property-type filtered items
            filterItemsByPropertyType(selectedProperty?.type?.type || '');
            return;
        }

        const lowercasedSearch = searchTerm.toLowerCase();
        const allItems = getItems();

        const searchResults = allItems.filter(item =>
            item.label.toLowerCase().includes(lowercasedSearch) ||
            item.category.toLowerCase().includes(lowercasedSearch)
        );

        setFilteredItems(searchResults);
    }, [searchTerm, getItems, filterItemsByPropertyType, selectedProperty?.type?.type]);

    // Group items by category for display
    const groupedItems = filteredItems.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});

    // Toggle item selection
    const toggleItem = useCallback((id) => {
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    // Add custom item
    const addCustomItem = useCallback(() => {
        if (customItem.trim()) {
            setCustomItems(prev => [...prev, customItem.trim()]);
            setCustomItem('');
        }
    }, [customItem]);

    // Remove custom item
    const removeCustomItem = useCallback((index) => {
        setCustomItems(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Toggle category expansion
    const toggleCategory = useCallback((category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    }, []);

    // Save amenities/features
    const saveItems = async () => {
        setIsSaving(true);
        try {
            const payload = {
                propertyId: id,
                [mode === 'amenities' ? 'amenities' : 'propertyFeatures']: {
                    standard: Array.from(selectedItems),
                    custom: customItems
                }
            };

            const updateData = {
                ...selectedProperty,
                property_details: {
                   ...selectedProperty.property_details,
                    [mode === 'amenities' ? 'amenities' : 'propertyFeatures']: payload[mode === 'amenities' ? 'amenities' : 'propertyFeatures']
                }
            }

            console.log(updateData)

            const response = await axios.put(`/api/hotels/${id}`, updateData);

            // Update redux store
            dispatch(selectProperty(response.data));

            // Optional: Show success toast
            // toast.success('Amenities updated successfully');
        } catch (error) {
            console.error('Error saving amenities:', error);
            // Optional: Show error toast
            // toast.error('Failed to save amenities');
        } finally {
            setIsSaving(false);
        }
    };

    const { title, description } = getComponentInfo();

    return (
        <div className="w-full  mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600">{description}</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder={`Search ${title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>

            {/* Amenities/Features Grid */}
            <div className="space-y-4 mb-6">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => toggleCategory(category)}
                        >
                            <h3 className="font-medium text-gray-800">{category}</h3>
                            {expandedCategories[category] ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </div>
                        {expandedCategories[category] && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 p-4 bg-white">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedItems.has(item.id)
                                                ? 'bg-green-200 border border-green-400'
                                                : 'hover:bg-gray-100 border border-transparent'
                                            }`}
                                        onClick={() => toggleItem(item.id)}
                                    >
                                        <item.icon className="w-5 h-5 mr-2 text-gray-600" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Custom Item Input */}
            <div className="mb-6">
                <div className="flex space-x-2 mb-3">
                    <input
                        type="text"
                        value={customItem}
                        onChange={(e) => setCustomItem(e.target.value)}
                        placeholder={`Add custom ${mode === 'amenities' ? 'amenity' : 'feature'}`}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        onClick={addCustomItem}
                        disabled={!customItem.trim()}
                        className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <FaPlus />
                    </button>
                </div>
                {customItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {customItems.map((item, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1">
                                <span className="text-sm mr-2">{item}</span>
                                <button
                                    onClick={() => removeCustomItem(index)}
                                    className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 hover:bg-gray-400 transition-colors"
                                >
                                    <FaTimes className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={saveItems}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    <FaSave />
                </button>
            </div>
        </div>
    );
};

Amenities.propTypes = {
    mode: PropTypes.oneOf(['amenities', 'features'])
};

export default Amenities;