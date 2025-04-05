import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faPaw,
  faParking,
  faKitchenSet,
  faWifi,
  faHouse,
  faBuilding,
  faHotel,
  faBolt,
  faMagnifyingGlass,
  faTrophy,
  faStar,
  faHotTub,
  faHome,
  faTv,
  faSnowflake,
  faFire,
  faBriefcase,
  faSwimmingPool,
  faCoffee,
  faUmbrellaBeach,
  faWheelchair,
  faWater,
  faHouseFlag,
  faArrowUpFromWaterPump,
} from '@fortawesome/free-solid-svg-icons';
import {
  setPriceRange,
  toggleAmenity,
  toggleBookingOption,
  toggleExceptionalProperty,
  togglePropertyType,
  clearFilters,
} from '../redux/hotelsSlice';

const languages = [
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'Anglais' },
  { id: 'es', label: 'Espagnol' },
  { id: 'de', label: 'Allemand' },
  { id: 'it', label: 'Italien' },
  { id: 'pt', label: 'Portugais' },
  { id: 'nl', label: 'Néerlandais' },
  { id: 'zh', label: 'Chinois' },
  { id: 'ar', label: 'Arabe' },
  { id: 'ko', label: 'Coréen' },
  { id: 'ja', label: 'Japonais' },
];

