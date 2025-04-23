import {
  FaBath, FaShower,
  FaHotTub, FaTshirt, FaSoap, FaTemperatureHigh,
  FaWeight, FaCloudRain,
  FaToilet, FaUmbrella,
  FaSocks,
  FaToiletPaper,
  FaTools,
  FaTrash,
  FaWind,
  FaSink,
  FaLightbulb,
  FaPlug,
  FaTh,
} from 'react-icons/fa';
import { PiHairDryerBold } from "react-icons/pi";
import { GiMirrorMirror } from 'react-icons/gi';
import { Plus } from 'lucide-react';

export const BathroomAmenitiesSelector = ({ bathrooms = [], onBathroomsChange, handleSave }) => {
  // Moroccan-focused bathroom types
  const bathroomTypes = [
    "Private Bathroom",
    "Shared Bathroom",
    "Traditional Hammam",
    "Shower Only",
    "Bathtub Only",
    "Shower & Bathtub",
    "Ensuite Bathroom",
    "Guest Bathroom",
    "Outdoor Bathroom"
  ];

  // Refined amenities list with Moroccan traditional items prioritized
  const bathroomAmenities = [
    // Traditional Moroccan
    { id: 'moroccan_hamam_basin', label: 'Hammam Basin (Bsat)', category: 'Traditional', icon: FaHotTub },
    { id: 'water_bucket', label: 'Water Bucket (Sla)', category: 'Traditional', icon: FaBath },
    { id: 'moroccan_black_soap', label: 'Black Soap (Saboun Beldi)', category: 'Traditional', icon: FaSoap },
    { id: 'ghassoul', label: 'Ghassoul Clay', category: 'Traditional', icon: FaSoap },
    { id: 'kessa_glove', label: 'Kessa Scrubbing Glove', category: 'Traditional', icon: FaSoap },
    { id: 'essential_oils', label: 'Argan & Rose Oils', category: 'Traditional', icon: FaSoap },

    // Essentials
    { id: 'toilet_bidet', label: 'Toilet & Bidet', category: 'Essentials', icon: FaToilet },
    { id: 'shower_bathtub', label: 'Shower / Bathtub', category: 'Essentials', icon: FaShower },
    { id: 'sink_with_mirror', label: 'Sink with Mirror', category: 'Essentials', icon: FaSink },
    { id: 'toilet_paper', label: 'Toilet Paper', category: 'Essentials', icon: FaToiletPaper },
    { id: 'trash_bin', label: 'Bathroom Trash Bin', category: 'Essentials', icon: FaTrash },
    { id: 'power_socket', label: 'Power Socket', category: 'Essentials', icon: FaPlug },

    // Comfort & Hygiene
    { id: 'towels_bathrobes', label: 'Towels & Bathrobes', category: 'Comfort', icon: FaTshirt },
    { id: 'slippers', label: 'Slippers', category: 'Comfort', icon: FaSocks },
    { id: 'bath_mat', label: 'Bath Mat', category: 'Comfort', icon: FaTh },
    { id: 'heated_towel_rack', label: 'Heated Towel Rack', category: 'Comfort', icon: FaTemperatureHigh },
    { id: 'air_freshener', label: 'Incense (Bakhoor)', category: 'Comfort', icon: FaWind },

    // Grooming
    { id: 'hairdryer', label: 'Hairdryer', category: 'Grooming', icon: PiHairDryerBold },
    { id: 'makeup_mirror', label: 'Makeup Mirror', category: 'Grooming', icon: GiMirrorMirror },
    { id: 'shower_cap', label: 'Shower Cap', category: 'Grooming', icon: FaUmbrella },

    // Luxury Options
    { id: 'rain_shower', label: 'Rain Shower', category: 'Luxury', icon: FaCloudRain },
    { id: 'jacuzzi', label: 'Jacuzzi', category: 'Luxury', icon: FaHotTub },
    { id: 'vanity_light', label: 'Decorative Lighting', category: 'Luxury', icon: FaLightbulb },
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

  // Handle bathroom type change
  const handleTypeChange = (bathroomId, type) => {
    const updatedBathrooms = bathrooms.map(bathroom =>
      bathroom.id === bathroomId
        ? { ...bathroom, type }
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
      { id: newId, amenities: {}, type: "Private Bathroom" }
    ]);
  };

  // Remove a bathroom
  const removeBathroom = (bathroomId) => {
    if (bathrooms.length > 0) {
      onBathroomsChange(
        bathrooms.filter(bathroom => bathroom.id !== bathroomId)
      );
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded">
      {/* Hero Section */}
      <div className="bg-amber-50 text-gray-900 py-8 px-6 mb-6 rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Moroccan Bathroom Amenities</h1>
          <p className="text-lg opacity-90">Customize your Moroccan property's bathroom facilities. Add traditional hammams or modern bathrooms with authentic local amenities.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
          <p className="text-blue-800">Your property has <span className="font-bold">{bathrooms.length}</span> bathroom(s) configured. Add more bathrooms as needed.</p>
        </div>

        {bathrooms.map(bathroom => (
          <div key={bathroom.id} className="mb-8 p-6 border rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center mb-5 pb-3 border-b">
              <h2 className="text-xl font-bold text-gray-800">Bathroom {bathroom.id}</h2>
              {bathrooms.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeBathroom(bathroom.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center text-sm"
                >
                  <span className="mr-1">−</span> Remove
                </button>
              )}
            </div>

            {/* Bathroom Type Selector */}
            <div className="mb-6">
              <label htmlFor={`bathroom-${bathroom.id}-type`} className="block mb-2 font-medium text-gray-700">
                Bathroom Type
              </label>
              <select
                id={`bathroom-${bathroom.id}-type`}
                value={bathroom.type}
                onChange={(e) => handleTypeChange(bathroom.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                {bathroomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {bathroomAmenities.map(amenity => (
                <div key={amenity.id} className="flex items-center p-2 rounded hover:bg-amber-50 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`bathroom-${bathroom.id}-${amenity.id}`}
                    checked={bathroom.amenities[amenity.id] || false}
                    onChange={(e) => handleAmenityChange(bathroom.id, amenity.id, e.target.checked)}
                    className="h-5 w-5 text-amber-600 rounded mr-2"
                  />
                  {amenity.icon && <amenity.icon className="mr-2 text-amber-700" size={18} />}
                  <label htmlFor={`bathroom-${bathroom.id}-${amenity.id}`} className="text-gray-700 text-sm">
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
          className="w-full mb-8 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center justify-center shadow-md"
        >
          <Plus size={20} className="mr-2" /> Add Another Bathroom
        </button>

        {/* Summary Section */}
        <div className="mt-8 mb-12 p-6 border rounded-lg bg-amber-50 shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Selected Amenities Summary</h3>

          {bathrooms.map(bathroom => (
            <div key={bathroom.id} className="mb-4 last:mb-0">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mr-2 font-bold">
                  {bathroom.id}
                </div>
                <h4 className="font-semibold text-gray-700">
                  Bathroom {bathroom.id} - {bathroom?.type}
                </h4>
              </div>

              <div className="pl-10">
                {Object.entries(bathroom.amenities)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([amenityId, _]) => {
                    const amenity = bathroomAmenities.find(a => a.id === amenityId);
                    return (
                      <span key={amenityId} className="inline-block bg-amber-600 text-white text-sm px-3 py-1 rounded-full mr-2 mb-2">
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

        {handleSave && (
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-amber-600 to-amber-800 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:from-amber-700 hover:to-amber-900 transition-all duration-300"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};