import React, { useState, useEffect } from 'react';
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

export const FilterModule = ({ onClose, data, setFilteredData }) => {
  const MIN_PRICE = 0;
  const MAX_PRICE = 2000;
  const STEP = 10;
  const MIN_GAP = 300;  // Minimum gap between min and max values

  const [heightt, setHeightt] = useState();

  const [filters, setFilters] = useState({
    priceRange: { min: 200, max: 2000 },
   
    recommendations: [
      { id: "rec-pets", state: false },
      { id: "rec-jacuzzi", state: false },
      { id: "rec-parking", state: false },
      { id: "rec-kitchen", state: false }
    ],
    amenities: [
      { id: 'wifi', state: false },
      { id: 'tv', state: false },
      { id: 'ac', state: false },
      { id: 'heating', state: false },
      { id: 'washer', state: false },
      { id: 'kitchen', state: false },
      { id: 'dryer', state: false },
      { id: 'workspace', state: false },
      { id: 'hairdryer', state: false },
      { id: 'pool', state: false },
      { id: 'jacuzzi', state: false },
      { id: 'parking', state: false },
      { id: 'ev-charging', state: false },
      { id: 'gym', state: false },
      { id: 'bbq', state: false },
      { id: 'breakfast', state: false },
      { id: 'beachfront', state: false },
      { id: 'waterfront', state: false },
      { id: 'ski-access', state: false },
      { id: 'smoke-detector', state: false },
      { id: 'carbon-detector', state: false }
    ],
    languages: {},
    bookingOptions: [
      { id: 'instant-book', state: false },
      { id: 'self-checkin', state: false }
    ],
    exceptionalProperties: [
      { id: 'top-rated', state: false },
      { id: 'luxe', state: false }
    ],
    propertyTypes: [
      { id: 'house', state: false },
      { id: 'guesthouse', state: false },
      { id: 'hotel', state: false },
      { id: 'villa', state: false }
    ]
  });

  const handlePriceChange = (value, type) => {
    const newValue = Math.max(MIN_PRICE, Math.min(parseInt(value), MAX_PRICE));
    
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: type === 'min' 
          ? Math.min(newValue, prev.priceRange.max - MIN_GAP)  // Ensure min is at least MIN_GAP less than max
          : Math.max(newValue, prev.priceRange.min + MIN_GAP)  // Ensure max is at least MIN_GAP more than min
      }
    }));
  };

  const handleRecommendationToggle = (id) => {
    setFilters(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(item =>
        item.id === id ? { ...item, state: !item.state } : item
      )
    }));
  };

  const handleRandomHeightPrice = ()=>{
    const heightt =  20 + Math.random() * 50
    return heightt
  }

  useEffect(()=>{
    handleRandomHeightPrice()
    
  }, [])
  
  
  const handleAmenityToggle = (id) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.map(item =>
        item.id === id ? { ...item, state: !item.state } : item
      )
    }));
  };

  const handleBookingOptionToggle = (id) => {
    setFilters(prev => ({
      ...prev,
      bookingOptions: prev.bookingOptions.map(item =>
        item.id === id ? { ...item, state: !item.state } : item
      )
    }));
  };

  const handleExceptionalPropertyToggle = (id) => {
    setFilters(prev => ({
      ...prev,
      exceptionalProperties: prev.exceptionalProperties.map(item =>
        item.id === id ? { ...item, state: !item.state } : item
      )
    }));
  };

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min: 200, max: 2000 },
      rooms: { bedrooms: 0, beds: 0, bathrooms: 0 },
      recommendations: prev.recommendations.map(rec => ({ ...rec, state: false })),
      amenities: prev.amenities.map(amenity => ({ ...amenity, state: false })),
      languages: {},
      bookingOptions: prev.bookingOptions.map(option => ({ ...option, state: false })),
      exceptionalProperties: prev.exceptionalProperties.map(prop => ({ ...prop, state: false })),
      propertyTypes: prev.propertyTypes.map(type => ({ ...type, state: false }))
    }));
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

  // Add function to count filtered results
  const getFilteredCount = () => {
    if (!data) return 0;
    
    return data.filter(hotel => {
      // Price range filter
      const price = hotel.basePrice;
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }

      // Rooms filter
      if (filters.rooms.bedrooms > 0 && hotel.bedrooms !== filters.rooms.bedrooms) {
        return false;
      }
      if (filters.rooms.beds > 0 && hotel.beds !== filters.rooms.beds) {
        return false;
      }
      if (filters.rooms.bathrooms > 0 && hotel.bathrooms !== filters.rooms.bathrooms) {
        return false;
      }

      // Amenities filter
      const selectedAmenities = filters.amenities.filter(amenity => amenity.state).map(amenity => amenity.id);
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenity => 
          hotel.amenities && hotel.amenities[amenity]
        );
        if (!hasAllAmenities) return false;
      }

      // Property type filter
      const selectedTypes = filters.propertyTypes.filter(type => type.state).map(type => type.id);
      if (selectedTypes.length > 0 && !selectedTypes.includes(hotel.basicInfo.type)) {
        return false;
      }

      return true;
    }).length;
  };

  // Add state for filtered count
  const [filteredCount, setFilteredCount] = useState(0);

  // Update count when filters change
  useEffect(() => {
    const count = getFilteredCount();
    setFilteredCount(count);
  }, [filters]);

  // Modify the footer section only
  const footerSection = (
    <div className="sticky bottom-0 border-t p-4 flex justify-between items-center bg-white rounded-b-2xl z-50">
      <button 
        onClick={clearFilters}
        className="text-sm font-semibold underline"
      >
        Tout effacer
      </button>
      <button 
        onClick={() => {
          // Apply filters and close modal
          const filteredResults = data.filter(hotel => {
            // Same filtering logic as getFilteredCount
            const price = hotel.basePrice;
            if (price < filters.priceRange.min || price > filters.priceRange.max) {
              return false;
            }

            if (filters.rooms.bedrooms > 0 && hotel.bedrooms !== filters.rooms.bedrooms) {
              return false;
            }
            if (filters.rooms.beds > 0 && hotel.beds !== filters.rooms.beds) {
              return false;
            }
            if (filters.rooms.bathrooms > 0 && hotel.bathrooms !== filters.rooms.bathrooms) {
              return false;
            }

            const selectedAmenities = filters.amenities.filter(amenity => amenity.state).map(amenity => amenity.id);
            if (selectedAmenities.length > 0) {
              const hasAllAmenities = selectedAmenities.every(amenity => 
                hotel.amenities && hotel.amenities[amenity]
              );
              if (!hasAllAmenities) return false;
            }

            // Property type filter
            const selectedTypes = filters.propertyTypes.filter(type => type.state).map(type => type.id);
            if (selectedTypes.length > 0 && !selectedTypes.includes(hotel.basicInfo.type)) {
              return false;
            }

            return true;
          });
          
          setFilteredData(filteredResults);
          onClose();
        }}
        className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-black/90 transition-colors"
      >
        Afficher {filteredCount} logements
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50" >
      <div className="bg-white rounded-2xl max-w-[480px] w-full max-h-[90vh] shadow-xl">
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
          {/* Recommendations - Now at the top */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Recommandations</h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map(rec => {
                const isSelected = filters.recommendations.find(item => item.id === rec.id)?.state;
                return (
                  <button
                    key={rec.id}
                    onClick={() => handleRecommendationToggle(rec.id)}
                    className={`p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                      isSelected ? 'bg-black text-white' : 'hover:border-black'
                    }`}
                  >
                    <FontAwesomeIcon icon={rec.icon} />
                    <span>{rec.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Price Range */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Fourchette de prix</h3>
            <div className="text-sm text-gray-500 mb-4">Prix par nuit · frais et taxes compris</div>
            
            <div className="px-4 space-y-6">
              {/* Graph Visualization */}
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
                          height: '40%',
                          // `${20+ Math.random() * 50}%`, 
                          backgroundColor: isInRange ? '#111112' : '#DDDDDD'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Range Sliders */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE - MIN_GAP}  // Adjust max for min slider
                  step={STEP}
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange(e.target.value, 'min')}
                  className="absolute cursor-pointer inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                />
                <input
                  type="range"
                  min={MIN_PRICE + MIN_GAP}  // Adjust min for max slider
                  max={MAX_PRICE}
                  step={STEP}
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange(e.target.value, 'max')}
                  className="absolute cursor-pointer inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                />
              </div>

              {/* Price Inputs */}
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

         

          {/* Amenity Categories */}
          {amenityCategories.map(category => (
            <section key={category.title} className="p-4 border-b">
              <h3 className="text-lg mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map(item => {
                  const isSelected = filters.amenities.find(amenity => amenity.id === item.id)?.state;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleAmenityToggle(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${
                        isSelected ? 'bg-black text-white' : 'hover:border-black'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-lg" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Booking Options */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Options de réservation</h3>
            <div className="space-y-4">
              <button 
                onClick={() => handleBookingOptionToggle('instant-book')}
                className={`w-full p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                  filters.bookingOptions.find(opt => opt.id === 'instant-book')?.state 
                    ? 'bg-black text-white' 
                    : 'hover:border-black'
                }`}
              >
                <FontAwesomeIcon icon={faBolt} />
                <div className="text-left">
                  <div>Réservation instantanée</div>
                  <div className={`text-sm ${filters.bookingOptions.find(opt => opt.id === 'instant-book')?.state ? 'text-white' : 'text-gray-500'}`}>
                    Réservez sans attendre de validation
                  </div>
                </div>
              </button>
              <button 
                onClick={() => handleBookingOptionToggle('self-checkin')}
                className={`w-full p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                  filters.bookingOptions.find(opt => opt.id === 'self-checkin')?.state 
                    ? 'bg-black text-white' 
                    : 'hover:border-black'
                }`}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <div className="text-left">
                  <div>Arrivée autonome</div>
                </div>
              </button>
            </div>
          </section>

          {/* Exceptional Properties */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Logements exceptionnels</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleExceptionalPropertyToggle('top-rated')}
                className={`p-4 border rounded-xl transition-colors ${
                  filters.exceptionalProperties.find(prop => prop.id === 'top-rated')?.state 
                    ? 'bg-black text-white' 
                    : 'hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FontAwesomeIcon icon={faTrophy} />
                  <span className="font-medium">Coup de cœur voyageurs</span>
                </div>
                <span className={`text-sm ${
                  filters.exceptionalProperties.find(prop => prop.id === 'top-rated')?.state 
                    ? 'text-white' 
                    : 'text-gray-500'
                }`}>
                  Les logements les plus appréciés sur Airbnb
                </span>
              </button>
              <button 
                onClick={() => handleExceptionalPropertyToggle('luxe')}
                className={`p-4 border rounded-xl transition-colors ${
                  filters.exceptionalProperties.find(prop => prop.id === 'luxe')?.state 
                    ? 'bg-black text-white' 
                    : 'hover:border-black'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FontAwesomeIcon icon={faStar} />
                  <span className="font-medium">Luxe</span>
                </div>
                <span className={`text-sm ${
                  filters.exceptionalProperties.find(prop => prop.id === 'luxe')?.state 
                    ? 'text-white' 
                    : 'text-gray-500'
                }`}>
                  Une sélection de logements exceptionnels
                </span>
              </button>
            </div>
          </section>

          {/* Language */}
          <section className="p-4 border-b">
            <h3 className="text-lg mb-4">Langue de l'hôte</h3>
            <div className="grid grid-cols-2 gap-3">
              {languages.map(language => (
                <label 
                  key={language.id} 
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span>{language.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        {footerSection}
      </div>
    </div>
  );
}; 