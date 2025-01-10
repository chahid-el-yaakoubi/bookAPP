import React, { useContext, useState, useRef, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Header } from '../../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faConciergeBell,
  faClipboardList,
  faFileAlt,
  faHome,
  faInfoCircle,
  faHandshake,
  faMosque,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import './Hotel.css';
import { useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { SearchContext } from '../../contextApi/SearchContext';
import { HotelBookingBox } from './componentHotel/HotelBookingBox';
import { HotelHeader } from './componentHotel/HotelHeader';
import { ImageGallery } from './componentHotel/ImageGallery';
import { AreaInfo } from './componentHotel/AreaInfo';
import { HotelFacilities } from './componentHotel/HotelFacilities';
import { HouseRules } from '../../components/HouseRules';
import Footer from '../../components/footer';
import { FAQ } from '../../components/FAQ';
import { FeaturedAmenities } from './componentHotel/FeaturedAmenities';
import { ContactOwnersModule } from '../../components/ContactOwnersModule';
import { HotelRooms } from './componentHotel/HotelRooms';
import { PageReload } from '../../components/pageRealod/pageRealod';
import Descriptions from './componentHotel/HotelDesc';
// import { hotelRoomsData } from '../../data/hotelRoomsData';



// Add this component for the navigation menu
const HotelNavMenu = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const navRef = useRef(null);


  // Enhanced menu items with icons
  const menuItems = [
    { label: "Aperçu", href: "#overview", icon: faHome },
    { label: "Info & Prix", href: "#info", icon: faInfoCircle },
    { label: "Localisation", href: "#area", icon: faLocationDot },
    { label: "Équipements", href: "#facilities", icon: faConciergeBell },
    { label: "Règlement", href: "#rules", icon: faClipboardList },
    { label: "Détails", href: "#print", icon: faFileAlt }
  ];

  // Enhanced scroll spy with Intersection Observer
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -80% 0px', // Adjust these values to control when sections become "active"
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    menuItems.forEach(item => {
      const element = document.getElementById(item.href.slice(1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Improved smooth scroll with offset calculation
  const handleClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (!element) return;

    const navHeight = navRef.current?.offsetHeight || 0;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20; // Added extra offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  return (
    <div ref={navRef} className="border-b sticky left-0 right-0 top-0 bg-primary z-50 shadow-md w-full">
      <nav className="w-full mx-auto">
        <ul className="flex items-center justify-between px-0 md:px-4 overflow-x-auto hide-scrollbar w-full">
          {menuItems.map((item, index) => (
            <li key={index} className="flex-shrink-0 min-w-fit">
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`
                  inline-flex items-center px-3 py-3 text-sm font-medium
                  transition-all duration-200 border-b-2 whitespace-nowrap
                  hover:text-blue hover:border-blue/50
                  ${activeSection === item.href.slice(1)
                    ? 'border-blue text-blue'
                    : 'border-transparent text-gray-100 hover:text-gray-300'}
                `}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Add the professional hotel data
const professionalHotelData = {
  id: "h123456",
  name: "Le Grand Hôtel & Spa",
  stars: 5,
  rating: 9.2,
  reviews: 584,
  cheapestPrice: 500,
  address: {
    street: "123 Avenue de la Mer",
    city: "Tanger",
    country: "Maroc",
    zipCode: "90000",
    coordinates: {
      latitude: 35.7595,
      longitude: -5.8340
    }
  },
  photos: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      caption: "Façade de l'hôtel",
      category: "exterior"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      caption: "Lobby",
      category: "interior"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
      caption: "Piscine",
      category: "amenities"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
      caption: "Restaurant",
      category: "dining"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      caption: "Suite Deluxe",
      category: "rooms"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      caption: "Spa",
      category: "wellness"
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      caption: "Terrasse",
      category: "exterior"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f",
      caption: "Bar",
      category: "dining"
    }
  ],

  rooms: [
    'hroom45455',
    'hroom45456',
    'hroom45457',
    'hroom45458',
    'hroom45459',
  ],
 
  amenities: {
    general: [
      "WiFi gratuit",
      "Parking sécurisé",
      "Réception 24/7",
      "Conciergerie"
    ],
    wellness: [
      "Spa",
      "Salle de sport",
      "Piscine extérieure chauffée",
      "Hammam traditionnel"
    ],
    dining: [
      "Restaurant gastronomique",
      "Bar-lounge",
      "Service en chambre 24/7",
      "Petit-déjeuner buffet"
    ]
  },
  areaInfo: {
    nearbyPlaces: [
      { name: "Forbes Museum of Tangier", distance: "850 m" },
      { name: "Jardin de la Mendoubia", distance: "1.9 km" },
      { name: "Dar el Makhzen", distance: "1.9 km" },
      { name: "Kasbah Museum", distance: "2 km" },
      { name: "American Legation Museum", distance: "2.3 km" },
      { name: "Place Ain Ktiouet", distance: "2.4 km" },
      { name: "Parc Perdicaris", distance: "3.7 km" },
      { name: "Cape Malabata", distance: "12 km" }
    ],
    restaurants: [
      { name: "Cafe De Parque", type: "Cafe/Bar", distance: "1.2 km" },
      { name: "Cafe Hanafta", type: "Cafe/Bar", distance: "1.2 km" },
      { name: "Salon de the", type: "Cafe/Bar", distance: "1.2 km" }
    ],
    publicTransit: [
      { name: "Tanger Ville", type: "Train", distance: "5 km" },
      { name: "TGV Depot", type: "Train", distance: "7 km" }
    ],
    beaches: [
      { name: "Tangier Municipal Beach", distance: "3.2 km" },
      { name: "Malabata", distance: "5 km" },
      { name: "Plage Ghandouri", distance: "6 km" },
      { name: "Plage Mrisat", distance: "8 km" }
    ],
    airports: [
      { name: "Tangier Ibn Battuta Airport", distance: "11 km" },
      { name: "Sania Ramel Airport", distance: "66 km" },
      { name: "Ceuta Heliport", distance: "78 km" }
    ]
  },
  rules : {
    TIMING: {
      CHECK_IN: {
        timeRange: {
          from: "13:00",
          to: "18:00"
        },
      },
      CHECK_OUT: {
        timeRange: {
          from: "10:00",
          to: "12:00"
        },
      }
    },
    POLICIES: {
      DAMAGE: {
        maxAmount: 150,
      }
    },
    GUESTS: {
      CHILDREN: {
        isAllowed: true,
      },
      AGE_RESTRICTION: {
        minimumAge: null
      }
    },
    RESTRICTIONS: {
      PETS: {
        isAllowed: false
      },
      PARTIES: {
        isAllowed: false
      }
    }
  }
};


export const Hotel = () => {
  const [dataDes, setDataDes] = useState(null);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { data, loading, error } = useFetch(`/api/hotels/find/6773c62b5c2627d41a99e4ad`);


  const photoss = data?.photos;
  const proximity =  data.proximity
  const amenities = data?.amenities
  const rooms = data?.rooms
  const rules = data?.rules
  const areaInfo = data?.areaInfo

  useEffect(() => {
   
    if(data){
      setDataDes(data) }
    }, [data]);


  console.log({"data hotel " : dataDes})
  
  

  // Ensure rooms data is properly structured
  const hotelData = {
    ...data,
    ...professionalHotelData,
    rooms: data?.rooms?.length ? data.rooms : professionalHotelData.rooms || []
  };

  // Update the description to use professional data
  const description = data?.description || `
    ${hotelData.name} est un établissement de luxe ${hotelData.stars} étoiles situé à ${hotelData.address.city}. 
    
    Cet hôtel de prestige offre ${hotelData.rooms.length} chambres et suites élégamment aménagées, 
    toutes équipées des dernières commodités pour assurer votre confort.
    
    Parmi nos installations, vous trouverez ${hotelData.amenities.wellness.join(', ')}.
    
    Notre établissement est idéalement situé à proximité des principales attractions de la ville,
    offrant une expérience unique combinant luxe, confort et commodité.
    
    Note des voyageurs: ${hotelData.rating}/10 basée sur ${hotelData.reviews} avis.
  `;

  // Update the photos handling
  const photos = hotelData?.photos?.map(photo => photo.url) || [];

  const { dates, options } = useContext(SearchContext);

  const option_room = options?.rooms || 1;
  const oneDay = 24 * 60 * 60 * 1000;

  function getNights(date1, date2) {
    const timenight = Math.abs(date1.getTime() - date2.getTime());
    const nights = Math.ceil(timenight / oneDay);
    return nights;
  }

  const nights = dates?.[0] ? getNights(new Date(dates[0].startDate), new Date(dates[0].endDate)) : 1;

  // console.log(nights); 

  const [showFullDescription, setShowFullDescription] = useState(false);

  // Update the getDisplayDescription function
  const getDisplayDescription = () => {
    const lines = description.split('\n').filter(line => line.trim());
    if (showFullDescription) {
      return description;
    }
    // For mobile, show only first 2 lines, for desktop show 5 lines
    const lineLimit = window.innerWidth < 768 ? 2 : 5;
    return lines.slice(0, lineLimit).join('\n');
  };

  // Add this useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when window is resized
      setShowFullDescription(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add state for selected rooms
  const [selectedRooms, setSelectedRooms] = useState({});

  // Add handler for room selection
  const handleRoomSelection = (roomId, quantity) => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: quantity
    }));
  };

  // Update total calculation with professional pricing
  const calculateTotal = () => {
    return Object.entries(selectedRooms).reduce((total, [roomId, quantity]) => {
      const room = hotelData.rooms.find(r => r.id === roomId);
      if (room && quantity > 0) {
        const priceAfterDiscount = room.price * (1 - (room.discount || 0) / 100);
        return total + (priceAfterDiscount * nights * quantity);
      }
      return total;
    }, 0);
  };

  // Add ref for the contact section
  const contactSectionRef = useRef(null);

  // Add scroll handler
  const scrollToContact = () => {
    setShowContactModule(true);
  };

  // Move the showContactModule state near other state declarations
  const [showContactModule, setShowContactModule] = useState(false);

  if (error) return <div>Une erreur s'est produite...</div>;

  return (
    <div className="bg-blue/40 min-h-screen">

      {/* Show ContactOwnersModule conditionally */}
      {showContactModule && (
        <ContactOwnersModule onClose={() => setShowContactModule(false)} />

      )}

      <Navbar />
      <Header type="list" />
      <div className="container mx-auto bg-blue/48 px-0 md:px-4 ">
        {loading ? (
          
          // <div className="flex justify-center items-center h-96">
          //   <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue"></div>
          //   <span className="ml-2">Chargement...</span>
          // </div>

          <PageReload />
        ) : (
          <>
            <div className="bg-transparent rounded-lg shadow-lg px-4 md:p-6 mb-8">
              <div className="flex items-center gap-2 bg-primary p-0 md:p-4 rounded-t-lg">
                <h6 className="text-blue p-1 text-sm">
                  <a href="/">Accueil</a>/ <a href="/">Hébergement</a> / 
                  <a href="/hotels/">Liste</a> / {hotelData?.name || "Nom de l'hôtel"}
                </h6>
              </div>
              <HotelNavMenu />

              {/* Sections with IDs */}
              <div id="overview" className="scroll-mt-24">
                <HotelHeader 
                  hotelData={{
                    ...hotelData,
                    name: hotelData.name,
                    rating: hotelData.rating,
                    reviews: hotelData.reviews,
                    address: hotelData.address
                  }} 
                />
                <ImageGallery photos={photoss} />
              </div>

              <div id="info" className="scroll-mt-24">
                <div className="flex gap-2 md:gap-12">
                  <div className="flex-[3]">
                    <FeaturedAmenities amenities={hotelData.amenities} />
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold my-4">À propos de cet établissement</h2>
                      <div className="relative bg-gray-100/70 rounded p-4">
                      <Descriptions data={dataDes} />
                        {/* <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {getDisplayDescription()}
                        </p>
                        {description.split('\n').filter(line => line.trim()).length > 5 && (
                          <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="bg-blue text-white px-4 py-2 rounded-md font-medium mt-2 hover:bg-blue-600 transition-colors"
                          >
                            {showFullDescription ? 'Voir moins' : 'Lire plus'}
                          </button>
                        )} */}
                      </div>
                    </div>
                  </div>

                  {/* Booking Box - hidden on mobile */}
                  <div className='hidden md:block flex-[1]'>
                    <HotelBookingBox hotel={hotelData} contactModule={scrollToContact} nights={nights} options={options} dates={dates} />
                  </div>
                </div>

                {/* Mobile Booking Box - shown only on mobile at the bottom */}
                <div className='md:hidden mt-6'>
                  <HotelBookingBox hotel={hotelData} nights={nights} options={options} />
                </div>

                <HotelRooms
                  rooms={hotelData.rooms}
                  nights={nights}
                  selectedRooms={selectedRooms}
                  handleRoomSelection={handleRoomSelection}
                  calculateTotal={calculateTotal}
                  scrollToContact={scrollToContact}
                />


                <div id="area">
                  <AreaInfo className="scroll-mt-24" hotelData={proximity} contactModule={scrollToContact} />
                </div>
                <div id='facilities' className='scroll-mt-24'>
                  <HotelFacilities />
                </div>
                <div id='rules' className='scroll-mt-24'>
                  <HouseRules hotelDataRules={hotelData.rules} propertyName={hotelData.name} />
                </div>



              </div>



              <div id="print" className="scroll-mt-24">
                <FAQ hotelData={hotelData} />
              </div>



            </div>
          </>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
