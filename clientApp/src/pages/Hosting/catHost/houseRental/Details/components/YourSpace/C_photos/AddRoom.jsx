import React, { useState, useEffect } from 'react';
import {
  FaFan, FaThermometerHalf, FaHome, FaLightbulb, FaVolumeMute,
  FaTv, FaVolumeUp, FaGamepad, FaLaptop, FaChair, FaWifi,
  FaUtensils, FaCoffee, FaFire, FaBath, FaShower, FaSuitcase,
  FaLock, FaPhone, FaClock, FaFilm, FaBook, FaNetworkWired,
  FaPrint, FaUsb, FaPlug, FaPen, FaBlender, FaWater, FaBuilding,
  FaCamera, FaKey, FaMicrophone, FaProjectDiagram
} from 'react-icons/fa';
import { MdCurtainsClosed, MdOutlineCleaningServices, MdSmokeFree } from 'react-icons/md';
import { GiToaster, GiKnifeFork } from 'react-icons/gi';
import { FaDoorOpen, FaEarListen, FaRadio, FaTreeCity } from "react-icons/fa6";
import { BiFridge } from 'react-icons/bi';
import { 
  ArrowLeft, Coffee, Droplet, Home, Laptop, Layout, 
  Minus, Plus, Tv, Users, Umbrella, X, Map, Sun, 
  Mountain, Palmtree
} from 'lucide-react';
import { BathroomAmenitiesSelector } from './AddBathroom';

const BED_TYPES = [
  'Single Bed',
  'Double Bed',
  'Queen Bed',
  'King Bed',
  'Traditional Moroccan Bed',
  'Bunk Bed',
  'Sofa Bed',
  'Floor Mattress',
  'Crib',
];

// Morocco-specific view types
const VIEW_TYPES = [
  'Medina View',
  'Garden View',
  'Pool View',
  'Mountain View',
  'Desert View',
  'Ocean View',
  'Riad Courtyard View',
  'City View',
  'Atlas Mountains View',
];

// Amenities categorized
const AMENITY_CATEGORIES = [
  'Entertainment',
  'Workspace',
  'Moroccan Features',
  'Kitchen & Dining',
  'Technology'
];

const RoomFeatures = [
  { id: 'air_conditioning', label: 'Air Conditioning', category: 'Room Features', icon: FaThermometerHalf },
  { id: 'heating_system', label: 'Heating System', category: 'Room Features', icon: FaFire },
  { id: 'fan', label: 'Fan', category: 'Room Features', icon: FaFan },
  { id: 'wardrobe', label: 'Wardrobe/Closet', category: 'Room Features', icon: FaHome },
  { id: 'full_length_mirror', label: 'Full-Length Mirror', category: 'Room Features', icon: FaCamera },
  { id: 'blackout_curtains', label: 'Blackout Curtains', category: 'Room Features', icon: MdCurtainsClosed },
  { id: 'reading_lights', label: 'Reading Lights', category: 'Room Features', icon: FaLightbulb },
  { id: 'soundproofing', label: 'Soundproofing', category: 'Room Features', icon: FaVolumeMute },
  { id: 'balcony', label: 'Balcony', category: 'Room Features', icon: FaBuilding },
  { id: 'terrace', label: 'Terrace/Rooftop', category: 'Room Features', icon: FaTreeCity },
  { id: 'safe', label: 'In-Room Safe', category: 'Room Features', icon: FaLock },
  { id: 'iron', label: 'Iron & Ironing Board', category: 'Room Features', icon: FaFire },
  { id: 'luggage_rack', label: 'Luggage Rack', category: 'Room Features', icon: FaSuitcase },
  { id: 'telephone', label: 'Telephone', category: 'Room Features', icon: FaPhone },
  { id: 'alarm_clock', label: 'Alarm Clock', category: 'Room Features', icon: FaClock },
  { id: 'moroccan_decor', label: 'Moroccan Décor', category: 'Room Features', icon: Palmtree },
  { id: 'traditional_rugs', label: 'Traditional Berber Rugs', category: 'Room Features', icon: Home },
  { id: 'courtyard_access', label: 'Courtyard Access', category: 'Room Features', icon: FaDoorOpen },
];

