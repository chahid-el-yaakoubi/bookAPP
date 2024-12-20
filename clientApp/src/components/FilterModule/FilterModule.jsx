import React, { useState } from 'react';
import './FilterModule.css';

const FilterModule = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: {
      min: 0,
      max: 1000
    },
    rooms: 1,
    propertyType: 'any',
    amenities: []
  });

  const amenitiesList = [
    'WiFi',
    'Kitchen',
    'Air Conditioning',
    'Pool',
    'Free Parking',
    'Washer',
    'Dryer'
  ];

  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: parseInt(value)
      }
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="filter-module">
      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <input
            type="number"
            value={filters.priceRange.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Rooms</h3>
        <select
          value={filters.rooms}
          onChange={(e) => setFilters(prev => ({ ...prev, rooms: parseInt(e.target.value) }))}
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}+ rooms</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h3>Property Type</h3>
        <select
          value={filters.propertyType}
          onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
        >
          <option value="any">Any</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="guesthouse">Guesthouse</option>
          <option value="hotel">Hotel</option>
        </select>
      </div>

      <div className="filter-section">
        <h3>Amenities</h3>
        <div className="amenities-grid">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="amenity-checkbox">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <button
        className="apply-filters"
        onClick={() => onFilterChange(filters)}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterModule;
