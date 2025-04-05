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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Country */}
        <div>
          <label className="block text-sm text-gray-600">Country</label>
          <select
            value={propertyData.location.country || ''}
            onChange={(e) => handleLocationChange('country', e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="MA">Morocco - MA</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm text-gray-600">Region</label>
          <input
            type="text"
            value={propertyData.location.region || ''}
            onChange={(e) => handleLocationChange('region', e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter region"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm text-gray-600">City</label>
          <input
            type="text"
            value={propertyData.location.city || ''}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter city"
          />
        </div>

        {/* Neighborhood */}
        <div>
          <label className="block text-sm text-gray-600">Neighborhood</label>
          <input
            type="text"
            value={propertyData.location.neighborhood || ''}
            onChange={(e) => handleLocationChange('neighborhood', e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter neighborhood"
          />
        </div>

        {/* Combined Input for Latitude & Longitude */}
        <div>
          <label className="block text-sm text-gray-600">Location Details (Latitude, Longitude)</label>
          <textarea
            value={propertyData.location.location_details || ''}
            onChange={(e) => handleLocationChange('location_details', e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Latitude and Longitude separated by a comma"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