const AMENITIES = [
  // Entertainment
  { id: 'tv', label: 'TV (Satellite/Smart TV)', category: 'Entertainment', icon: FaTv },
  { id: 'speakers', label: 'Bluetooth Speakers', category: 'Entertainment', icon: FaEarListen },
  { id: 'streaming_services', label: 'Streaming Services', category: 'Entertainment', icon: FaTv },
  { id: 'books', label: 'Books & Magazines', category: 'Entertainment', icon: FaBook },

  // Workspace
  { id: 'desk', label: 'Desk / Workspace', category: 'Workspace', icon: FaLaptop },
  { id: 'high_speed_wifi', label: 'High-Speed WiFi', category: 'Workspace', icon: FaWifi },
  { id: 'power_outlets', label: 'Multiple Power Outlets', category: 'Workspace', icon: FaPlug },

  // Moroccan Features
  { id: 'traditional_breakfast', label: 'Traditional Moroccan Breakfast', category: 'Moroccan Features', icon: FaCoffee },
  { id: 'mint_tea_service', label: 'Mint Tea Service', category: 'Moroccan Features', icon: Coffee },
  { id: 'hammam_access', label: 'Hammam Access', category: 'Moroccan Features', icon: FaShower },
  { id: 'moroccan_toiletries', label: 'Moroccan Argan Toiletries', category: 'Moroccan Features', icon: FaWater },
  { id: 'courtyard_seating', label: 'Traditional Courtyard Seating', category: 'Moroccan Features', icon: FaChair },
  { id: 'local_artwork', label: 'Local Artwork & Crafts', category: 'Moroccan Features', icon: FaCamera },

  // Kitchen & Dining
  { id: 'mini_fridge', label: 'Mini Fridge', category: 'Kitchen & Dining', icon: BiFridge },
  { id: 'coffee_maker_kettle', label: 'Coffee Maker/Kettle', category: 'Kitchen & Dining', icon: FaCoffee },
  { id: 'bottled_water', label: 'Complimentary Bottled Water', category: 'Kitchen & Dining', icon: FaWater },
  { id: 'dining_area', label: 'Private Dining Area', category: 'Kitchen & Dining', icon: GiKnifeFork },

  // Technology
  { id: 'smart_home', label: 'Smart Room Controls', category: 'Technology', icon: FaKey },
  { id: 'usb_charging', label: 'USB Charging Ports', category: 'Technology', icon: FaUsb },
  { id: 'international_outlets', label: 'International Power Outlets', category: 'Technology', icon: FaPlug },
  { id: 'bluetooth_speaker', label: 'Bluetooth Speaker', category: 'Technology', icon: FaEarListen },
];

// Map category to icon
const categoryIcons = {
  'Room Features': <Home size={20} />,
  'Entertainment': <Tv size={20} />,
  'Workspace': <Laptop size={20} />,
  'Moroccan Features': <Palmtree size={20} />,
  'Kitchen & Dining': <Coffee size={20} />,
  'Technology': <FaPlug size={20} />
};

const hotelTypes = ['hotel', 'riad', 'guesthouse', 'kasbah', 'resort', 'boutique-hotel'];

