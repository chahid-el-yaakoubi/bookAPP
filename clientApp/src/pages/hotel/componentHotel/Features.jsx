import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

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
  FaBriefcase, FaChevronDown, FaChevronUp, FaTimes
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

const FeatureItem = ({ feature, isRTL }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div 
      className="flex items-center p-3 my-1 rounded-lg bg-gray-50 border-l-4 border-blue hover:bg-blue/10 transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className={`${isRTL ? 'ml-2' : 'mr-2'} w-4 h-4 text-orange-500 flex-shrink-0 `} />
      <span className="text-gray-700">{feature.label}</span>
    </motion.div>
  );
};

// Full screen modal component for displaying all features
const AllFeaturesModal = ({ isOpen, onClose, categorizedFeatures }) => {
  const { t, i18n } = useTranslation(['properties']);
  const isRTL = i18n.language === 'ar';

  // Early return if not open
  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-primary to-blue p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {t('amenities.allPropertyFeatures', 'All Property Features')}
          </h2>
          <button 
            onClick={onClose}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categorizedFeatures)
              .filter(([_, features]) => features.length > 0)
              .map(([category, features]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-blue mb-3 border-b pb-2">{category}</h3>
                  <div className="space-y-2">
                    {features.map(feature => {
                      const Icon = feature.icon;
                      return (
                        <div key={feature.id} className="flex items-center py-1">
                          <Icon className={`${isRTL ? 'ml-2' : 'mr-2'} w-4 h-4 text-orange-500 flex-shrink-0 `} />
                          <span className="text-sm text-gray-700">{feature.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue text-white rounded-full hover:bg-blue transition-colors"
          >
            {t('common.close', 'Close')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategorySection = ({ title, features, isExpanded, toggleExpansion, isRTL }) => {
  const displayLimit = 5;
  const displayedFeatures = isExpanded ? features : features.slice(0, displayLimit);
  const hiddenCount = features.length - displayLimit;
  
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-3">
      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue p-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-3">
          <AnimatePresence initial={false}>
            {displayedFeatures.map(feature => (
              <FeatureItem key={feature.id} feature={feature} isRTL={isRTL} />
            ))}
          </AnimatePresence>
          
          
        </div>
      </div>
    </div>
  );
};

const PropertyFeatures = ({ propertyFeaturesData }) => {
  const { t , i18n } = useTranslation(['properties']);
  const isRTL = i18n.language === 'ar';
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showAllFeaturesModal, setShowAllFeaturesModal] = useState(false);

  // Safely get property features
  const propertyFeatures = useMemo(() => ({
    standard: Array.isArray(propertyFeaturesData?.standard) 
      ? propertyFeaturesData.standard 
      : [],
    custom: Array.isArray(propertyFeaturesData?.custom) 
      ? propertyFeaturesData.custom 
      : []
  }), [propertyFeaturesData]);

  // Group features by category with memoization
  const categorizedFeatures = useMemo(() => {
    const categories = {};

    // Categorize standard features
    Object.entries(FEATURE_CATEGORIES).forEach(([category, features]) => {
      const categoryName = t(`amenities.categories.${category}`, category);
      const categoryFeatures = features
        .filter(feature => propertyFeatures.standard.includes(feature))
        .map(feature => ({
          id: feature,
          label: t(`amenities.items.${feature}`, feature),
          icon: ICON_MAP[feature] || FaChair
        }));
        
      if (categoryFeatures.length > 0) {
        categories[categoryName] = categoryFeatures;
      }
    });

    // Add custom features
    if (propertyFeatures.custom.length > 0) {
      categories[t('amenities.categories.custom', 'Custom')] = propertyFeatures.custom.map(feature => ({
        id: feature,
        label: feature,
        icon: FaChair
      }));
    }

    return categories;
  }, [propertyFeatures, t]);

  // Toggle expansion for a specific category
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle the All Features modal
  const toggleAllFeaturesModal = () => {
    setShowAllFeaturesModal(prev => !prev);
  };

  // Count total number of features for better context
  const totalFeatures = Object.values(categorizedFeatures).reduce(
    (total, categoryFeatures) => total + categoryFeatures.length, 0
  );

  // Count total hidden features when collapsed
  const totalHiddenFeatures = Object.entries(categorizedFeatures).reduce(
    (total, [_, features]) => {
      const hiddenInCategory = features.length > 5 ? features.length - 5 : 0;
      return total + hiddenInCategory;
    }, 0
  );

  // Check if there are any features to display
  const hasFeatures = totalFeatures > 0;

  // If no features, show message
  if (!hasFeatures) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-600">
          {t('propertyFeatures.noFeaturesAvailable', 'No features available')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-lg overflow-hidden mt-10">
        <div className="p-6 text-center bg-gradient-to-b from-primary to-blue">
          <h2 className="text-2xl font-bold text-white">
            {t('amenities.propertyFeatures', 'Property Features')}
          </h2>
          <p className="text-gray-100 mt-2">
            {t('amenities.uniqueFeatures', 'Everything you need for a comfortable stay')}
          </p>
        </div>

        {/* Features Grid - Always limited height with "Show All" button */}
        <div className="flex flex-wrap p-4 max-h-[32rem] overflow-hidden relative">
          {Object.entries(categorizedFeatures)
            .filter(([_, features]) => features.length > 0)
            .map(([category, features]) => (
              <CategorySection 
                key={category} 
                title={category} 
                features={features}
                isExpanded={!!expandedCategories[category]}
                toggleExpansion={toggleCategoryExpansion}
                isRTL={isRTL}
              />
            ))
          }
          
          {/* Gradient overlay when collapsed */}
          {totalHiddenFeatures > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
          )}
        </div>

        {/* Show All Features Button */}
        <div className="flex justify-center pb-6">
          <motion.button 
            onClick={toggleAllFeaturesModal} 
            className="flex items-center px-6 py-2 bg-blue hover:bg-blue/80 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">
              {t('common.showAll', { count: totalFeatures } )}
            </span>
            <FaChevronDown />
          </motion.button>
        </div>
      </div>

      {/* Modal for displaying all features */}
      <AnimatePresence>
        {showAllFeaturesModal && (
          <AllFeaturesModal 
            isOpen={showAllFeaturesModal} 
            onClose={toggleAllFeaturesModal}
            categorizedFeatures={categorizedFeatures} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyFeatures;