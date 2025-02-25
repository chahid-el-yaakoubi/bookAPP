import React, { useState } from 'react';

const LocationInfo = ({ propertyData, setPropertyData }) => {
  const handleLocationChange = (field, value) => {
    setPropertyData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const [showMap, setShowMap] = useState(true); // For the toggle switch

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Country Selection */}
        <div>
          <label className="block text-sm text-gray-600">Country/region</label>
          <div className="relative mt-1">
            <select
              value={propertyData.location.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MA">Morocco - MA</option>
              {/* Add other countries as needed */}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

      

        {/* Street Address */}
        <div>
          <label className="block text-sm text-gray-600">Street address</label>
          <input
            type="text"
            value={propertyData.location.address}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter street address"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm text-gray-600">City/town</label>
          <input
            type="text"
            value={propertyData.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter city"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm text-gray-600">Postal code</label>
          <input
            type="text"
            value={propertyData.location.postal_code || ''}
            onChange={(e) => handleLocationChange('postal_code', e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter postal code"
          />
        </div>
      </div>

      {/* Map Toggle Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Show your specific location</h3>
            <p className="text-sm text-gray-500">
              Make it clear to guests where your place is located. We'll only share your address after they've made a reservation.
              <button className="text-blue-600 hover:underline ml-1">Learn more</button>
            </p>
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showMap ? 'bg-black' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showMap ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Map Container */}
        {showMap && (
          <div className="mt-4 h-[300px] rounded-lg overflow-hidden">
            {/* Replace this with your actual map component */}
            <div className="w-full h-full bg-gray-100 relative">
              <img 
                src="https://maps.googleapis.com/maps/api/staticmap?center={propertyData.location.latitude},{propertyData.location.longitude}&zoom=15&size=600x300&key=YOUR_API_KEY"
                alt="Location Map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInfo; 