const RoomForm = ({ onSubmit, initialData, onCancel, typeProperty }) => {
  const [formData, setFormData] = useState({
    type: '',
    price: null,
    description: '',
    amenities: [],
    roomFeatures: [],
    capacity: 2,
    beds: [],
    size: { value: null, unit: 'sq_m' },
    bathrooms: [],
    floor: null,
    view: [],
    categorizedAmenities: {},
    roomTitle: '',
    tempBed: { type: 'Double Bed', count: 1 },
  });

  const [errors, setErrors] = useState({});
  const [amenity, setAmenity] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Entertainment': true,
    'Workspace': false,
    'Moroccan Features': true,
    'Kitchen & Dining': false, 
    'Technology': false
  });

  // Update form data when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        tempBed: { type: 'Double Bed', count: 1 },
      }));
    }
  }, [initialData]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = 'Room type is required';
    }

    if (hotelTypes.includes(typeProperty) && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.beds.length === 0) {
      newErrors.beds = 'At least one bed type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Call parent submit handler with form data
      await onSubmit(formData);
    } catch (error) {
      console.error('Room submission error:', error);
      setErrors({
        submit: error.message || 'Failed to submit room details'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const toggleAmenity = (amenityId, category) => {
    setFormData(prev => {
      const currentCategorizedAmenities = prev.categorizedAmenities || {};
      const currentCategoryAmenities = currentCategorizedAmenities[category] || [];

      let updatedCategoryAmenities;

      if (currentCategoryAmenities.includes(amenityId)) {
        updatedCategoryAmenities = currentCategoryAmenities.filter(id => id !== amenityId);
      } else {
        updatedCategoryAmenities = [...currentCategoryAmenities, amenityId];
      }

      return {
        ...prev,
        categorizedAmenities: {
          ...currentCategorizedAmenities,
          [category]: updatedCategoryAmenities
        }
      };
    });
  };

  const isAmenitySelected = (amenityId, category) => {
    return formData.categorizedAmenities?.[category]?.includes(amenityId) || false;
  };

  const toggleView = (view) => {
    setFormData((prev) => ({
      ...prev,
      view: prev.view?.includes(view)
        ? prev.view.filter((v) => v !== view)
        : [...(prev.view || []), view],
    }));
  };

  const toggleRoomFeature = (featureId) => {
    setFormData((prev) => {
      const currentFeatures = prev.roomFeatures || [];
      if (currentFeatures.includes(featureId)) {
        return {
          ...prev,
          roomFeatures: currentFeatures.filter(id => id !== featureId),
        };
      } else {
        return {
          ...prev,
          roomFeatures: [...currentFeatures, featureId],
        };
      }
    });
  };

  // Add a toggle function for categories
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Function to render room features
  const renderRoomFeatures = () => {
    return RoomFeatures.map((item) => {
      const isChecked = formData.roomFeatures?.includes(item.id);

      return (
        <div
          key={item.id}
          className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue transition-all"
          onClick={() => toggleRoomFeature(item.id)}
        >
          <input
            type="checkbox"
            name={item.id}
            className="h-5 w-5 text-blue focus:ring-blue border-gray-300 rounded"
            checked={isChecked}
            onChange={() => {}} // Prevent native change handler since the click on div handles it
          />
          {item.icon && <item.icon className="ml-2 mr-2 text-gray-800" size={20} />}
          <label htmlFor={item.id} className="ml-1 block text-sm text-gray-700">{item.label}</label>
        </div>
      );
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue bg-opacity-40 min-h-screen pb-12">

      {/* Hero Header */}
      <div className="bg-blue/50 text-white py-16 px-8 mb-12">
        <button
          onClick={onCancel}
          className="group mb-8 flex items-center text-gray-900 hover:scale-105 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg">Back to Dashboard</span>
        </button>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            {initialData ? 'Update Room Details' : 'Create New Room'}
          </h1>
          <p className="text-xl opacity-80 max-w-2xl">
            Provide comprehensive details about your accommodation to give guests the perfect picture of what to expect.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Details Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Home className="text-blue mr-4" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Basic Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Room Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                  required
                  placeholder="e.g. Deluxe Suite, Standard Room"
                />
              </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Price per Night</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-xl text-gray-500">MAD</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        placeholder='0'
                        onChange={handleChange}
                        className="w-full pl-16 pr-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                


              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Room Size</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={formData.size.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        size: { ...prev.size, value: Number(e.target.value) },
                      }))
                    }
                    className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                    required
                    min="0"
                    placeholder="Size"
                  />
                  <select
                    value={formData.size.unit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        size: {
                          ...prev.size,
                          unit: e.target.value,
                        },
                      }))
                    }
                    className="w-32 px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                  >
                    <option value="sq_m">m²</option>
                    <option value="sq_ft">ft²</option>
                  </select>
                </div>
              </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Room Number/Title</label>
                    <input
                      type="text"
                      name="roomTitle"
                      value={formData.roomTitle || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          roomTitle: e.target.value
                        }))
                      }
                      className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                      placeholder="e.g. 101, 203, Suite A"
                    />
                  </div>
                 

            </div>

            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                rows={4}
                required
                placeholder="Describe the room and its unique features..."
              />
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Layout className="text-blue mr-4" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Room Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-4">View Types</label>
                <div className="flex flex-wrap gap-3">
                  {VIEW_TYPES.map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => toggleView(view)}
                      className={`px-4 py-2 rounded-full text-md font-medium transition-all hover:scale-105 ${formData.view.includes(view)
                        ? 'bg-blue text-white shadow-md'
                        : 'bg-gray-200 border border-black text-gray-900 '
                        }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-700 mb-4">Room Features</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderRoomFeatures()}
              </div>
            </div>
          </div>

          {/* Beds Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Users className="text-blue mr-4" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Beds & Capacity</h2>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Add Beds</label>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Bed Type Selection */}
                <select
                  value={formData.tempBed?.type || 'Single Bed'}
                  onChange={(e) => {
                    const newType = e.target.value;
                    // Update only the tempBed field, not the actual beds array
                    setFormData((prev) => ({
                      ...prev,
                      tempBed: {
                        type: newType,
                        count: prev.tempBed?.count || 1
                      }
                    }));
                  }}
                  className="flex-grow px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                >
                  {BED_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {/* Bed Count Input with +/- buttons */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const currentCount = formData.tempBed?.count || 1;
                      if (currentCount > 1) {
                        setFormData((prev) => ({
                          ...prev,
                          tempBed: {
                            type: prev.tempBed?.type || 'Single Bed',
                            count: currentCount - 1
                          }
                        }));
                      }
                    }}
                    className="px-3 py-3 bg-gray-200 text-gray-800 rounded-l-lg hover:bg-gray-300 transition flex items-center justify-center"
                    disabled={formData.tempBed?.count <= 1}
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    value={formData.tempBed?.count || 1}
                    onChange={(e) => {
                      try {
                        const newCount = Math.max(1, Number(e.target.value) || 1);
                        setFormData((prev) => ({
                          ...prev,
                          tempBed: {
                            type: prev.tempBed?.type || 'Single Bed',
                            count: newCount
                          }
                        }));
                      } catch (error) {
                        console.error("Error updating bed count:", error);
                        // Keep previous value in case of error
                      }
                    }}
                    className="w-14 px-2 py-3 text-lg text-center border-y-2 border-gray-300 focus:outline-none focus:border-blue focus:ring focus:ring-blue transition"
                    min="1"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const currentCount = formData.tempBed?.count || 1;
                      setFormData((prev) => ({
                        ...prev,
                        tempBed: {
                          type: prev.tempBed?.type || 'Single Bed',
                          count: currentCount + 1
                        }
                      }));
                    }}
                    className="px-3 py-3 bg-gray-200 text-gray-800 rounded-r-lg hover:bg-gray-300 transition flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add Bed Button */}
                <button
                  type="button"
                  onClick={() => {
                    try {
                      // Check if we have a valid tempBed
                      if (!formData.tempBed) {
                        // Initialize with defaults if tempBed doesn't exist
                        const newBed = { type: 'Single Bed', count: 1 };
                        setFormData((prev) => ({
                          ...prev,
                          beds: [...prev.beds, newBed],
                          tempBed: { ...newBed } // Keep a copy in tempBed
                        }));
                        return;
                      }

                      // Check if this bed type already exists
                      const existingBedIndex = formData.beds.findIndex(
                        bed => bed.type === formData.tempBed.type
                      );

                      if (existingBedIndex >= 0) {
                        // Update existing bed count
                        setFormData((prev) => {
                          const updatedBeds = [...prev.beds];
                          updatedBeds[existingBedIndex] = {
                            ...updatedBeds[existingBedIndex],
                            count: updatedBeds[existingBedIndex].count + prev.tempBed.count
                          };
                          return {
                            ...prev,
                            beds: updatedBeds
                          };
                        });
                      } else {
                        // Add new bed
                        setFormData((prev) => ({
                          ...prev,
                          beds: [...prev.beds, { ...prev.tempBed }]
                        }));
                      }
                    } catch (error) {
                      console.error("Error adding bed:", error);
                    }
                  }}
                  className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span>Add</span>
                </button>
              </div>

              {/* Current Beds Display */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Current Beds</h3>
                {!formData.beds || formData.beds.length === 0 ? (
                  <p className="text-gray-500">No beds added yet</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {formData.beds.map((bed, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-md bg-white border-2 border-gray-200 shadow-sm"
                      >
                        {bed.count}x {bed.type}
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const newBeds = [...formData.beds];
                              newBeds.splice(index, 1);
                              setFormData((prev) => ({
                                ...prev,
                                beds: newBeds
                              }));
                            } catch (error) {
                              console.error("Error removing bed:", error);
                            }
                          }}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X size={18} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* bathrooms*/}
          

              <>

                <BathroomAmenitiesSelector
                  bathrooms={formData.bathrooms}
                  onBathroomsChange={(bathrooms) => setFormData(prev => ({
                    ...prev,
                    bathrooms
                  }))}
                />

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <Droplet className="text-blue mr-4" size={28} />
                    <h2 className="text-2xl font-bold text-gray-800">Categorized Amenities</h2>
                  </div>

                  <div className="space-y-8">
                    {AMENITY_CATEGORIES.map(category => (
                      <div key={category} className="border-2 border-gray-100 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-blue">
                              {categoryIcons[category]}
                            </span>
                            <span className="font-medium text-lg">{category}</span>
                          </div>
                          <span>{expandedCategories[category] ? '−' : '+'}</span>
                        </button>

                        {expandedCategories[category] && (
                          <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {AMENITIES.filter(amenity => amenity.category === category).map(amenity => (
                                <div
                                  key={amenity.id}
                                  onClick={() => toggleAmenity(amenity.id, category)}
                                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${isAmenitySelected(amenity.id, category)
                                    ? 'border-blue bg-blue/10'
                                    : 'border-gray-200 hover:border-blue'
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isAmenitySelected(amenity.id, category)}
                                    onChange={() => { }}
                                    className="h-5 w-5 text-blue focus:ring-blue border-gray-300 rounded mr-2"
                                  />
                                  {amenity.icon && <amenity.icon className="mr-2 text-gray-600" size={20} />}
                                  <label className="text-md cursor-pointer select-none">
                                    {amenity.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Amenities Card */}
                {/* <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <Droplet className="text-blue mr-4" size={28} />
                    <h2 className="text-2xl font-bold text-gray-800">Custom Amenities</h2>
                  </div>

                  <div>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => setAmenity(e.target.value)}
                        className="flex-grow px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                        placeholder="Add a custom amenity"
                      />
                      <button
                        type="button"
                        onClick={addAmenity}
                        className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue transition flex items-center gap-2"
                      >
                        <Plus size={20} />
                        <span>Add</span>
                      </button>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Current Custom Amenities</h3>
                      {formData.amenities.length === 0 ? (
                        <p className="text-gray-500">No custom amenities added yet</p>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-3">
                          {formData.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-4 py-2 rounded-lg text-md bg-white border-2 border-gray-200 shadow-sm"
                            >
                              {amenity}
                              <button
                                type="button"
                                onClick={() => removeAmenity(index)}
                                className="ml-2 text-gray-500 hover:text-red-500"
                              >
                                <X size={18} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}

                {/* Add error display */}
                {/* {Object.keys(errors).length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {Object.values(errors).map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )} */}
              </>

 

          {/* Categorized Amenities Card */}


          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="mr-4 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary transition"
            >
              {initialData ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default RoomForm;
