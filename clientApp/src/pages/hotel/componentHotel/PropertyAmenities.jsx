import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// Consolidated icon imports from both components
import {
    FaWifi, FaSnowflake, FaFire, FaParking, FaArrowUp, 
    FaLeaf, FaUmbrellaBeach, FaChair, FaSubway, 
    FaSwimmingPool, FaDumbbell, FaSpa, FaHotTub, 
    FaHandHoldingHeart, FaUtensils, FaCoffee, 
    FaConciergeBell, FaBroom, FaSuitcase, FaUserClock,
    FaTableTennis, FaGolfBall, FaHiking, FaSkiing, 
    FaUmbrella, FaGlassMartini, FaShoppingBasket, 
    FaBaby, FaTshirt, FaMap, FaExchangeAlt, FaMedkit,
    FaBriefcase, FaFan, FaThermometerHalf, FaHome, FaLightbulb, 
    FaVolumeMute, FaDoorOpen, FaLock, 
    FaPhone, FaClock, FaTv, FaVolumeUp, FaGamepad, 
    FaFilm, FaBook, FaLaptopHouse, FaLaptop, 
    FaNetworkWired, FaPrint, FaUsb, FaPlug, FaPen, 
    FaBlender, FaWater, FaWineGlass, FaBath, FaShower, 
    FaToilet, FaTemperatureHigh, FaWeight, FaCloudRain, 
    FaHatCowboy, FaRobot, FaMicrophone, FaKey, 
    FaProjectDiagram, FaChild, FaClipboardList, 
    FaCut, FaSoap, FaChevronDown, FaChevronUp, FaTimes
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

// Feature to icon mapping
const ICON_MAP = {
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

// Feature categories organization
const AMENITY_CATEGORIES = {
    essentials: ['wifi', 'airConditioning', 'heating', 'heatingSystem', 'fan', 'fullyEquippedKitchen', 'freeParking', 'elevator'],
    roomFeatures: ['wardrobe', 'fullLengthMirror', 'blackoutCurtains', 'readingLights', 'soundproofing', 'balcony', 'terrace', 'inRoomSafe', 'ironAndBoard', 'luggageRack', 'telephone', 'alarmClock'],
    entertainment: ['tv', 'satelliteTv', 'smartTv', 'netflix', 'speakers', 'gameConsole', 'streamingServices', 'books', 'boardGames', 'premiumChannels'],
    workspace: ['desk', 'laptopFriendlyDesk', 'officeChair', 'highSpeedWifi', 'ethernetConnection', 'printerAccess', 'usbPorts', 'powerOutlets', 'stationery'],
    kitchenAndDining: ['refrigerator', 'microwave', 'electricKettle', 'toaster', 'coffeeMachine', 'oven', 'stovetop', 'diningTable', 'kitchenware', 'dishwasher', 'blender', 'waterPurifier', 'wineGlasses', 'cuttingBoard', 'spices', 'foodProcessor'],
    bathroomFacilities: ['privateBathroom', 'sharedBathroom', 'toiletBidet', 'shower', 'bathtub', 'jacuzzi', 'towelsAndBathrobes', 'hairdryer', 'toiletries', 'makeupMirror', 'heatedTowelRack', 'bathroomScale', 'rainShower', 'showerCap', 'slippers'],
    technology: ['smartHome', 'voiceAssistant', 'usbCharging', 'internationalOutlets', 'digitalKey', 'projector', 'bluetoothSpeaker'],
    familyFeatures: ['babyCot', 'highChair', 'childSafety', 'babyBath', 'babyMonitor'],
    outdoor: ['garden', 'terraceBalcony', 'bbqArea', 'picnicArea', 'patio', 'outdoorFurniture', 'beachAccess', 'skiAccess', 'hikingTrails', 'outdoorPool', 'tennisCourt', 'golfCourse'],
    wellness: ['indoorPool', 'fitnessCenter', 'spa', 'sauna', 'massage'],
    laundry: ['washingMachine', 'dryer', 'ironBoard', 'laundryService'],
    business: ['conferenceRoom', 'printingScanning', 'businessCenter', 'projectionScreen', 'meetingRoomEquipment'],
    services: ['dailyHousekeeping', 'breakfastIncluded', 'roomService', 'restaurant', 'bar', 'groceryDelivery', 'childcare', 'dryCleaning', 'tourDesk', 'currencyExchange', 'concierge', 'luggageStorage', '24hFrontDesk'],
    nearbyServices: ['publicTransport', 'supermarket', 'pharmacy', 'atmBank', 'hospital', 'shoppingCenter']
};

const AmenityItem = ({ amenity, isRTL }) => {
  const Icon = amenity.icon;
  
  return (
    <motion.div 
      className="flex items-center p-3 my-1 rounded-lg bg-gray-50 border-l-4 border-blue hover:bg-blue/10 transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className={`${isRTL ? 'ml-2' : 'mr-2'} w-4 h-4 text-primary flex-shrink-0 `} />
      <span className="text-gray-700">{amenity.label}</span>
    </motion.div>
  );
};

// Full screen modal component for displaying all amenities
const AllAmenitiesModal = ({ isOpen, onClose, categorizedAmenities }) => {
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
            {t('amenities.allPropertyAmenities', 'All Property Amenities')}
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
            {Object.entries(categorizedAmenities)
              .filter(([_, amenities]) => amenities.length > 0)
              .map(([category, amenities]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-blue mb-3 border-b pb-2">{category}</h3>
                  <div className="space-y-2">
                    {amenities.map(amenity => {
                      const Icon = amenity.icon;
                      return (
                        <div key={amenity.id} className="flex items-center py-1">
                          <Icon className={`${isRTL ? 'ml-2' : 'mr-2'} w-4 h-4 text-primary flex-shrink-0 `} />
                          <span className="text-sm text-gray-700">{amenity.label}</span>
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

const CategorySection = ({ title, amenities, isExpanded, toggleExpansion, isRTL }) => {
  const displayLimit = 5;
  const displayedAmenities = isExpanded ? amenities : amenities.slice(0, displayLimit);
  const hiddenCount = amenities.length - displayLimit;
  
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-3">
      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue p-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-3">
          <AnimatePresence initial={false}>
            {displayedAmenities.map(amenity => (
              <AmenityItem key={amenity.id} amenity={amenity} isRTL={isRTL} />
            ))}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
};

const PropertyAmenities = ({ propertyAmenitiesData }) => {
  const { t, i18n } = useTranslation(['properties']);
  const isRTL = i18n.language === 'ar';
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showAllAmenitiesModal, setShowAllAmenitiesModal] = useState(false);

  // Process amenities data to group by category
  const categorizedAmenities = useMemo(() => {
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
    const categorized = {};
    
    // Group amenities by their categories
    Object.entries(AMENITY_CATEGORIES).forEach(([categoryKey, amenityIds]) => {
      const categoryAmenities = amenityIds
        .filter(id => amenitiesList.includes(id))
        .map(id => ({
          id,
          label: t(`amenities.items.${id}`, id),
          icon: ICON_MAP[id] || FaChair
        }));
      
      if (categoryAmenities.length > 0) {
        const categoryName = t(`amenities.categories.${categoryKey}`, categoryKey);
        categorized[categoryName] = categoryAmenities;
      }
    });
    
    // Handle custom amenities not in predefined categories
    const customAmenities = amenitiesList
      .filter(id => !Object.values(AMENITY_CATEGORIES).flat().includes(id))
      .map(id => ({
        id,
        label: t(`amenities.items.${id}`, id),
        icon: ICON_MAP[id] || FaChair
      }));
    
    if (customAmenities.length > 0) {
      categorized[t('amenities.categories.other', 'Other')] = customAmenities;
    }
    
    return categorized;
  }, [propertyAmenitiesData, t]);

  // Toggle expansion for a specific category
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle the All Amenities modal
  const toggleAllAmenitiesModal = () => {
    setShowAllAmenitiesModal(prev => {
        const isOpen = !prev;
        // Add or remove the 'overflow-hidden' class to the body
        document.body.classList.toggle('overflow-hidden', isOpen);
        return isOpen;
    });
  };

  // Count total number of amenities for better context
  const totalAmenities = Object.values(categorizedAmenities).reduce(
    (total, categoryAmenities) => total + categoryAmenities.length, 0
  );

  // Count total hidden amenities when collapsed
  const totalHiddenAmenities = Object.entries(categorizedAmenities).reduce(
    (total, [_, amenities]) => {
      const hiddenInCategory = amenities.length > 5 ? amenities.length - 5 : 0;
      return total + hiddenInCategory;
    }, 0
  );

  // Check if there are any amenities to display
  const hasAmenities = totalAmenities > 0;

  // If no amenities, show message
  if (!hasAmenities) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-600">
          {t('propertyAmenities.noAmenitiesAvailable', 'No amenities available')}
        </p>
      </div>
    );
  }

  // Cleanup: Remove the class when the component unmounts
  useEffect(() => {
    return () => {
        document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-lg overflow-hidden mt-10">
        <div className="p-6 text-center bg-gradient-to-b from-primary to-blue">
          <h2 className="text-2xl font-bold text-white">
            {t('amenities.propertyAmenities', 'Property Amenities')}
          </h2>
          <p className="text-gray-100 font-semibold mt-2">
            {t('amenities.amenitiesSubtitle', 'Everything you need for a comfortable stay')}
          </p>
        </div>

        {/* Amenities Grid - Always limited height with "Show All" button */}
        <div className="flex flex-wrap p-4 max-h-[32rem] overflow-hidden relative">
          {Object.entries(categorizedAmenities)
            .filter(([_, amenities]) => amenities.length > 0)
            .map(([category, amenities]) => (
              <CategorySection 
                key={category} 
                title={category} 
                amenities={amenities}
                isExpanded={!!expandedCategories[category]}
                toggleExpansion={toggleCategoryExpansion}
                isRTL={isRTL}
              />
            ))
          }
          
          {/* Gradient overlay when collapsed */}
          {totalHiddenAmenities > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
          )}
        </div>

        {/* Show All Amenities Button */}
        <div className="flex justify-center pb-6">
          <motion.button 
            onClick={toggleAllAmenitiesModal} 
            className="flex items-center px-6 py-2 bg-blue hover:bg-blue/80 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">
              {t('common.showAll', { count: totalAmenities }  )}
            </span>
            <FaChevronDown />
          </motion.button>
        </div>
      </div>

      {/* Modal for displaying all amenities */}
      <AnimatePresence>
        {showAllAmenitiesModal && (
          <AllAmenitiesModal 
            isOpen={showAllAmenitiesModal} 
            onClose={toggleAllAmenitiesModal}
            categorizedAmenities={categorizedAmenities} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyAmenities;