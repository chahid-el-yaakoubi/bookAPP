import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaTimes, FaPaw, FaParking, FaUtensils, FaWifi, FaHouseUser,
  FaBuilding, FaHotel, FaBolt, FaSearch, FaTrophy, FaStar,
  FaHotTub, FaHome, FaTv, FaSnowflake, FaFire, FaBriefcase,
  FaSwimmingPool, FaCoffee, FaUmbrellaBeach, FaWheelchair,
  FaWater, FaShower, FaLock, FaLockOpen,
  FaTshirt, FaTree, FaChair, FaDoorClosed, FaMountain,
  FaCamera
} from 'react-icons/fa';
import { MdElevator } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import {
  toggleAmenity,
  toggleBookingOption,
  toggleExceptionalProperty,
  togglePropertyType,
  toggleSafetyFeature,
  clearFilters,
  setPriceRange,
  setSortByPrice
} from '../redux/filtersSlice';
import { applyFilters } from '../redux/hotelsSlice';

export const FilterModule = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.filters) || {
    priceRange: { min: 200, max: 5000 },
    amenities: {},
    safety_features: {},
    bookingOptions: {},
    exceptionalProperties: {},
    propertyTypes: {},
    sortByPrice: 'default'
  };

  const { filteredHotels = [] } = useSelector((state) => state.hotels || {});

  useEffect(() => {
    dispatch(applyFilters(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    // Disable scrolling on the body when the modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable scrolling when the modal is closed
      document.body.style.overflow = 'unset';
    };
  }, []);

  const priceSortOptions = [
    { id: 'default', label: t('FilterModule.filters.recommended'), },
    { id: 'low-to-high', label: t('FilterModule.filters.priceLowToHigh'), },
    { id: 'high-to-low', label: t('FilterModule.filters.priceHighToLow'), }
  ];

  const handleToggle = (toggleAction, itemId) => {
    dispatch(toggleAction(itemId));
  };

  const handlePriceSortChange = (sortOption) => {
    dispatch(setSortByPrice(sortOption));
  };

  const handleAmenityToggle = (id) => handleToggle(toggleAmenity, id);
  const handleSafetyFeatureToggle = (id) => handleToggle(toggleSafetyFeature, id);
  const handlePropertyTypeToggle = (id) => handleToggle(togglePropertyType, id);

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleApplyFilters = () => {
    dispatch(applyFilters(filters));
    onClose();
  };

  let priceRangeDebounceTimer;
  const handlePriceRangeChange = (type, value) => {
    clearTimeout(priceRangeDebounceTimer);

    const newValue = parseInt(value);
    let newPriceRange;

    if (type === 'min') {
      newPriceRange = {
        min: newValue,
        max: Math.max(filters.priceRange?.max || 5000, newValue)
      };
    } else {
      newPriceRange = {
        min: Math.min(filters.priceRange?.min || 0, newValue),
        max: newValue
      };
    }

    dispatch(setPriceRange(newPriceRange));

    priceRangeDebounceTimer = setTimeout(() => {
      dispatch(applyFilters({
        ...filters,
        priceRange: newPriceRange
      }));
    }, 300);
  };

  const propertyTypes = [
    { id: 'hotel', label: t('FilterModule.propertyTypes.hotel'), icon: <FaHotel /> },
    { id: 'apartment', label: t('FilterModule.propertyTypes.apartment'), icon: <FaBuilding /> },
    { id: 'villa', label: t('FilterModule.propertyTypes.villa'), icon: <FaHome /> },
    { id: 'house', label: t('FilterModule.propertyTypes.house'), icon: <FaHome /> },
    { id: 'guesthouse', label: t('FilterModule.propertyTypes.guesthouse'), icon: <FaHouseUser /> },
  ];

  const amenityCategories = [
    {
      title: t('FilterModule.amenities.popular'),
      items: [
        { id: 'wifi', label: t('FilterModule.amenities.wifi'), icon: <FaWifi /> },
        { id: 'tv', label: t('FilterModule.amenities.tv'), icon: <FaTv /> },
        { id: 'airConditioning', label: t('FilterModule.amenities.ac'), icon: <FaSnowflake /> },
        { id: 'heating', label: t('FilterModule.amenities.heating'), icon: <FaFire /> },
        { id: 'hotWater', label: t('FilterModule.amenities.hotWater'), icon: <FaShower /> },
        { id: 'freeParking', label: t('FilterModule.amenities.parking'), icon: <FaParking /> },
      ]
    },
    {
      title: t('FilterModule.amenities.essentials'),
      items: [
        { id: 'fullyEquippedKitchen', label: t('FilterModule.amenities.kitchen'), icon: <FaUtensils /> },
        { id: 'washingMachine', label: t('FilterModule.amenities.washer'), icon: <FaTshirt /> },
        { id: 'workspace', label: t('FilterModule.amenities.workspace'), icon: <FaBriefcase /> },
        { id: 'elevator', label: t('FilterModule.amenities.elevator'), icon: <MdElevator /> },
      ]
    },
    {
      title: t('FilterModule.amenities.features'),
      items: [
        { id: 'garden', label: t('FilterModule.amenities.garden'), icon: <FaTree /> },
        { id: 'indoorPool', label: t('FilterModule.amenities.pool'), icon: <FaSwimmingPool /> },
        { id: 'terraceBalcony', label: t('FilterModule.amenities.terrace'), icon: <FaChair /> },
        { id: 'jacuzzi', label: t('FilterModule.amenities.jacuzzi'), icon: <FaHotTub /> },
        { id: 'bbqArea', label: t('FilterModule.amenities.bbq'), icon: <FaFire /> },
        { id: 'breakfastIncluded', label: t('FilterModule.amenities.breakfast'), icon: <FaCoffee /> },
      ]
    },
    {
      title: t('FilterModule.amenities.security'),
      items: [
        { id: 'smoke_detector', label: t('FilterModule.amenities.smokeDetector'), icon: <FaLockOpen /> },
        { id: 'carbon_monoxide_detector', label: t('FilterModule.amenities.carbonDetector'), icon: <FaLock /> },
        { id: 'security_guard', label: t('FilterModule.amenities.security24'), icon: <FaLock /> },
        { id: 'security_camera', label: t('FilterModule.amenities.camera'), icon: <FaCamera /> },
      ]
    }, 
  ];

  const hasActiveFilters = () => {
    const propertyTypesActive = filters.propertyTypes && Object.values(filters.propertyTypes).some(value => value);
    const amenitiesActive = filters.amenities && Object.values(filters.amenities).some(value => value);
    const safetyFeaturesActive = filters.safety_features && Object.values(filters.safety_features).some(value => value);
    const bookingOptionsActive = filters.bookingOptions && Object.values(filters.bookingOptions).some(value => value);
    const exceptionalPropertiesActive = filters.exceptionalProperties && Object.values(filters.exceptionalProperties).some(value => value);
    const priceRangeActive = filters.priceRange?.min !== 0 || filters.priceRange?.max !== 5000;
    const sortActive = filters.sortByPrice !== 'default';

    return propertyTypesActive || amenitiesActive || safetyFeaturesActive ||
      bookingOptionsActive || exceptionalPropertiesActive || priceRangeActive || sortActive;
  };

  const isFilterActive = (type, id) => {
    if (!filters[type]) return false;
    return !!filters[type][id];
  };

  const FilterButton = ({ type, id, children, className, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`border transition-all ${isActive
        ? 'bg-blue text-white border-blue font-medium'
        : 'bg-white text-gray-700 border-gray-300 hover:border-blue'
        } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50">
      <div className={`bg-white rounded-2xl max-w-[480px]  w-full max-h-[90vh] shadow-xl ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('common.close')}
          >
            <FaTimes className="text-lg" />
          </button>
          <span className="font-semibold text-lg">{t('FilterModule.filters.title')}</span>
          <div className="w-8" />
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {/* Property Types */}
          <section className="p-4 border-b">
            <h3 className="text-lg font-medium mb-4">{t('FilterModule.filters.propertyType')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypes.map(type => (
                <FilterButton
                  key={type.id}
                  type="propertyTypes"
                  id={type.id}
                  isActive={isFilterActive('propertyTypes', type.id)}
                  onClick={() => handlePropertyTypeToggle(type.id)}
                  className="p-4 rounded-xl flex items-center gap-3"
                >
                  <span className={isFilterActive('propertyTypes', type.id) ? 'text-white' : 'text-gray-700'}>
                    {type.icon}
                  </span>
                  <span>{type.label}</span>
                </FilterButton>
              ))}
            </div>
          </section>

          {/* Price Range Section */}
          <section className="p-4 border-b">
            <h3 className="text-lg font-medium mb-4">{t('FilterModule.filters.priceRange')}</h3>
            <div className="space-y-6">
              {/* Display current price range */}
              <div className="flex justify-between items-center px-2">
                <span className="font-medium text-lg">MAD {filters.priceRange?.min || 0}</span>
                <span className="text-gray-500">{t('FilterModule.filters.to')}</span>
                <span className="font-medium text-lg">MAD {filters.priceRange?.max || 5000}</span>
              </div>

              {/* Min price slider */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">{t('FilterModule.filters.minPrice')}</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={filters.priceRange?.min || 200}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Max price slider */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">{t('FilterModule.filters.maxPrice')}</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={filters.priceRange?.max || 5000}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Price Sort Section */}
          <section className="p-4 border-b">
            <h3 className="text-lg font-medium mb-4">{t('FilterModule.filters.sortByPrice')}</h3>
            <div className="space-y-3">
              {priceSortOptions.map(option => (
                <FilterButton
                  key={option.id}
                  isActive={filters.sortByPrice === option.id}
                  onClick={() => handlePriceSortChange(option.id)}
                  className="flex items-center justify-between w-full p-4 rounded-xl"
                >
                  <span>{option.label}</span>
                  {filters.sortByPrice === option.id && (
                    <span className="h-5 w-5 rounded-full bg-white text-blue flex items-center justify-center text-xs">✓</span>
                  )}
                </FilterButton>
              ))}
            </div>
          </section>

          {/* Amenities Sections */}
          {amenityCategories.map(category => (
            <section key={category.title} className="p-4 border-b">
              <h3 className="text-lg font-medium mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map(item => (
                  <FilterButton
                    key={item.id}
                    type={category.title === t('FilterModule.amenities.security') ? 'safety_features' : 'amenities'}
                    id={item.id}
                    isActive={isFilterActive(category.title === t('FilterModule.amenities.security') ? 'safety_features' : 'amenities', item.id)}
                    onClick={() => (category.title === t('FilterModule.amenities.security') ? handleSafetyFeatureToggle(item.id) : handleAmenityToggle(item.id))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                  >
                    <span className={isFilterActive(category.title === t('FilterModule.amenities.security') ? 'safety_features' : 'amenities', item.id) ? 'text-white' : 'text-gray-700'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </FilterButton>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t p-4 flex justify-between items-center bg-white rounded-b-2xl">
          <button
            onClick={handleClearFilters}
            className={`text-sm font-semibold underline ${hasActiveFilters() ? 'opacity-100' : 'opacity-50'}`}
            disabled={!hasActiveFilters()}
          >
            {t('FilterModule.filters.clearAll')}
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            {t('FilterModule.filters.showProperties', { count: filteredHotels.length })}
          </button>
        </div>
      </div>
    </div>
  );
};