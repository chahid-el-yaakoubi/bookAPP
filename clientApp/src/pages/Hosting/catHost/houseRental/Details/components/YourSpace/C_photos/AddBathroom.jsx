import {
    // Font Awesome Icons
   FaBath, FaShower,
    FaHotTub, FaTshirt,  FaSoap,  FaTemperatureHigh,
    FaWeight, FaCloudRain,  
    FaUsers,  FaToilet,   FaUmbrella,
    
    FaSocks,
} from 'react-icons/fa';
import { PiHairDryerBold } from "react-icons/pi";

// Material Design Icons

// Game Icons
import {
    GiMirrorMirror 
} from 'react-icons/gi';

// Bootstrap Icons
import { BiFridge } from 'react-icons/bi';
import { ArrowLeft, Coffee, Droplet, Home, Laptop, Layout, Minus, Plus, Tv, Users, X } from 'lucide-react';
export const BathroomAmenitiesSelector = ({ bathrooms = [], onBathroomsChange }) => {
    // Bathroom amenities data
    const bathroomAmenities = [
      { id: 'private_bathroom', label: 'Private Bathroom', category: 'Bathroom Facilities', icon: FaBath },
      { id: 'shared_bathroom', label: 'Shared Bathroom', category: 'Bathroom Facilities', icon: FaUsers },
      { id: 'toilet_bidet', label: 'Toilet & Bidet', category: 'Bathroom Facilities', icon: FaToilet },
      { id: 'shower_bathtub', label: 'Shower / Bathtub', category: 'Bathroom Facilities', icon: FaShower },
      { id: 'jacuzzi', label: 'Jacuzzi / Hot Tub', category: 'Bathroom Facilities', icon: FaHotTub },
      { id: 'towels_bathrobes', label: 'Towels & Bathrobes', category: 'Bathroom Facilities', icon: FaTshirt },
      { id: 'hairdryer', label: 'Hairdryer', category: 'Bathroom Facilities', icon: PiHairDryerBold  },
      { id: 'toiletries', label: 'Toiletries (Soap, Shampoo, Conditioner, etc.)', category: 'Bathroom Facilities', icon: FaSoap },
      { id: 'makeup_mirror', label: 'Makeup Mirror', category: 'Bathroom Facilities', icon: GiMirrorMirror },
      { id: 'heated_towel_rack', label: 'Heated Towel Rack', category: 'Bathroom Facilities', icon: FaTemperatureHigh },
      { id: 'bathroom_scale', label: 'Bathroom Scale', category: 'Bathroom Facilities', icon: FaWeight },
      { id: 'rain_shower', label: 'Rain Shower', category: 'Bathroom Facilities', icon: FaCloudRain },
      { id: 'shower_cap', label: 'Shower Cap', category: 'Bathroom Facilities', icon: FaUmbrella },
      { id: 'slippers', label: 'Slippers', category: 'Bathroom Facilities', icon: FaSocks }
    ];
  
    // Handle checkbox change for bathroom amenities
    const handleAmenityChange = (bathroomId, amenityId, checked) => {
      const updatedBathrooms = bathrooms.map(bathroom =>
        bathroom.id === bathroomId
          ? {
              ...bathroom,
              amenities: (() => {
                const updated = { ...bathroom.amenities };
      
                if (checked) {
                  updated[amenityId] = true; // Add if checked
                } else {
                  delete updated[amenityId]; // Remove if unchecked
                }
      
                return updated;
              })()
            }
          : bathroom
      );
      
  
      onBathroomsChange(updatedBathrooms);
    };
  
    // Add new bathroom
    const addBathroom = () => {
      const newId = bathrooms.length > 0
        ? Math.max(...bathrooms.map(b => b.id)) + 1
        : 1;
  
      onBathroomsChange([
        ...bathrooms,
        { id: newId, amenities: {} }
      ]);
    };
  
    // Remove a bathroom
    const removeBathroom = (bathroomId) => {
      if (bathrooms.length > 1) {
        onBathroomsChange(
          bathrooms.filter(bathroom => bathroom.id !== bathroomId)
        );
      }
    };
  
    return (
      <div className="w-full bg-gray-100 rounded">
        {/* Hero Section */}
        <div className="text-gray-900 py-12 px-6 mb-8 rounded-lg shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Bathroom Amenities</h1>
            <p className="text-lg opacity-90">Customize your property's bathroom facilities with ease. Add multiple bathrooms and select the amenities each one offers.</p>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm border border-blue">
            <p className="text-blue">Your property has <span className="font-bold">{bathrooms.length}</span> bathroom(s) configured. Add more bathrooms as needed.</p>
          </div>
  
          {bathrooms.map(bathroom => (
            <div key={bathroom.id} className="mb-8 p-6 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-center mb-5 pb-3 border-b">
                <h2 className="text-xl font-bold text-gray-800">Bathroom {bathroom.id}</h2>
                {bathrooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBathroom(bathroom.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center text-sm"
                  >
                    <span className="mr-1">−</span> Remove
                  </button>
                )}
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {bathroomAmenities.map(amenity => (
                  <div key={amenity.id} className="flex items-center p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`bathroom-${bathroom.id}-${amenity.id}`}
                      checked={bathroom.amenities[amenity.id] || false}
                      onChange={(e) => handleAmenityChange(bathroom.id, amenity.id, e.target.checked)}
                      className="h-5 w-5 text-blue rounded mr-2"
                    />
                    {amenity.icon && <amenity.icon className="mr-2 text-blue" size={20} />}
                    <label htmlFor={`bathroom-${bathroom.id}-${amenity.id}`} className="text-gray-700">
                      {amenity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
  
          <button
            type="button"
            onClick={addBathroom}
            className="w-full mb-8 px-4 py-3 bg-blue text-white rounded-lg hover:bg-blue transition flex items-center justify-center shadow-md"
          >
            <span className="mr-2 text-xl">+</span> Add Another Bathroom
          </button>
  
          {/* Summary Section */}
          <div className="mt-8 mb-12 p-6 border rounded-lg bg-gray-50 shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Selected Amenities Summary</h3>
  
            {bathrooms.map(bathroom => (
              <div key={bathroom.id} className="mb-4 last:mb-0">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center mr-2 font-bold">
                    {bathroom.id}
                  </div>
                  <h4 className="font-semibold text-gray-700">Bathroom {bathroom.id}</h4>
                </div>
  
                <div className="pl-10">
                  {Object.entries(bathroom.amenities)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([amenityId, _]) => {
                      const amenity = bathroomAmenities.find(a => a.id === amenityId);
                      return (
                        <span key={amenityId} className="inline-block bg-blue text-white text-sm px-3 py-1 rounded-full mr-2 mb-2">
                          {amenity?.label}
                        </span>
                      );
                    })
                  }
                  {Object.values(bathroom.amenities).filter(Boolean).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No amenities selected</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  