"use client"

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSave, FaSearch, FaLocationArrow } from 'react-icons/fa';

export default function LocationStep({ formData, handleInputChange }) {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [coordinateInput, setCoordinateInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock fetch regions - in a real app, you would fetch from an API
  useEffect(() => {
    // Simulate API call
    const mockRegions = [
      {
        _id: 'r1',
        regionNameEnglish: 'California',
        regionNameArabic: 'كاليفورنيا',
        cities: [
          {
            id: 'c1',
            cityNameEnglish: 'San Francisco',
            cityNameArabic: 'سان فرانسيسكو',
            neighborhoods: [
              { id: 'n1', valueEnglish: 'Downtown', valueArabic: 'وسط المدينة' },
              { id: 'n2', valueEnglish: 'Mission District', valueArabic: 'حي المهمة' }
            ]
          },
          {
            id: 'c2',
            cityNameEnglish: 'Los Angeles',
            cityNameArabic: 'لوس أنجلوس',
            neighborhoods: [
              { id: 'n3', valueEnglish: 'Hollywood', valueArabic: 'هوليوود' },
              { id: 'n4', valueEnglish: 'Venice Beach', valueArabic: 'شاطئ فينيس' }
            ]
          }
        ]
      },
      {
        _id: 'r2',
        regionNameEnglish: 'New York',
        regionNameArabic: 'نيويورك',
        cities: [
          {
            id: 'c3',
            cityNameEnglish: 'New York City',
            cityNameArabic: 'مدينة نيويورك',
            neighborhoods: [
              { id: 'n5', valueEnglish: 'Manhattan', valueArabic: 'مانهاتن' },
              { id: 'n6', valueEnglish: 'Brooklyn', valueArabic: 'بروكلين' }
            ]
          }
        ]
      }
    ];
    
    setRegions(mockRegions);
  }, []);

  // Initialize form with data once regions are loaded
  useEffect(() => {
    if (formData.location && regions.length > 0) {
      // Find region by name
      const regionObj = regions.find(r => r.regionNameEnglish === formData.location.region);

      if (regionObj) {
        setSelectedRegion(regionObj._id);
        setCities(regionObj.cities || []);

        // Wait for the next render cycle with cities
        setTimeout(() => {
          // Find city by name
          const cityObj = regionObj.cities.find(c => c.cityNameEnglish === formData.location.city);

          if (cityObj) {
            setSelectedCity(cityObj.id);
            setNeighborhoods(cityObj.neighborhoods || []);

            // Wait for the next render cycle with neighborhoods
            setTimeout(() => {
              // Find neighborhood by name
              const neighborhoodObj = cityObj.neighborhoods.find(n => n.valueEnglish === formData.location.neighborhood);
              if (neighborhoodObj) {
                setSelectedNeighborhood(neighborhoodObj.id);
              }
            }, 0);
          }
        }, 0);
      }

      // Set coordinate display format
      if (formData.location.coordinates?.latitude && formData.location.coordinates?.longitude) {
        setCoordinateInput(`${formData.location.coordinates.latitude}, ${formData.location.coordinates.longitude}`);
      }
    }
  }, [formData.location, regions]);

  // Update cities when region changes
  useEffect(() => {
    if (selectedRegion) {
      const selectedRegionObj = regions.find(r => r._id === selectedRegion);
      if (selectedRegionObj) {
        setCities(selectedRegionObj.cities);
        setSelectedCity('');
        setNeighborhoods([]);
        setSelectedNeighborhood('');
        
        // Update formData with region
        handleInputChange("location", "region", selectedRegionObj.regionNameEnglish);
      }
    } else {
      setCities([]);
      setSelectedCity('');
      setNeighborhoods([]);
      setSelectedNeighborhood('');
    }
  }, [selectedRegion, regions]);

  // Update neighborhoods when city changes
  useEffect(() => {
    if (selectedCity && cities.length > 0) {
      const selectedCityObj = cities.find(c => c.id === selectedCity);
      if (selectedCityObj) {
        setNeighborhoods(selectedCityObj.neighborhoods);
        setSelectedNeighborhood('');
        
        // Update formData with city
        handleInputChange("location", "city", selectedCityObj.cityNameEnglish);
      }
    } else {
      setNeighborhoods([]);
      setSelectedNeighborhood('');
    }
  }, [selectedCity, cities]);

  // Update formData when neighborhood changes
  useEffect(() => {
    if (selectedNeighborhood && neighborhoods.length > 0) {
      const selectedNeighborhoodObj = neighborhoods.find(n => n.id === selectedNeighborhood);
      if (selectedNeighborhoodObj) {
        handleInputChange("location", "neighborhood", selectedNeighborhoodObj.valueEnglish);
      }
    }
  }, [selectedNeighborhood, neighborhoods]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          
          handleInputChange("location", "coordinates.latitude", lat);
          handleInputChange("location", "coordinates.longitude", lng);
          setCoordinateInput(`${lat}, ${lng}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please enter coordinates manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Improved coordinate handling
  const handleCoordinateChange = (e) => {
    const value = e.target.value;
    setCoordinateInput(value);

    // If input is empty, clear both coordinates
    if (!value.trim()) {
      handleInputChange("location", "coordinates.latitude", "");
      handleInputChange("location", "coordinates.longitude", "");
      return;
    }

    // If input contains a comma, try to parse as lat,lng pair
    if (value.includes(',')) {
      const coords = value.split(',').map(coord => coord.trim());

      if (coords.length >= 2) {
        handleInputChange("location", "coordinates.latitude", coords[0]);
        handleInputChange("location", "coordinates.longitude", coords[1]);
      }
    } else {
      // If no comma, just update latitude field
      handleInputChange("location", "coordinates.latitude", value);
      handleInputChange("location", "coordinates.longitude", "");
    }
  };


  return (
    <div className="p-6 mb-24 md:mb-0 bg-white rounded-lg shadow-sm">
      <div className="flex items-center mb-6">
        <FaMapMarkerAlt className="text-blue-500 text-2xl mr-3" />
        <h2 className="text-2xl font-semibold">Location Details</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Enter the property location details. Accurate location information helps potential buyers or renters find your property.
      </p>

      <div className="space-y-6">
        <form  className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region._id} value={region._id}>
                    {region.regionNameEnglish}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City<span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedRegion}
                required
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.cityNameEnglish}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhood
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCity}
              >
                <option value="">Select Neighborhood</option>
                {neighborhoods.map(neighborhood => (
                  <option key={neighborhood.id} value={neighborhood.id}>
                    {neighborhood.valueEnglish}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.location.postalCode || ''}
                onChange={(e) => handleInputChange("location", "postalCode", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 94103"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Latitude, Longitude
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-sm text-blue-500 flex items-center hover:text-blue-700"
              >
                <FaLocationArrow className="mr-1" /> Get current location
              </button>
            </div>
            <input
              type="text"
              value={coordinateInput}
              onChange={handleCoordinateChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 37.7749, -122.4194"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter coordinates in decimal format (e.g. 37.7749, -122.4194) or clear to remove location
            </p>
          </div>

          {/* Map Preview */}
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h3 className="text-lg font-medium text-gray-700">Map Preview</h3>
            </div>
            <div className="aspect-video bg-gray-100 flex items-center justify-center max-h-[300px] h-full">
              {formData.location.coordinates?.latitude && formData.location.coordinates?.longitude ? (
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-500 opacity-20 rounded-full animate-ping"></div>
                    <FaMapMarkerAlt className="w-8 h-8 text-red-500 mx-auto relative z-10" />
                  </div>
                  <span className="block mt-2 font-medium">
                    {formData.location.coordinates.latitude}, {formData.location.coordinates.longitude}
                  </span>
                  <span className="block mt-1 text-sm text-gray-600">
                    {formData.location.city ? 
                      `${formData.location.city}, ${formData.location.region || ''}` 
                      : 'Location set'}
                  </span>
                </div>
              ) : (
                <div className="text-center p-8">
                  <FaMapMarkerAlt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="block text-gray-500">Enter coordinates to see location</span>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 flex items-center mx-auto"
                  >
                    <FaLocationArrow className="mr-2" /> Use my current location
                  </button>
                </div>
              )}
            </div>
          </div>

         
        </form>
      </div>
    </div>
  );
}