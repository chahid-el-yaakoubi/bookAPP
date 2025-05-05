import React from 'react';
import {
  FaWifi, FaTv, FaSnowflake, FaFire, FaShower, FaParking,
  FaUtensils, FaTshirt, FaBriefcase, FaTree,
  FaSwimmingPool, FaChair, FaHotTub, FaCoffee
} from 'react-icons/fa';
import { MdElevator } from 'react-icons/md';

const PropertyFeatures = ({ propertyData, setPropertyData }) => {
  const featuresList = [
    { id: 'wifi', label: 'Wi-Fi / Internet', icon: <FaWifi /> },
    { id: 'tv', label: 'Television', icon: <FaTv /> },
    { id: 'airConditioning', label: 'Air Conditioning', icon: <FaSnowflake /> },
    { id: 'heating', label: 'Heating', icon: <FaFire /> },
    { id: 'hotWater', label: 'Hot Water', icon: <FaShower /> },
    { id: 'freeParking', label: 'Parking / Garage', icon: <FaParking /> },
    { id: 'fullyEquippedKitchen', label: 'Kitchen', icon: <FaUtensils /> },
    { id: 'washingMachine', label: 'Washer', icon: <FaTshirt /> },
    { id: 'workspace', label: 'Workspace', icon: <FaBriefcase /> },
    { id: 'elevator', label: 'Elevator', icon: <MdElevator /> },
    { id: 'garden', label: 'Garden', icon: <FaTree /> },
    { id: 'indoorPool', label: 'Swimming Pool', icon: <FaSwimmingPool /> },
    { id: 'terraceBalcony', label: 'Terrace', icon: <FaChair /> },
    { id: 'jacuzzi', label: 'Jacuzzi', icon: <FaHotTub /> },
    { id: 'bbqArea', label: 'BBQ', icon: <FaFire /> },
    { id: 'breakfastIncluded', label: 'Breakfast', icon: <FaCoffee /> },
  ];

  const handleFeatureChange = (feature) => {
    const currentFeatures = propertyData?.property_details?.propertyFeatures?.standard || [];
    const updatedFeatures = currentFeatures.includes(feature.id)
      ? currentFeatures.filter(f => f !== feature.id)
      : [...currentFeatures, feature.id];

    setPropertyData({
      ...propertyData,
      property_details: {
        ...propertyData?.property_details,
        propertyFeatures: {
          ...propertyData?.property_details?.propertyFeatures,
          standard: updatedFeatures
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Property Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuresList.map(feature => {
          const isSelected = propertyData?.property_details?.propertyFeatures?.standard?.includes(feature.id);
          return (
            <div 
              key={feature.id}
              onClick={() => handleFeatureChange(feature)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-blue/40 border border-blue shadow-sm' 
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className={`mr-3 text-xl ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                {feature.icon}
              </div>
              <span className={`${isSelected ? 'font-medium text-black' : 'text-gray-700'}`}>
                {feature.label}
              </span>
              <div className="ml-auto">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  isSelected 
                    ? 'bg-blue text-white' 
                    : 'border border-gray-300'
                }`}>
                  {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-gray-600 text-sm">
        <p>Selected features: {propertyData?.property_details?.propertyFeatures?.standard?.length || 0}</p>
      </div>
    </div>
  );
};

export default PropertyFeatures;