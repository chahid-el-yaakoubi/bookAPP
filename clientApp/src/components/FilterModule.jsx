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

import {
  toggleAmenity,
  toggleBookingOption,
  toggleExceptionalProperty,
  togglePropertyType,
  clearFilters,
  setPriceRange,
  setSortByPrice
} from '../redux/filtersSlice';
import { applyFilters } from '../redux/hotelsSlice';

export const FilterModule = ({ onClose }) => {
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.filters) || {
    priceRange: { min: 200, max: 2000 },
    amenities: {},
    bookingOptions: {},
    exceptionalProperties: {},
    propertyTypes: {},
    sortByPrice: 'default'
  };

  const { filteredHotels = [] } = useSelector((state) => state.hotels || {});

  useEffect(() => {
    dispatch(applyFilters(filters));
  }, [dispatch, filters]);

  const priceSortOptions = [
    { id: 'default', label: 'Recommended' },
    { id: 'low-to-high', label: 'Price: Low to High' },
    { id: 'high-to-low', label: 'Price: High to Low' }
  ];

  const handleToggle = (toggleAction, itemId) => {
    dispatch(toggleAction(itemId));
  };

  const handlePriceSortChange = (sortOption) => {
    dispatch(setSortByPrice(sortOption));
  };

  const handleAmenityToggle = (id) => handleToggle(toggleAmenity, id);
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
        max: Math.max(filters.priceRange?.max || 2000, newValue)
      };
    } else {
      newPriceRange = {
        min: Math.min(filters.priceRange?.min || 100, newValue),
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
    { id: 'hotel', label: 'Hotel', icon: <FaHotel /> },
    { id: 'apartment', label: 'Apartment', icon: <FaBuilding /> },
    { id: 'villa', label: 'Villa', icon: <FaHome /> },
    { id: 'house', label: 'House', icon: <FaHome /> },
    { id: 'guesthouse', label: 'Guesthouse', icon: <FaHouseUser /> },
  ];

  const amenityCategories = [
    {
      title: "Popular",
      items: [
        { id: 'wifi', label: 'Wi-Fi / Internet', icon: <FaWifi /> },
        { id: 'tv', label: 'Television', icon: <FaTv /> },
        { id: 'ac', label: 'Air Conditioning', icon: <FaSnowflake /> },
        { id: 'heating', label: 'Heating', icon: <FaFire /> },
        { id: 'hot-water', label: 'Hot Water', icon: <FaShower /> },
        { id: 'parking', label: 'Parking / Garage', icon: <FaParking /> },
      ]
    },
    {
      title: "Essentials",
      items: [
        { id: 'kitchen', label: 'Kitchen', icon: <FaUtensils /> },
        { id: 'washer', label: 'Washer', icon: <FaTshirt /> },
        { id: 'workspace', label: 'Dedicated Workspace', icon: <FaBriefcase /> },
        { id: 'elevator', label: 'Elevator', icon: <MdElevator /> },
      ]
    },
    {
      title: "Features",
      items: [
        { id: 'garden', label: 'Garden', icon: <FaTree /> },
        { id: 'pool', label: 'Pool', icon: <FaSwimmingPool /> },
        { id: 'terrace', label: 'Terrace / Balcony', icon: <FaChair /> },
        { id: 'jacuzzi', label: 'Jacuzzi', icon: <FaHotTub /> },
        { id: 'bbq', label: 'Barbecue', icon: <FaFire /> },
        { id: 'breakfast', label: 'Breakfast', icon: <FaCoffee /> },
      ]
    },
    {
      title: "Security",
      items: [
        { id: 'smoke-detector', label: 'Smoke Detector', icon: <FaLockOpen /> },
        { id: 'carbon-detector', label: 'Carbon Monoxide Detector', icon: <FaLock /> },
        { id: 'security', label: '24/7 Security', icon: <FaLock /> },
        { id: 'camera', label: 'Camera', icon: <FaCamera /> },
      ]
    },
  ];

  const hasActiveFilters = () => {
    const propertyTypesActive = filters.propertyTypes && Object.values(filters.propertyTypes).some(value => value);
    const amenitiesActive = filters.amenities && Object.values(filters.amenities).some(value => value);
    const bookingOptionsActive = filters.bookingOptions && Object.values(filters.bookingOptions).some(value => value);
    const exceptionalPropertiesActive = filters.exceptionalProperties && Object.values(filters.exceptionalProperties).some(value => value);
    const priceRangeActive = filters.priceRange?.min !== 200 || filters.priceRange?.max !== 2000;
    const sortActive = filters.sortByPrice !== 'default';

    return propertyTypesActive || amenitiesActive || bookingOptionsActive ||
      exceptionalPropertiesActive || priceRangeActive || sortActive;
  };

  const isFilterActive = (type, id) => {
    if (!filters[type]) return false;
    return !!filters[type][id];
  };

  const FilterButton = ({ type, id, children, className, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`border transition-all ${
        isActive
          ? 'bg-black text-white border-black font-medium'
          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
      } ${className}`}
    >
      {children}
    </button>
  );
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl max-w-[480px] w-full max-h-[90vh] shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <FaTimes className="text-lg" />
          </button>
          <span className="font-semibold text-lg">Filtres</span>
          <div className="w-8" /> 
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {/* Property Types */}
          <section className="p-4 border-b">
            <h3 className="text-lg font-medium mb-4">Type de logement</h3>
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
            <h3 className="text-lg font-medium mb-4">Fourchette de prix</h3>
            <div className="space-y-6">
              {/* Display current price range */}
              <div className="flex justify-between items-center px-2">
                <span className="font-medium text-lg">${filters.priceRange?.min || 200}</span>
                <span className="text-gray-500">à</span>
                <span className="font-medium text-lg">${filters.priceRange?.max || 2000}</span>
              </div>
              
              {/* Min price slider */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Prix minimum</label>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="50"
                  value={filters.priceRange?.min || 200}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>
              
              {/* Max price slider */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">Prix maximum</label>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="50"
                  value={filters.priceRange?.max || 2000}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Price Sort Section */}
          <section className="p-4 border-b">
            <h3 className="text-lg font-medium mb-4">Tri par prix</h3>
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
                    <span className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center text-xs">✓</span>
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
                    type="amenities"
                    id={item.id}
                    isActive={isFilterActive('amenities', item.id)}
                    onClick={() => handleAmenityToggle(item.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                  >
                    <span className={isFilterActive('amenities', item.id) ? 'text-white' : 'text-gray-700'}>
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
            Tout effacer
          </button>
          <button 
            onClick={handleApplyFilters}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Afficher {filteredHotels.length} logements
          </button>
        </div>
      </div>
    </div>
  );
};