export const FilterModule = ({ onClose }) => {
  const dispatch = useDispatch();
  const { filters, filteredHotels } = useSelector((state) => state.hotels);
  
  const MIN_PRICE = 0;
  const MAX_PRICE = 2000;
  const STEP = 10;
  const MIN_GAP = 300;

  const handlePriceChange = (value, type) => {
    const newValue = Math.max(MIN_PRICE, Math.min(parseInt(value), MAX_PRICE));
    const currentRange = filters.priceRange;
    
    let newRange;
    if (type === 'min') {
      newRange = {
        min: Math.min(newValue, currentRange.max - MIN_GAP),
        max: currentRange.max
      };
    } else {
      newRange = {
        min: currentRange.min,
        max: Math.max(newValue, currentRange.min + MIN_GAP)
      };
    }
    
    dispatch(setPriceRange(newRange));
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

  const recommendations = [
    { id: 'rec-pets', label: 'Animaux de compagnie', icon: faPaw },
    { id: 'rec-jacuzzi', label: 'Jacuzzi', icon: faHotTub },
    { id: 'rec-parking', label: 'Parking gratuit', icon: faParking },
    { id: 'rec-kitchen', label: 'Cuisine', icon: faKitchenSet }
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
        { id: 'wifi', label: 'Wifi', icon: faWifi },
        { id: 'tv', label: 'Télévision', icon: faTv },
        { id: 'ac', label: 'Climatisation', icon: faSnowflake },
        { id: 'heating', label: 'Chauffage', icon: faFire },
        { id: 'washer', label: 'Lave-linge', icon: faWater },
      ]
    },
    {
      title: "Produits et services de base",
      items: [
        { id: 'kitchen', label: 'Cuisine', icon: faWater },
        { id: 'dryer', label: 'Sèche-linge', icon: faWater },
        { id: 'workspace', label: 'Espace de travail dédié', icon: faBriefcase },
        { id: 'hairdryer', label: 'Sèche-cheveux', icon: faWater },
      ]
    },
    {
      title: "Caractéristiques",
      items: [
        { id: 'pool', label: 'Piscine', icon: faSwimmingPool },
        { id: 'jacuzzi', label: 'Jacuzzi', icon: faHotTub },
        { id: 'parking', label: 'Parking gratuit', icon: faParking },
        { id: 'ev-charging', label: 'Station de recharge pour véhicules électriques', icon: faWater },
        { id: 'gym', label: 'Salle de sport', icon: faWater },
        { id: 'bbq', label: 'Barbecue', icon: faWater },
        { id: 'breakfast', label: 'Petit-déjeuner', icon: faCoffee },
      ]
    },
    {
      title: "Emplacement",
      items: [
        { id: 'beachfront', label: 'Bord de mer', icon: faUmbrellaBeach },
        { id: 'waterfront', label: 'Front de mer', icon: faWater },
        { id: 'ski-access', label: 'Accessible à ski', icon: faWheelchair },
      ]
    },
    {
      title: "Sécurité",
      items: [
        { id: 'smoke-detector', label: 'Détecteur de fumée', icon: faWater },
        { id: 'carbon-detector', label: 'Détecteur de monoxyde de carbone', icon: faWater },
      ]
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl max-w-[480px] w-full max-h-[90vh] shadow-xl animate-slide-scale">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
          <span className="font-semibold">Filtres</span>
          <div className="w-8" /> 
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {/* Recommendations */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Recommandations</h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map(rec => (
                <button
                  key={rec.id}
                  onClick={() => handleAmenityToggle(rec.id)}
                  className={`p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                    filters.amenities[rec.id] ? 'bg-black text-white' : 'hover:border-black'
                  }`}
                >
                  <FontAwesomeIcon icon={rec.icon} />
                  <span>{rec.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Price Range Section */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Fourchette de prix</h3>
            <div className="text-sm text-gray-500 mb-4">Prix par nuit · frais et taxes compris</div>
            
            <div className="px-4 space-y-6">
              {/* Price Range Slider */}
              <div className="relative h-24 bg-gray-100">
                <div className="absolute inset-0 flex items-end">
                  {[...Array(30)].map((_, i) => {
                    const price = (i + 1) * (2000 / 30);
                    const isInRange = price >= filters.priceRange.min && price <= filters.priceRange.max;
                    return (
                      <div
                        key={i}
                        className="flex-1 mx-[1px] transition-colors duration-200"
                        style={{
                          height: `${20 + Math.random() * 50}%`,
                          backgroundColor: isInRange ? '#111112' : '#DDDDDD'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Range Inputs */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE - MIN_GAP}
                  step={STEP}
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange(e.target.value, 'min')}
                  className="absolute cursor-pointer inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                />
                <input
                  type="range"
                  min={MIN_PRICE + MIN_GAP}
                  max={MAX_PRICE}
                  step={STEP}
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange(e.target.value, 'max')}
                  className="absolute cursor-pointer inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                />
              </div>

              {/* Price Display */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-500">Minimum</label>
                  <div className="mt-1 border rounded-lg p-2">
                    MAD {filters.priceRange.min}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-500">Maximum</label>
                  <div className="mt-1 border rounded-lg p-2">
                    MAD {filters.priceRange.max}
                  </div>
                </div>
              </div>
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
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}

          {/* Booking Options */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Options de réservation</h3>
            <div className="space-y-4">
              {['instant-book', 'self-checkin'].map(option => (
                <button 
                  key={option}
                  onClick={() => handleBookingOptionToggle(option)}
                  className={`w-full p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                    filters.bookingOptions[option] ? 'bg-black text-white' : 'hover:border-black'
                  }`}
                >
                  <FontAwesomeIcon icon={option === 'instant-book' ? faBolt : faMagnifyingGlass} />
                  <div className="text-left">
                    <div>{option === 'instant-book' ? 'Réservation instantanée' : 'Arrivée autonome'}</div>
                    {option === 'instant-book' && (
                      <div className={`text-sm ${filters.bookingOptions[option] ? 'text-white' : 'text-gray-500'}`}>
                        Réservez sans attendre de validation
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Exceptional Properties */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Logements exceptionnels</h3>
            <div className="grid grid-cols-2 gap-3">
              {['top-rated', 'luxe'].map(property => (
                <button 
                  key={property}
                  onClick={() => handleExceptionalPropertyToggle(property)}
                  className={`p-4 border rounded-xl transition-colors ${
                    filters.exceptionalProperties[property] ? 'bg-black text-white' : 'hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={property === 'top-rated' ? faTrophy : faStar} />
                    <span className="font-medium">
                      {property === 'top-rated' ? 'Coup de cœur voyageurs' : 'Luxe'}
                    </span>
                  </div>
                  <span className={`text-sm ${
                    filters.exceptionalProperties[property] ? 'text-white' : 'text-gray-500'
                  }`}>
                    {property === 'top-rated' 
                      ? 'Les logements les plus appréciés sur Airbnb'
                      : 'Une sélection de logements exceptionnels'
                    }
                  </span>
                </button>
              ))}
            </div>
          </section>
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