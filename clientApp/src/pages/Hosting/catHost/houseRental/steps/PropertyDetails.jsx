import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const LIMITS = {
  max_guests: 32,    // 16+16 guests
  rooms: 50,         // 50 bedrooms
  beds: 50,          // 50 beds
  bathrooms: 35      // 35 bathrooms
};

const PropertyDetails = ({ propertyData, setPropertyData }) => {
  const handlePropertyChange = (field, value) => {
    // Ensure value is between 1 and the field's limit
    const newValue = Math.min(Math.max(1, value), LIMITS[field]);
    
    setPropertyData(prev => ({
      ...prev,
      property_details: {
        ...prev.property_details,
        [field]: newValue
      }
    }));
  };

  const CounterInput = ({ label, field, value }) => {
    const isAtMax = value >= LIMITS[field];
    const displayValue = isAtMax ? `${LIMITS[field]}+ or more` : value;

    return (
      <div className="flex justify-between items-center">
        <label className="text-lg font-medium">{label}</label>
        <div className="flex items-center">
          <button
            onClick={() => handlePropertyChange(field, Number(value) - 1)}
            className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center ${
              value <= 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:border-gray-600'
            }`}
            disabled={value <= 1}
          >
            <FiMinus className="w-4 h-4" />
          </button>
          
          <span className="mx-6 min-w-[4rem] text-center">{displayValue}</span>
          
          <button
            onClick={() => handlePropertyChange(field, Number(value) + 1)}
            className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center ${
              isAtMax ? 'text-gray-300 cursor-not-allowed' : 'hover:border-gray-600'
            }`}
            disabled={isAtMax}
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Share some basics about your place</h2>
        <p className="text-gray-600 mt-2">You'll add more details later, like bed types.</p>
      </div>

      <div className="space-y-8 mt-8">
        <CounterInput 
          label="Guests"
          field="max_guests"
          value={propertyData.property_details.max_guests || 1}
        />

        <div className="border-b border-gray-200"></div>

        <CounterInput 
          label="Bedrooms"
          field="rooms"
          value={propertyData.property_details.rooms || 1}
        />

        <div className="border-b border-gray-200"></div>

        <CounterInput 
          label="Beds"
          field="beds"
          value={propertyData.property_details.beds || 1}
        />

        <div className="border-b border-gray-200"></div>

        <CounterInput 
          label="Bathrooms"
          field="bathrooms"
          value={propertyData.property_details.bathrooms || 1}
        />
      </div>
    </div>
  );
};

export default PropertyDetails; 