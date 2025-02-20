import React from 'react';
import { 
  FiWifi, FiTv, FiHome, 
  FiCamera,
  FiWind, FiBriefcase 
} from 'react-icons/fi';
import { 
  BiSwim, BiBath, BiChair, BiDish,
  BiDumbbell, BiWater, BiShower,
  BiBarChart,
  BiBaseball,
  BiFirstPage
} from 'react-icons/bi';
import { 
  AiOutlineSafety, 
  AiOutlineMedicineBox,
  AiOutlineFire,
  AiOutlineAlert
} from 'react-icons/ai';

const AMENITIES = {
  guest_favorites: [
    { id: 'wifi', label: 'Wifi', icon: FiWifi },
    { id: 'tv', label: 'TV', icon: FiTv },
    { id: 'kitchen', label: 'Kitchen', icon: FiHome },
    { id: 'washer', label: 'Washer', icon: FiCamera },
    { id: 'free_parking', label: 'Free parking on premises', icon: FiCamera },
    { id: 'paid_parking', label: 'Paid parking on premises', icon: FiCamera },
    { id: 'air_conditioning', label: 'Air conditioning', icon: FiWind },
    { id: 'workspace', label: 'Dedicated workspace', icon: FiBriefcase }
  ],
  standout_amenities: [
    { id: 'pool', label: 'Pool', icon: BiSwim },
    { id: 'hot_tub', label: 'Hot tub', icon: BiBath },
    { id: 'patio', label: 'Patio', icon: BiChair },
    { id: 'bbq_grill', label: 'BBQ grill', icon: BiBarChart },
    { id: 'outdoor_dining', label: 'Outdoor dining area', icon: BiDish },
    { id: 'fire_pit', label: 'Fire pit', icon: BiFirstPage },
    { id: 'pool_table', label: 'Pool table', icon: BiDumbbell },
    { id: 'indoor_fireplace', label: 'Indoor fireplace', icon: BiFirstPage },
    { id: 'piano', label: 'Piano', icon: BiWater },
    { id: 'exercise_equipment', label: 'Exercise equipment', icon: BiDumbbell },
    { id: 'lake_access', label: 'Lake access', icon: BiWater },
    { id: 'beach_access', label: 'Beach access', icon: BiBaseball},
    { id: 'ski_in_out', label: 'Ski in/Ski out', icon: BiFirstPage },
    { id: 'outdoor_shower', label: 'Outdoor shower', icon: BiShower }
  ],
  safety_items: [
    { id: 'smoke_alarm', label: 'Smoke alarm', icon: AiOutlineSafety },
    { id: 'first_aid', label: 'First aid kit', icon: AiOutlineMedicineBox },
    { id: 'fire_extinguisher', label: 'Fire extinguisher', icon: AiOutlineFire },
    { id: 'carbon_monoxide', label: 'Carbon monoxide alarm', icon: AiOutlineAlert }
  ]
};

const AmenitiesSection = ({ propertyData, setPropertyData }) => {
  const toggleAmenity = (amenityId) => {
    setPropertyData(prev => {
      const currentAmenities = prev.property_details.amenities || [];
      const newAmenities = currentAmenities.includes(amenityId)
        ? currentAmenities.filter(id => id !== amenityId)
        : [...currentAmenities, amenityId];

      return {
        ...prev,
        property_details: {
          ...prev.property_details,
          amenities: newAmenities
        }
      };
    });
  };

  const AmenityButton = ({ amenity }) => {
    const isSelected = (propertyData.property_details.amenities || []).includes(amenity.id);
    const Icon = amenity.icon;

    return (
      <button
        onClick={() => toggleAmenity(amenity.id)}
        className={`flex items-center p-4 border rounded-lg w-full text-left transition-colors ${
          isSelected 
            ? 'border-black bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Icon className="w-6 h-6 mr-4" />
        <span>{amenity.label}</span>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Tell guests what your place has to offer</h2>
        <p className="text-gray-600 mt-2">You can add more amenities after you publish your listing.</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">What about these guest favorites?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AMENITIES.guest_favorites.map(amenity => (
              <AmenityButton key={amenity.id} amenity={amenity} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Do you have any standout amenities?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AMENITIES.standout_amenities.map(amenity => (
              <AmenityButton key={amenity.id} amenity={amenity} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Do you have any of these safety items?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AMENITIES.safety_items.map(amenity => (
              <AmenityButton key={amenity.id} amenity={amenity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSection; 