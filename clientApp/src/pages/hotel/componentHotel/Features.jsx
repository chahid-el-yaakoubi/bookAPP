import React from 'react';
import { useTranslation } from 'react-i18next';

// Expanded icon imports
import {
    FaWifi, FaSnowflake, FaFire, FaParking, FaArrowUp, 
    FaLeaf, FaUmbrellaBeach, FaChair, FaSubway, 
    FaSwimmingPool, FaDumbbell, FaSpa, FaHotTub, 
    FaHandHoldingHeart, FaUtensils, FaCoffee, 
    FaConciergeBell, FaBroom, FaSuitcase, FaUserClock,
    FaTableTennis, FaGolfBall, FaHiking, FaSkiing, 
    FaUmbrella, FaGlassMartini, FaShoppingBasket, 
    FaBaby, FaTshirt, FaMap, FaExchangeAlt, FaMedkit,
    FaBriefcase
} from 'react-icons/fa';
import { MdBalcony, MdOutlineLocalLaundryService, MdIron, MdOutlineCleaningServices } from 'react-icons/md';
import { BiStore } from 'react-icons/bi';
import { RiMedicineBottleLine, RiBankFill } from 'react-icons/ri';
import { GiKitchenKnives, GiWashingMachine } from 'react-icons/gi';
import { ImSpoonKnife } from 'react-icons/im';
import { IoMdBusiness } from 'react-icons/io';
import { BsPrinter } from 'react-icons/bs';

const PropertyFeatures = ({ propertyFeaturesdata }) => {
    const { t, i18n } = useTranslation(['properties']);
    const isRTL = i18n.dir() === 'rtl';

    // Expanded icon mapping for features
    const iconMap = {
        // Essentials
        'wifi': FaWifi,
        'airConditioning': FaSnowflake,
        'heating': FaFire,
        'fullyEquippedKitchen': GiKitchenKnives,
        'freeParking': FaParking,
        'elevator': FaArrowUp,

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

    // Expanded predefined feature categories
    const featureCategories = {
        essentials: ['wifi', 'airConditioning', 'heating', 'fullyEquippedKitchen', 'freeParking', 'elevator'],
        outdoor: ['garden', 'terraceBalcony', 'bbqArea', 'picnicArea', 'patio', 'outdoorFurniture', 'beachAccess', 'skiAccess', 'hikingTrails', 'outdoorPool', 'tennisCourt', 'golfCourse'],
        wellness: ['indoorPool', 'fitnessCenter', 'spa', 'sauna', 'massage'],
        laundry: ['washingMachine', 'dryer', 'ironBoard', 'laundryService'],
        business: ['conferenceRoom', 'printingScanning', 'businessCenter'],
        services: ['dailyHousekeeping', 'breakfastIncluded', 'roomService', 'restaurant', 'bar', 'groceryDelivery', 'childcare', 'dryCleaning', 'tourDesk', 'currencyExchange', 'concierge', 'luggageStorage', '24hFrontDesk'],
        nearbyServices: ['publicTransport', 'supermarket', 'pharmacy', 'atmBank', 'hospital', 'shoppingCenter']
    };

    // Safely get property features
    const propertyFeatures = {
        standard: Array.isArray(propertyFeaturesdata?.standard) 
            ? propertyFeaturesdata.standard 
            : [],
        custom: Array.isArray(propertyFeaturesdata?.custom) 
            ? propertyFeaturesdata.custom 
            : []
    };

    // Group features by category
    const categorizeFeatures = () => {
        const categories = {
            [t('amenities.categories.essentials')]: [],
            [t('amenities.categories.outdoor')]: [],
            [t('amenities.categories.wellness')]: [],
            [t('amenities.categories.laundry')]: [],
            [t('amenities.categories.business')]: [],
            [t('amenities.categories.services')]: [],
            [t('amenities.categories.nearbyServices')]: []
        };

        // Categorize standard features
        Object.entries(featureCategories).forEach(([category, features]) => {
            const categoryName = t(`amenities.categories.${category}`);
            categories[categoryName] = features
                .filter(feature => propertyFeatures.standard.includes(feature))
                .map(feature => ({
                    id: feature,
                    label: t(`amenities.items.${feature}`, feature), // Fallback to feature key if translation missing
                    icon: iconMap[feature] || FaChair // Fallback to default icon
                }));
        });

        // Add custom features to a custom category
        if (propertyFeatures.custom.length > 0) {
            categories[t('amenities.categories.custom')] = propertyFeatures.custom.map(feature => ({
                id: feature,
                label: feature,
                icon: FaChair  // Default icon for custom features
            }));
        }

        return categories;
    };

    const categorizedFeatures = categorizeFeatures();

    // Check if there are any features to display
    const hasFeatures = Object.values(categorizedFeatures)
        .some(categoryFeatures => categoryFeatures.length > 0);

    // If no features, return null or a message
    if (!hasFeatures) {
        return (
            <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                <p className="text-gray-600">
                    {t('propertyFeatures.noFeaturesAvailable', 'No amenities available')}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {t('amenities.propertyFeatures')}
                </h2>
                <p className="text-gray-600">
                    {t('amenities.amenitiesSubtitle')}
                </p>
            </div>

            <div className="space-y-4">
                {Object.entries(categorizedFeatures)
                    .filter(([_, features]) => features.length > 0)
                    .map(([category, features]) => (
                        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-50">
                                <h3 className="font-medium text-gray-800">{category}</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 p-4 bg-white">
                                {features.map(feature => (
                                    <div
                                        key={feature.id}
                                        className="flex items-center p-3 rounded-lg bg-gray-100 border border-gray-200"
                                    >
                                        <feature.icon 
                                            className={`w-5 h-5 text-gray-600 ${isRTL ? 'ml-2' : 'mr-2'}`} 
                                        />
                                        <span className="text-sm">{feature.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default PropertyFeatures;