import React, { useContext, useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Header } from '../../components/Header';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Listitem } from './listItem/Listitem';
import { useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import BlurListItem from './listItem/BlurListItem';
import { SearchContext } from '../../contextApi/SearchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faArrowUpFromWaterPump, faHotel, faHouse, faHouseFlag, faStar, faSwimmingPool, faWifi, faCar, faUtensils, faSliders } from '@fortawesome/free-solid-svg-icons';
import { FilterModule } from '../../components/FilterModule';

export const List = () => {
  const [initialData, setInitialData] = useState([]);

  const { city } = useContext(SearchContext);
  const [chooseType, setChooseType] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({
    type: null,
    bedrooms: null,
    beds: null,
    bathrooms: null,
    amenities: [],
    price: 'default'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [displayMode, setDisplayMode] = useState('mosaic');
  const handleChooseType = (type) => {
    setChooseType((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const amenitiesList = [
    { name: 'Wifi', icon: faWifi },
    { name: 'Piscine', icon: faSwimmingPool },
    { name: 'Parking', icon: faCar },
    { name: 'Restaurant', icon: faUtensils },
  ];

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      price: value
    }));
    setCurrentPage(1);
  };
  // const professionalHotelData = {
  //   id: "h123456",
  //   name: "Le Grand Hôtel & Spa",
  //   stars: 5,
  //   rating: 9.2,
  //   reviews: 584,
  //   cheapestPrice: 500,
  //   address: {
  //     street: "123 Avenue de la Mer",
  //     city: "Tanger",
  //     country: "Maroc",
  //     zipCode: "90000",
  //     coordinates: {
  //       latitude: 35.7595,
  //       longitude: -5.8340
  //     }
  //   },
  //   photos: [
  //     {
  //       id: 1,
  //       url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  //       caption: "Façade de l'hôtel",
  //       category: "exterior"
  //     },
  //     {
  //       id: 2,
  //       url: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
  //       caption: "Lobby",
  //       category: "interior"
  //     },
  //     {
  //       id: 3,
  //       url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
  //       caption: "Piscine",
  //       category: "amenities"
  //     },
  //     {
  //       id: 4,
  //       url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  //       caption: "Restaurant",
  //       category: "dining"
  //     },
  //     {
  //       id: 5,
  //       url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
  //       caption: "Suite Deluxe",
  //       category: "rooms"
  //     },
  //     {
  //       id: 6,
  //       url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  //       caption: "Spa",
  //       category: "wellness"
  //     },
  //     {
  //       id: 7,
  //       url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  //       caption: "Terrasse",
  //       category: "exterior"
  //     },
  //     {
  //       id: 8,
  //       url: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f",
  //       caption: "Bar",
  //       category: "dining"
  //     }
  //   ],
  
  //   rooms: [
  //     'hroom45455',
  //     'hroom45456',
  //     'hroom45457',
  //     'hroom45458',
  //     'hroom45459',
  //   ],
   
  //   amenities: {
  //     general: [
  //       "WiFi gratuit",
  //       "Parking sécurisé",
  //       "Réception 24/7",
  //       "Conciergerie"
  //     ],
  //     wellness: [
  //       "Spa",
  //       "Salle de sport",
  //       "Piscine extérieure chauffée",
  //       "Hammam traditionnel"
  //     ],
  //     dining: [
  //       "Restaurant gastronomique",
  //       "Bar-lounge",
  //       "Service en chambre 24/7",
  //       "Petit-déjeuner buffet"
  //     ]
  //   },
  //   areaInfo: {
  //     nearbyPlaces: [
  //       { name: "Forbes Museum of Tangier", distance: "850 m" },
  //       { name: "Jardin de la Mendoubia", distance: "1.9 km" },
  //       { name: "Dar el Makhzen", distance: "1.9 km" },
  //       { name: "Kasbah Museum", distance: "2 km" },
  //       { name: "American Legation Museum", distance: "2.3 km" },
  //       { name: "Place Ain Ktiouet", distance: "2.4 km" },
  //       { name: "Parc Perdicaris", distance: "3.7 km" },
  //       { name: "Cape Malabata", distance: "12 km" }
  //     ],
  //     restaurants: [
  //       { name: "Cafe De Parque", type: "Cafe/Bar", distance: "1.2 km" },
  //       { name: "Cafe Hanafta", type: "Cafe/Bar", distance: "1.2 km" },
  //       { name: "Salon de the", type: "Cafe/Bar", distance: "1.2 km" }
  //     ],
  //     publicTransit: [
  //       { name: "Tanger Ville", type: "Train", distance: "5 km" },
  //       { name: "TGV Depot", type: "Train", distance: "7 km" }
  //     ],
  //     beaches: [
  //       { name: "Tangier Municipal Beach", distance: "3.2 km" },
  //       { name: "Malabata", distance: "5 km" },
  //       { name: "Plage Ghandouri", distance: "6 km" },
  //       { name: "Plage Mrisat", distance: "8 km" }
  //     ],
  //     airports: [
  //       { name: "Tangier Ibn Battuta Airport", distance: "11 km" },
  //       { name: "Sania Ramel Airport", distance: "66 km" },
  //       { name: "Ceuta Heliport", distance: "78 km" }
  //     ]
  //   },
  //   rules : {
  //     TIMING: {
  //       CHECK_IN: {
  //         timeRange: {
  //           from: "13:00",
  //           to: "18:00"
  //         },
  //       },
  //       CHECK_OUT: {
  //         timeRange: {
  //           from: "10:00",
  //           to: "12:00"
  //         },
  //       }
  //     },
  //     POLICIES: {
  //       DAMAGE: {
  //         maxAmount: 150,
  //       }
  //     },
  //     GUESTS: {
  //       CHILDREN: {
  //         isAllowed: true,
  //       },
  //       AGE_RESTRICTION: {
  //         minimumAge: null
  //       }
  //     },
  //     RESTRICTIONS: {
  //       PETS: {
  //         isAllowed: false
  //       },
  //       PARTIES: {
  //         isAllowed: false
  //       }
  //     }
  //   }
  // };

  const { data, loading, error, reFetch } = useFetch(`/api/hotels?city=${city}`);

  const location = useLocation();

  useEffect(() => {
    if (data) {
      setInitialData(data);
      const filtered = applyFilters(data);
      setFilteredData(filtered);
    }
  }, [data, reFetch]);

  useEffect(() => {
    reFetch();
  }, [location]);

  const [filteredData, setFilteredData] = useState([]);

  const applyFilters = (data) => {
    if (!data) return [];
    
    return data.filter(hotel => {
      if (chooseType.length > 0 && !chooseType.includes(hotel.basicInfo.type)) {
        return false;
      }

      if (filters.bedrooms && hotel.bedrooms !== parseInt(filters.bedrooms)) {
        return false;
      }

      if (filters.beds && hotel.beds !== parseInt(filters.beds)) {
        return false;
      }

      if (filters.bathrooms && hotel.bathrooms !== parseInt(filters.bathrooms)) {
        return false;
      }

      if (filters.amenities?.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          hotel.amenities[amenity.toLowerCase()] === true
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.price === 'asc') {
        return a.basePrice - b.basePrice;
      } else if (filters.price === 'desc') {
        return b.basePrice - a.basePrice;
      }
      return 0;
    });
  };

  useEffect(() => {
    const filtered = applyFilters(initialData);
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [chooseType, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    setShowFilters(false);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDisplayMode = (mode) => {
    setDisplayMode(mode);
  };

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div className='bg-blue/30 min-h-screen'>
      <Navbar />
      <Header type="list " />
      <div className="flex flex-col items-center justify-center  w-full">
        <div className="container w-full px-2 sm:px-4">
          <div className="sticky top-0 bg-primary/80 rounded z-10">
            <div className="rounded-lg shadow-sm p-2  mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                    <button
                      onClick={() => toggleDisplayMode('list')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                        ${displayMode === 'list' 
                          ? 'bg-black text-white' 
                          : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Liste
                    </button>
                    <button
                      onClick={() => toggleDisplayMode('mosaic')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                        ${displayMode === 'mosaic' 
                          ? 'bg-black text-white' 
                          : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Mosaïque
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 sm:gap-4 w-full md:w-auto">
                  <div className="flex flex-row gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 max-w-[calc(100%-100px)]">
                    {[
                      { type: 'house', icon: faHouse, label: 'Maison' },
                      { type: 'guesthouse', icon: faHouseFlag, label: 'Gîte' },
                      { type: 'hotel', icon: faHotel, label: 'Hôtel' },
                      { type: 'villa', icon: faArrowUpFromWaterPump, label: 'Villa' },
                    ].map(({ type, icon, label }) => (
                      <button
                        key={type}
                        className={`
                          transition-all duration-200 ease-in-out
                          border px-2 sm:px-4 py-1.5 rounded-lg border-gray-200
                          
                          cursor-pointer flex items-center gap-1.5
                          text-[6px] sm:text-base flex-shrink-0
                          justify-center w-[90px] sm:w-[110px]
                          ${chooseType.includes(type) 
                            ? 'bg-black text-white border-black hover:bg-black/90' 
                            : 'bg-transparent text-gray-100'}
                        `}
                        onClick={() => handleChooseType(type)}
                      >
                        <FontAwesomeIcon icon={icon} className="text-base sm:text-lg" />
                        <span className="whitespace-nowrap">{label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setShowFilters(true)}
                    className="transition-all duration-200 ease-in-out border px-4 py-2 rounded-lg cursor-pointer 
                      hover:bg-gray-50 flex items-center gap-2 justify-center flex-shrink-0
                      border-gray-200 text-gray-700 text-sm sm:text-base bg-white min-w-[90px]"
                  >
                    <FontAwesomeIcon icon={faSliders} className="text-lg" />
                    <span>Filtres</span>
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <FilterModule
                onClose={() => setShowFilters(false)}
                data={initialData}
                setFilteredData={setFilteredData}
              />
            )}
          </div>

          <div className={`
            ${displayMode === 'mosaic' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' 
              : 'space-y-4'
            }
          `}>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <BlurListItem key={index} />
              ))
            ) : (
              <>
                {currentItems.map((hotel) => (
                  <>
                    <Listitem key={hotel.id} hotel={hotel} displayMode={displayMode} />
                  </>
                ))} 
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6 pb-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 
                          ${currentPage === pageNumber 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-blue-50'
                          } border border-gray-200`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
