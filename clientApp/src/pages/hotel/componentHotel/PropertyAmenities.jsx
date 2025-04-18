import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded icon imports
import {
    FaWifi, FaSnowflake, FaFire, FaParking, FaArrowUp, 
    FaLeaf, FaUmbrellaBeach, FaChair, FaSubway, 
    FaSwimmingPool, FaDumbbell, FaSpa, FaHotTub, 
    FaHandHoldingHeart, FaUtensils, FaCoffee, 
    FaConciergeBell, FaBroom, FaUserClock,
    FaTableTennis, FaGolfBall, FaHiking, FaSkiing, 
    FaUmbrella, FaGlassMartini, FaShoppingBasket, 
    FaBaby, FaTshirt, FaMap, FaExchangeAlt, FaMedkit,
    FaBriefcase, FaFan, FaThermometerHalf, FaHome, FaLightbulb, 
    FaVolumeMute, FaDoorOpen, FaLock, FaSuitcase, 
    FaPhone, FaClock, FaTv, FaVolumeUp, FaGamepad, 
    FaFilm, FaBook, FaLaptopHouse, FaLaptop, 
    FaNetworkWired, FaPrint, FaUsb, FaPlug, FaPen, 
    FaBlender, FaWater, FaWineGlass, FaBath, FaShower, 
    FaToilet, FaTemperatureHigh, FaWeight, FaCloudRain, 
    FaHatCowboy, FaRobot, FaMicrophone, FaKey, 
    FaProjectDiagram, FaChild, FaClipboardList, 
    FaCut, FaSoap, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { MdBalcony, MdOutlineLocalLaundryService, MdIron, MdOutlineCleaningServices, MdCurtainsClosed } from 'react-icons/md';
import { BiStore, BiFridge } from 'react-icons/bi';
import { RiMedicineBottleLine, RiBankFill } from 'react-icons/ri';
import { GiKitchenKnives, GiWashingMachine, GiMirrorMirror, GiIronMask, GiChessKing, 
         GiKnifeFork, GiSaltShaker, GiSocks, GiToaster, 
         GiTable } from 'react-icons/gi';
import { ImSpoonKnife } from 'react-icons/im';
import { IoMdBusiness } from 'react-icons/io';
import { BsPrinter } from 'react-icons/bs';
import { FcDvdLogo } from 'react-icons/fc';

const PropertyAmenities = ({ propertyAmenitiesData }) => {
    const { t, i18n } = useTranslation(['properties']);
    const isRTL = i18n.dir() === 'rtl';
    const [expandedCategories, setExpandedCategories] = useState({});

    // Expanded icon mapping for features
    const iconMap = {
        // Essentials
        'wifi': FaWifi,
        'airConditioning': FaSnowflake,
        'heating': FaFire,
        'heatingSystem': FaThermometerHalf,
        'fan': FaFan,
        'fullyEquippedKitchen': GiKitchenKnives,
        'freeParking': FaParking,
        'elevator': FaArrowUp,

        // Room Features
        'wardrobe': FaHome,
        'fullLengthMirror': GiMirrorMirror,
        'blackoutCurtains': MdCurtainsClosed,
        'readingLights': FaLightbulb,
        'soundproofing': FaVolumeMute,
        'balcony': FaDoorOpen,
        'terrace': FaUmbrellaBeach,
        'inRoomSafe': FaLock,
        'ironAndBoard': GiIronMask,
        'luggageRack': FaSuitcase,
        'telephone': FaPhone,
        'alarmClock': FaClock,

        // Entertainment
        'tv': FaTv,
        'satelliteTv': FaTv,
        'smartTv': FaTv,
        'netflix': FaTv,
        'speakers': FaVolumeUp,
        'gameConsole': FaGamepad,
        'streamingServices': FaFilm,
        'books': FaBook,
        'boardGames': GiChessKing,
        'premiumChannels': FaTv,
        'dvdPlayer': FcDvdLogo,

        // Workspace
        'desk': FaLaptopHouse,
        'laptopFriendlyDesk': FaLaptop,
        'officeChair': FaChair,
        'highSpeedWifi': FaWifi,
        'ethernetConnection': FaNetworkWired,
        'printerAccess': FaPrint,
        'usbPorts': FaUsb,
        'powerOutlets': FaPlug,
        'stationery': FaPen,

        // Kitchen & Dining
        'refrigerator': BiFridge,
        'microwave': FaUtensils,
        'electricKettle': FaCoffee,
        'toaster': GiToaster,
        'coffeeMachine': FaCoffee,
        'oven': FaFire,
        'stovetop': FaFire,
        'diningTable': GiTable,
        'kitchenware': FaUtensils,
        'dishwasher': MdOutlineCleaningServices,
        'blender': FaBlender,
        'waterPurifier': FaWater,
        'wineGlasses': FaWineGlass,
        'cuttingBoard': GiKnifeFork,
        'spices': GiSaltShaker,
        'foodProcessor': FaBlender,

        // Bathroom Facilities
        'privateBathroom': FaBath,
        'sharedBathroom': FaBath,
        'toiletBidet': FaToilet,
        'shower': FaShower,
        'bathtub': FaBath,
        'jacuzzi': FaHotTub,
        'towelsAndBathrobes': FaTshirt,
        'hairdryer': FaCut,
        'toiletries': FaSoap,
        'makeupMirror': GiMirrorMirror,
        'heatedTowelRack': FaTemperatureHigh,
        'bathroomScale': FaWeight,
        'rainShower': FaCloudRain,
        'showerCap': FaHatCowboy,
        'slippers': GiSocks,

        // Technology
        'smartHome': FaRobot,
        'voiceAssistant': FaMicrophone,
        'usbCharging': FaUsb,
        'internationalOutlets': FaPlug,
        'digitalKey': FaKey,
        'projector': FaProjectDiagram,
        'bluetoothSpeaker': FaVolumeUp,

        // Family Features
        'babyCot': FaChild,
        'highChair': FaChair,
        'childSafety': FaChild,
        'babyBath': FaBath,
        'babyMonitor': FaChild,

        // Outdoor
        'garden': FaLeaf,
        'terraceBalcony': MdBalcony,
        'bbqArea': ImSpoonKnife,
        'picnicArea': FaUmbrellaBeach,
        'patio': FaChair,
        'outdoorFurniture': FaChair,
        'beachAccess': FaUmbrella,
        'skiAccess': FaSkiing,
        'hikingTrails': FaHiking,
        'outdoorPool': FaSwimmingPool,
        'tennisCourt': FaTableTennis,
        'golfCourse': FaGolfBall,

        // Wellness
        'indoorPool': FaSwimmingPool,
        'fitnessCenter': FaDumbbell,
        'spa': FaSpa,
        'sauna': FaHotTub,
        'massage': FaHandHoldingHeart,

        // Laundry
        'washingMachine': GiWashingMachine,
        'dryer': MdOutlineLocalLaundryService,
        'ironBoard': MdIron,
        'laundryService': MdOutlineCleaningServices,

        // Business
        'conferenceRoom': IoMdBusiness,
        'printingScanning': BsPrinter,
        'businessCenter': FaBriefcase,
        'projectionScreen': FaProjectDiagram,
        'meetingRoomEquipment': FaClipboardList,

        // Services
        'dailyHousekeeping': FaBroom,
        'breakfastIncluded': FaCoffee,
        'roomService': FaConciergeBell,
        'restaurant': FaUtensils,
        'bar': FaGlassMartini,
        'groceryDelivery': FaShoppingBasket,
        'childcare': FaBaby,
        'dryCleaning': FaTshirt,
        'tourDesk': FaMap,
        'currencyExchange': FaExchangeAlt,
        'concierge': FaConciergeBell,
        'luggageStorage': FaSuitcase,
        '24hFrontDesk': FaUserClock,

        // Nearby Services
        'publicTransport': FaSubway,
        'supermarket': BiStore,
        'pharmacy': RiMedicineBottleLine,
        'atmBank': RiBankFill,
        'hospital': FaMedkit,
        'shoppingCenter': FaShoppingBasket
    };

    // All possible categories with translations
    const categoryTranslations = {
        'essentials': t('amenities.categories.essentials', 'Essentials'),
        'roomFeatures': t('amenities.categories.roomFeatures', 'Room Features'),
        'entertainment': t('amenities.categories.entertainment', 'Entertainment'),
        'workspace': t('amenities.categories.workspace', 'Workspace'),
        'kitchenAndDining': t('amenities.categories.kitchenAndDining', 'Kitchen & Dining'),
        'bathroomFacilities': t('amenities.categories.bathroomFacilities', 'Bathroom Facilities'),
        'technology': t('amenities.categories.technology', 'Technology'),
        'familyFeatures': t('amenities.categories.familyFeatures', 'Family Features'),
        'outdoor': t('amenities.categories.outdoor', 'Outdoor'),
        'wellness': t('amenities.categories.wellness', 'Wellness'),
        'laundry': t('amenities.categories.laundry', 'Laundry'),
        'business': t('amenities.categories.business', 'Business'),
        'services': t('amenities.categories.services', 'Services'),
        'nearbyServices': t('amenities.categories.nearbyServices', 'Nearby Services'),
        'other': t('amenities.categories.other', 'Other')
    };

    // Mapping of amenity IDs to their categories
    const amenityCategoryMap = {
        // Essentials
        'wifi': 'essentials',
        'airConditioning': 'essentials',
        'heating': 'essentials',
        'fullyEquippedKitchen': 'essentials',
        'freeParking': 'essentials',
        'elevator': 'essentials',

        // Room Features
        'heatingSystem': 'roomFeatures',
        'fan': 'roomFeatures',
        'wardrobe': 'roomFeatures',
        'fullLengthMirror': 'roomFeatures',
        'blackoutCurtains': 'roomFeatures',
        'readingLights': 'roomFeatures',
        'soundproofing': 'roomFeatures',
        'balcony': 'roomFeatures',
        'terrace': 'roomFeatures',
        'inRoomSafe': 'roomFeatures',
        'ironAndBoard': 'roomFeatures',
        'luggageRack': 'roomFeatures',
        'telephone': 'roomFeatures',
        'alarmClock': 'roomFeatures',

        // Entertainment
        'tv': 'entertainment',
        'satelliteTv': 'entertainment',
        'smartTv': 'entertainment',
        'netflix': 'entertainment',
        'speakers': 'entertainment',
        'gameConsole': 'entertainment',
        'streamingServices': 'entertainment',
        'books': 'entertainment',
        'boardGames': 'entertainment',
        'premiumChannels': 'entertainment',
        'dvdPlayer': 'entertainment',

        // Workspace
        'desk': 'workspace',
        'laptopFriendlyDesk': 'workspace',
        'officeChair': 'workspace',
        'highSpeedWifi': 'workspace',
        'ethernetConnection': 'workspace',
        'printerAccess': 'workspace',
        'usbPorts': 'workspace',
        'powerOutlets': 'workspace',
        'stationery': 'workspace',

        // Kitchen & Dining
        'refrigerator': 'kitchenAndDining',
        'microwave': 'kitchenAndDining',
        'electricKettle': 'kitchenAndDining',
        'toaster': 'kitchenAndDining',
        'coffeeMachine': 'kitchenAndDining',
        'oven': 'kitchenAndDining',
        'stovetop': 'kitchenAndDining',
        'diningTable': 'kitchenAndDining',
        'kitchenware': 'kitchenAndDining',
        'dishwasher': 'kitchenAndDining',
        'blender': 'kitchenAndDining',
        'waterPurifier': 'kitchenAndDining',
        'wineGlasses': 'kitchenAndDining',
        'cuttingBoard': 'kitchenAndDining',
        'spices': 'kitchenAndDining',
        'foodProcessor': 'kitchenAndDining',

        // Bathroom Facilities
        'privateBathroom': 'bathroomFacilities',
        'sharedBathroom': 'bathroomFacilities',
        'toiletBidet': 'bathroomFacilities',
        'shower': 'bathroomFacilities',
        'bathtub': 'bathroomFacilities',
        'jacuzzi': 'bathroomFacilities',
        'towelsAndBathrobes': 'bathroomFacilities',
        'hairdryer': 'bathroomFacilities',
        'toiletries': 'bathroomFacilities',
        'makeupMirror': 'bathroomFacilities',
        'heatedTowelRack': 'bathroomFacilities',
        'bathroomScale': 'bathroomFacilities',
        'rainShower': 'bathroomFacilities',
        'showerCap': 'bathroomFacilities',
        'slippers': 'bathroomFacilities',

        // Technology
        'smartHome': 'technology',
        'voiceAssistant': 'technology',
        'usbCharging': 'technology',
        'internationalOutlets': 'technology',
        'digitalKey': 'technology',
        'projector': 'technology',
        'bluetoothSpeaker': 'technology',

        // Family Features
        'babyCot': 'familyFeatures',
        'highChair': 'familyFeatures',
        'childSafety': 'familyFeatures',
        'babyBath': 'familyFeatures',
        'babyMonitor': 'familyFeatures',

        // Outdoor
        'garden': 'outdoor',
        'terraceBalcony': 'outdoor',
        'bbqArea': 'outdoor',
        'picnicArea': 'outdoor',
        'patio': 'outdoor',
        'outdoorFurniture': 'outdoor',
        'beachAccess': 'outdoor',
        'skiAccess': 'outdoor',
        'hikingTrails': 'outdoor',
        'outdoorPool': 'outdoor',
        'tennisCourt': 'outdoor',
        'golfCourse': 'outdoor',

        // Wellness
        'indoorPool': 'wellness',
        'fitnessCenter': 'wellness',
        'spa': 'wellness',
        'sauna': 'wellness',
        'massage': 'wellness',

        // Laundry
        'washingMachine': 'laundry',
        'dryer': 'laundry',
        'ironBoard': 'laundry',
        'laundryService': 'laundry',

        // Business
        'conferenceRoom': 'business',
        'printingScanning': 'business',
        'businessCenter': 'business',
        'projectionScreen': 'business',
        'meetingRoomEquipment': 'business',

        // Services
        'dailyHousekeeping': 'services',
        'breakfastIncluded': 'services',
        'roomService': 'services',
        'restaurant': 'services',
        'bar': 'services',
        'groceryDelivery': 'services',
        'childcare': 'services',
        'dryCleaning': 'services',
        'tourDesk': 'services',
        'currencyExchange': 'services',
        'concierge': 'services',
        'luggageStorage': 'services',
        '24hFrontDesk': 'services',

        // Nearby Services
        'publicTransport': 'nearbyServices',
        'supermarket': 'nearbyServices',
        'pharmacy': 'nearbyServices',
        'atmBank': 'nearbyServices',
        'hospital': 'nearbyServices',
        'shoppingCenter': 'nearbyServices'
    };

    // Process amenities data to group by category
    const processAmenities = () => {
        // Normalize input data structure
        let amenitiesList = [];
        
        // Handle different data formats
        if (Array.isArray(propertyAmenitiesData)) {
            amenitiesList = propertyAmenitiesData;
        } else if (propertyAmenitiesData && typeof propertyAmenitiesData === 'object') {
            amenitiesList = [
                ...(propertyAmenitiesData.standard || []),
                ...(propertyAmenitiesData.custom || [])
            ];
        }
        
        // Create categorized amenities object
        const categorizedByKey = {};
        
        // Process each amenity
        amenitiesList.forEach(amenityId => {
            // Get category for this amenity or default to 'other'
            const categoryKey = amenityCategoryMap[amenityId] || 'other';
            
            // Initialize category array if needed
            if (!categorizedByKey[categoryKey]) {
                categorizedByKey[categoryKey] = [];
            }
            
            // Add amenity to its category
            categorizedByKey[categoryKey].push({
                id: amenityId,
                label: t(`amenities.items.${amenityId}`, amenityId), // Use translation or fallback to ID
                icon: iconMap[amenityId] || FaChair // Use mapped icon or default
            });
        });
        
        // Convert to format with translated category names
        const categorized = {};
        Object.entries(categorizedByKey).forEach(([categoryKey, amenities]) => {
            const translatedCategory = categoryTranslations[categoryKey] || categoryKey;
            categorized[translatedCategory] = amenities;
        });
        
        return categorized;
    };

    const categorizedAmenities = processAmenities();

    // Toggle category expansion
    const toggleCategoryExpansion = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const renderAmenitiesWithLimit = (amenities, category, limit = 3) => {
        const isExpanded = expandedCategories[category];
        const displayedAmenities = isExpanded ? amenities : amenities.slice(0, limit);
        const hiddenCount = amenities.length - limit;

        return (
            <div className="space-y-2">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div 
                        key={isExpanded ? "expanded" : "collapsed"}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                        initial={{ opacity: 0, height: isExpanded ? "auto" : "auto" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {displayedAmenities.map(amenity => (
                            <motion.div
                                key={amenity.id}
                                className="flex items-center p-3 bg-gray-50 rounded-xl 
                                    hover:bg-gray-100 transition-all duration-300 
                                    border border-gray-200 space-x-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <amenity.icon 
                                    className="w-5 h-5 text-gray-700 flex-shrink-0" 
                                />
                                <span className="text-xs md:text-sm text-gray-800 truncate">
                                    {amenity.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {amenities.length > limit && (
                    <motion.button 
                        onClick={() => toggleCategoryExpansion(category)}
                        className="w-full mt-3 py-2 text-sm font-medium text-primary-600 
                            hover:bg-primary-50 rounded-lg transition-colors 
                            flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? (
                            <>
                                <span>{t('amenities.showLess', 'Show Less')}</span>
                                <FaChevronUp className="w-3 h-3" />
                            </>
                        ) : (
                            <>
                                <span>{t('amenities.showMore', `Show More (${hiddenCount} more)`)}</span>
                                <FaChevronDown className="w-3 h-3" />
                            </>
                        )}
                    </motion.button>
                )}
            </div>
        );
    };

    // No amenities state
    if (!Object.values(categorizedAmenities).some(categoryAmenities => categoryAmenities.length > 0)) {
        return (
            <motion.div 
                className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p className="text-gray-500">
                    {t('propertyAmenities.noAmenitiesAvailable', 'No amenities available')}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="w-full mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('amenities.propertyAmenities')}
                </h2>
                <p className="text-sm text-gray-600 max-w-xl mx-auto">
                {t('amenities.uniqueFeatures')}
                </p>
            </div>

            <div className="space-y-5">
                {Object.entries(categorizedAmenities)
                    .filter(([_, amenities]) => amenities.length > 0)
                    .map(([category, amenities]) => (
                        <motion.div 
                            key={category} 
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {category}
                                </h3>
                            </div>
                            <div className="p-4">
                                {renderAmenitiesWithLimit(amenities, category)}
                            </div>
                        </motion.div>
                    ))
                }
            </div>
        </motion.div>
    );
};

export default PropertyAmenities;