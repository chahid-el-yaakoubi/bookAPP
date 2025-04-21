import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Consolidated icon imports
import {
  FaWifi, FaSnowflake, FaFire, FaParking, FaArrowUp, 
  FaLeaf, FaUmbrellaBeach, FaChair, FaSubway, 
  FaSwimmingPool, FaDumbbell, FaSpa, FaHotTub, 
  FaHandHoldingHeart, FaUtensils, FaCoffee, 
  FaConciergeBell, FaBroom, FaSuitcase, FaUserClock,
  FaTableTennis, FaGolfBall, FaHiking, FaSkiing, 
  FaUmbrella, FaGlassMartini, FaShoppingBasket, 
  FaBaby, FaTshirt, FaMap, FaExchangeAlt, FaMedkit,
  FaBriefcase, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { MdBalcony, MdOutlineLocalLaundryService, MdIron, MdOutlineCleaningServices } from 'react-icons/md';
import { BiStore } from 'react-icons/bi';
import { RiMedicineBottleLine, RiBankFill } from 'react-icons/ri';
import { GiKitchenKnives, GiWashingMachine } from 'react-icons/gi';
import { ImSpoonKnife } from 'react-icons/im';
import { IoMdBusiness } from 'react-icons/io';
import { BsPrinter } from 'react-icons/bs';

// Feature to icon mapping
const ICON_MAP = {
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

// Feature categories organization
const FEATURE_CATEGORIES = {
  essentials: ['wifi', 'airConditioning', 'heating', 'fullyEquippedKitchen', 'freeParking', 'elevator'],
  outdoor: ['garden', 'terraceBalcony', 'bbqArea', 'picnicArea', 'patio', 'outdoorFurniture', 'beachAccess', 'skiAccess', 'hikingTrails', 'outdoorPool', 'tennisCourt', 'golfCourse'],
  wellness: ['indoorPool', 'fitnessCenter', 'spa', 'sauna', 'massage'],
  laundry: ['washingMachine', 'dryer', 'ironBoard', 'laundryService'],
  business: ['conferenceRoom', 'printingScanning', 'businessCenter'],
  services: ['dailyHousekeeping', 'breakfastIncluded', 'roomService', 'restaurant', 'bar', 'groceryDelivery', 'childcare', 'dryCleaning', 'tourDesk', 'currencyExchange', 'concierge', 'luggageStorage', '24hFrontDesk'],
  nearbyServices: ['publicTransport', 'supermarket', 'pharmacy', 'atmBank', 'hospital', 'shoppingCenter']
};

const FeatureItem = ({ feature }) => {
  const Icon = feature.icon;
  
  return (
    <div className="flex items-center p-3 my-1 rounded-lg bg-gray-50 border-l-4 border-blue hover:bg-blue/10 transition-all duration-200">
      <Icon className="w-5 h-5 text-blue mr-3 flex-shrink-0" />
      <span className="text-gray-700">{feature.label}</span>
    </div>
  );
};

const CategorySection = ({ title, features }) => {
  if (features.length === 0) return null;
  
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-3">
      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue to-blue p-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-3">
          {features.map(feature => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PropertyFeatures = ({ propertyFeaturesdata }) => {
  const { t } = useTranslation(['properties']);
  const [expanded, setExpanded] = useState(false);

  // Safely get property features
  const propertyFeatures = useMemo(() => ({
    standard: Array.isArray(propertyFeaturesdata?.standard) 
      ? propertyFeaturesdata.standard 
      : [],
    custom: Array.isArray(propertyFeaturesdata?.custom) 
      ? propertyFeaturesdata.custom 
      : []
  }), [propertyFeaturesdata]);

  // Group features by category with memoization
  const categorizedFeatures = useMemo(() => {
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
    Object.entries(FEATURE_CATEGORIES).forEach(([category, features]) => {
      const categoryName = t(`amenities.categories.${category}`);
      categories[categoryName] = features
        .filter(feature => propertyFeatures.standard.includes(feature))
        .map(feature => ({
          id: feature,
          label: t(`amenities.items.${feature}`, feature),
          icon: ICON_MAP[feature] || FaChair
        }));
    });

    // Add custom features
    if (propertyFeatures.custom.length > 0) {
      categories[t('amenities.categories.custom')] = propertyFeatures.custom.map(feature => ({
        id: feature,
        label: feature,
        icon: FaChair
      }));
    }

    return categories;
  }, [propertyFeatures, t]);

  // Check if there are any features to display
  const hasFeatures = Object.values(categorizedFeatures).some(
    categoryFeatures => categoryFeatures.length > 0
  );

  // If no features, show message
  if (!hasFeatures) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-600">
          {t('propertyFeatures.noFeaturesAvailable', 'No amenities available')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 text-center bg-gradient-to-r from-blue to-blue">
        <h2 className="text-2xl font-bold text-white">
          {t('amenities.propertyFeatures')}
        </h2>
        <p className="text-blue mt-2">
          {t('amenities.amenitiesSubtitle')}
        </p>
      </div>

      <div className={`flex flex-wrap p-4 ${!expanded ? 'max-h-96 overflow-hidden' : ''}`}>
        {Object.entries(categorizedFeatures)
          .filter(([_, features]) => features.length > 0)
          .map(([category, features]) => (
            <CategorySection 
              key={category} 
              title={category} 
              features={features} 
            />
          ))
        }
      </div>

      {/* Expand/collapse button with improved styling */}
      <div className="flex justify-center pb-6">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="flex items-center px-6 py-2 bg-blue hover:bg-blue/60 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span className="mr-2">
            {expanded ? t('common.showLess', 'Show Less') : t('common.showMore', 'Show More')}
          </span>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
    </div>
  );
};

export default PropertyFeatures;