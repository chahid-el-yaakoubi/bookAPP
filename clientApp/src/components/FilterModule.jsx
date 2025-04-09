import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaTimes, FaPaw, FaParking, FaUtensils, FaWifi, FaHouseUser,
  FaBuilding, FaHotel, FaBolt, FaSearch, FaTrophy, FaStar,
  FaHotTub, FaHome, FaTv, FaSnowflake, FaFire, FaBriefcase,
  FaSwimmingPool, FaCoffee, FaUmbrellaBeach, FaWheelchair,
  FaWater, FaShower, FaLock, FaLockOpen,
  FaTshirt, FaTree, FaChair, FaDoorClosed, FaMountain,
  FaCamera
} from 'react-icons/fa';
import {
  // setSortByPrice,
  toggleAmenity,
  toggleBookingOption,
  toggleExceptionalProperty,
  togglePropertyType,
  clearFilters,
} from '../redux/hotelsSlice';
import { MdElevator } from 'react-icons/md';
import { Flag } from 'lucide-react';


export const FilterModule = ({ onClose }) => {
  const dispatch = useDispatch();
  const { filters, filteredHotels } = useSelector((state) => state.hotels);
  
  // Price sort options
  const priceSortOptions = [
    { id: 'default', label: 'Recommandé' },
    { id: 'low-to-high', label: 'Prix: croissant' },
    { id: 'high-to-low', label: 'Prix: décroissant' }
  ];

  const handlePriceSortChange = (sortOption) => {
    // dispatch(setSortByPrice(sortOption));
  };

  const handleAmenityToggle = (id) => {
    dispatch(toggleAmenity(id));
  };

  const handleBookingOptionToggle = (id) => {
    dispatch(toggleBookingOption(id));
  };

  const handleExceptionalPropertyToggle = (id) => {
    dispatch(toggleExceptionalProperty(id));
  };

  const handlePropertyTypeToggle = (id) => {
    dispatch(togglePropertyType(id));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const propertyTypes = [
    { id: 'hotel', label: 'Hôtel', icon: <FaHotel /> },
    { id: 'apartment', label: 'Appartement', icon: <FaBuilding /> },
    { id: 'resort', label: 'Resort', icon: <FaUmbrellaBeach /> },
    { id: 'villa', label: 'Villa', icon: <FaHome /> },
    { id: 'cabin', label: 'Cabane', icon: <FaMountain /> },
    { id: 'guesthouse', label: 'Maison d\'hôtes', icon: <FaHouseUser /> },
    { id: 'hostel', label: 'Auberge', icon: <Flag /> },
    { id: 'boutique', label: 'Boutique', icon: <FaChair /> }
  ];

 

  const roomTypes = [
    { id: 'room-bedrooms', label: 'Chambres' },
    { id: 'room-beds', label: 'Lits' },
    { id: 'room-bathrooms', label: 'Salles de bain' }
  ];

  const amenityCategories = [
    {
      title: "Très demandés",
      items: [
        { id: 'wifi', label: 'Wi-Fi / Internet', icon: <FaWifi /> },
        { id: 'tv', label: 'Télévision', icon: <FaTv /> },
        { id: 'ac', label: 'Climatisation', icon: <FaSnowflake /> },
        { id: 'heating', label: 'Chauffage', icon: <FaFire /> },
        { id: 'hot-water', label: 'Eau chaude', icon: <FaShower /> },
        { id: 'parking', label: 'Parking / Garage', icon: <FaParking /> },
      ]
    },
    {
      title: "Produits et services de base",
      items: [
        { id: 'kitchen', label: 'Cuisine', icon: <FaUtensils /> },
        { id: 'washer', label: 'Lave-linge', icon: <FaTshirt /> },
        { id: 'workspace', label: 'Espace de travail dédié', icon: <FaBriefcase /> },
        { id: 'elevator', label: 'Ascenseur', icon: <MdElevator /> },
      ]
    },
    {
      title: "Caractéristiques",
      items: [
        { id: 'garden', label: 'Jardin', icon: <FaTree /> },
        { id: 'pool', label: 'Piscine', icon: <FaSwimmingPool /> },
        { id: 'terrace', label: 'Terrasse / Balcon', icon: <FaChair /> },
        { id: 'jacuzzi', label: 'Jacuzzi', icon: <FaHotTub /> },
        { id: 'bbq', label: 'Barbecue', icon: <FaFire /> },
        { id: 'breakfast', label: 'Petit-déjeuner', icon: <FaCoffee /> },
      ]
    }, 
    {
      title: "Sécurité",
      items: [
        { id: 'smoke-detector', label: 'Détecteur de fumée', icon: <FaLockOpen /> },
        { id: 'carbon-detector', label: 'Détecteur de monoxyde de carbone', icon: <FaLock /> },
        { id: 'security', label: 'Sécurité 24h/24', icon: <FaLock /> },
        { id: 'camera', label: ' Camera', icon: <FaCamera /> },

      ]
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl max-w-[480px] w-full max-h-[90vh] shadow-xl animate-slide-scale">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-lg" />
          </button>
          <span className="font-semibold">Filtres</span>
          <div className="w-8" /> 
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {/* Property Types */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Type de logement</h3>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handlePropertyTypeToggle(type.id)}
                  className={`p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                    filters.propertyTypes[type.id] ? 'bg-black text-white' : 'hover:border-black'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Price Sort Section */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Tri par prix</h3>
            <div className="space-y-3">
              {priceSortOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handlePriceSortChange(option.id)}
                  className={`flex items-center justify-between w-full p-4 rounded-xl border transition-colors ${
                    filters.sortByPrice === option.id ? 'bg-black text-white' : 'hover:border-black'
                  }`}
                >
                  <span>{option.label}</span>
                  {filters.sortByPrice === option.id && (
                    <span className="h-4 w-4 rounded-full bg-white text-black flex items-center justify-center text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Amenities Sections */}
          {amenityCategories.map(category => (
            <section key={category.title} className="p-4 border-b">
              <h3 className="text-lg mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleAmenityToggle(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${
                      filters.amenities[item.id] ? 'bg-black text-white' : 'hover:border-black'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t p-4 flex justify-between items-center bg-white rounded-b-2xl">
          <button 
            onClick={handleClearFilters}
            className="text-sm font-semibold underline"
          >
            Tout effacer
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Afficher {filteredHotels.length} logements
          </button>
        </div>
      </div>
    </div>
  );
};