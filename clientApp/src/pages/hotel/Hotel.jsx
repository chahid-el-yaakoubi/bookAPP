import React, { useEffect, useState } from 'react';
import { ImageGallery } from './componentHotel/ImageGallery';
import { BookingCard } from './componentHotel/BookingCard';
import { ThingsToKnow } from './componentHotel/ThingsToKnow';
import { Share, Heart } from 'lucide-react';
import { BookingProvider } from '../../contexts/BookingContext';
import { Navbar } from '../../components/Navbar';
import { Header } from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { TfiAngleLeft } from "react-icons/tfi";
import { MdArrowRight } from 'react-icons/md';
import { FaUtensils, FaTrain, FaPlane, FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaSwimmingPool } from "react-icons/fa";
import { SharePropertyModal } from './componentHotel/Share.jsx';
import { toggleReservation } from '../../redux/SaveClient.js';
import Footer from '../../components/footer.jsx';
import { useTranslation } from 'react-i18next';
import PropertyAmenities from './componentHotel/PropertyAmenities.jsx';
import PropertyFeatures from './componentHotel/Features.jsx';
import { LayoutRoom } from './rooms/LayoutRoom.jsx';

const apiUrl = import.meta.env.VITE_API_URL;

// Improved MapIframe component with responsive design
const MapIframe = () => {
  const embedLink = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4209.136539582935!2d-2.9391949235346493!3d35.15725335857831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDA5JzI2LjEiTiAywrA1NicxMS44Ilc!5e1!3m2!1sen!2sma!4v1745355233505!5m2!1sen!2sma";

  return (
    <div className="w-full h-full overflow-hidden rounded-lg">
      <iframe
        src={embedLink}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
        className="rounded-lg shadow-md"
      ></iframe>
    </div>
  );
};

// Professional Room Table Component
const RoomTable = ({ rooms }) => {
  const { t } = useTranslation();

  if (!rooms || rooms.length === 0) {
    return <div className="text-gray-500 italic">{t('singleProperty.noRoomsAvailable')}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
              {t('singleProperty.roomName')}
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
              {t('singleProperty.beds')}
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
              {t('singleProperty.amenities')}
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
              {t('singleProperty.occupancy')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rooms.map((room, index) => {
            const { roomName, bedCounts, amenities, capacity } = room;

            // Format bed counts for display
            const bedDetails = bedCounts
              ? Object.entries(bedCounts)
                .filter(([_, count]) => parseInt(count) > 0)
                .map(([type, count]) => `${count} ${type}`)
                .join(", ")
              : '';

            // Format amenities for display
            const amenitiesList = amenities
              ? Object.entries(amenities)
                .filter(([_, value]) => value === true)
                .map(([amenity]) => t(`singleProperty.amenities.${amenity}`))
                .join(", ")
              : '';

            return (
              <tr key={index} className="bg-white">
                <td className="py-3 px-4 text-sm text-gray-600 border-b">{roomName}</td>
                <td className="py-3 px-4 text-sm text-gray-600 border-b">{bedDetails}</td>
                <td className="py-3 px-4 text-sm text-gray-600 border-b">{amenitiesList}</td>
                <td className="py-3 px-4 text-sm text-gray-600 border-b">{capacity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// New HotelDetailsTabs Component
const HotelDetailsTabs = ({ proximities, propertyFeatures, propertyAmenities }) => {
  const [activeTab, setActiveTab] = useState('nearby');
  const { t } = useTranslation();

  const categoryIcons = {
    restaurants: <FaUtensils className="text-red-500 text-xl" />,
    publicTransit: <FaTrain className="text-blue-500 text-xl" />,
    airports: <FaPlane className="text-indigo-500 text-xl" />,
    attractions: <FaMapMarkerAlt className="text-green-500 text-xl" />,
  };

  // Tab configuration
  const tabs = [
    { id: 'nearby', label: t('singleProperty.nearbyPlaces', 'Nearby Places') },
    { id: 'features', label: t('singleProperty.features', 'Features') },
    { id: 'amenities', label: t('singleProperty.amenities', 'Amenities') }
  ];

  const renderNearbyPlaces = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
      {Object.entries(proximities || {})
        .filter(([category, places]) => category !== null && places && places.length > 0)
        .map(([category, places]) => (
          <div key={category} className="p-5 rounded-xl shadow-md bg-white hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              {categoryIcons[category] || <FaMapMarkerAlt className="text-gray-500 text-xl" />}
              <h3 className="text-lg font-semibold capitalize">
                {t(`singleProperty.categories.${category}`, category.replace(/([A-Z])/g, " $1"))}
              </h3>
            </div>
            <ul className="space-y-2">
              {places.map((place, index) => (
                <li key={index} className="flex justify-between text-gray-600 border-b pb-2 last:border-0">
                  <span className="font-medium">{place.name}</span>
                  <span className="text-sm text-gray-500">
                    {place.distance} {t('singleProperty.kilometers')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );

  const renderFeatures = () => (
    <PropertyFeatures propertyFeaturesData={propertyFeatures} />

  );

  const renderAmenities = () => (
    <PropertyAmenities propertyAmenitiesData={propertyAmenities} />
  );

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'nearby':
        return renderNearbyPlaces();
      case 'features':
        return renderFeatures();
      case 'amenities':
        return renderAmenities();
      default:
        return null;
    }
  };

  return (
    <div className="py-6 border-b">
      <h2 className="text-2xl font-semibold mb-6">{t('singleProperty.hotelDetails', 'Hotel Details')}</h2>

      {/* Tab Navigation */}
      <div className="border-b flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === tab.id
                ? 'text-blue border-b-2 border-blue text-xl'
                : 'text-gray-600 hover:text-gray-900'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export function Hotel() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const categoryIcons = {
    restaurants: <FaUtensils className="text-red-500 text-xl" />,
    publicTransit: <FaTrain className="text-blue-500 text-xl" />,
    airports: <FaPlane className="text-indigo-500 text-xl" />,
    attractions: <FaMapMarkerAlt className="text-green-500 text-xl" />,
  };

  const { data: hotel, error, loading } = useFetch(`api/hotels/find/${id}`);
  const { data: roomsData, loading: roomsLoading } = useFetch(`/api/rooms/${id}/find`);

  console.log(roomsData)

  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({});
  const [rooms, setRooms] = useState([]);
  const [propertyFeatures, setPropertyFeatures] = useState();
  const [propertyAmenities, setPropertyAmenities] = useState();
  const [type, setType] = useState({});
  const [policies, setPolicies] = useState({});
  const [accessibilityFeatures, setAccessibilityFeatures] = useState({});
  const [safetyFeatures, setSafetyFeatures] = useState({});
  const [propertyData, setPropertyData] = useState({});

  const [cancellationPolicy, setCancellationPolicy] = useState({});

  const [proximities, setProximities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [description, setDescription] = useState('');

  // save action
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.save.reservations);
  const exists = reservations.find((r) => r.hotelId === id);

  const handleClick = () => {
    const date = new Date().toISOString();
    dispatch(toggleReservation(id, 'userId', date));
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {

    if(hotel && hotel.property_details && !loading && !error){
      setPropertyData(hotel)
    }
    if (hotel) {
      if (hotel.property_details?.photos) {
        setImages(hotel.property_details.photos);
      }


      if (hotel.location) {
        setLocation(hotel.location);
      }

      if (hotel.type) {
        setType(hotel.type);
      }

      if (hotel.proximities) {
        setProximities(hotel.proximities);
      }

      if (hotel.policies) {
        setPolicies(hotel.policies);
      }

      if (hotel.accessibility_features) {
        setAccessibilityFeatures(hotel.accessibility_features);

      }

      if (hotel.safety_features) {
        setSafetyFeatures(hotel.safety_features);
      }

      if (hotel.cancellation) {  
        setCancellationPolicy(hotel.cancellation);
      }

      if (hotel.property_details?.propertyFeatures) {
        setPropertyFeatures(hotel.property_details.propertyFeatures);
      }

      if (hotel.property_details?.amenities) {
        setPropertyAmenities(hotel.property_details.amenities);
      }

      if (hotel.property_details?.description) {
        setDescription(hotel.property_details.description);
      }
    }
  }, [hotel]);

  useEffect(() => {
    if (roomsData && roomsData.length > 0) {
      setRooms(roomsData);
    }
  }, [roomsData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  //         <p className="font-bold">Error</p>
  //         <p>Error loading property details. Please try again later.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className=''>
      <div className=''>
        <Navbar />
        <div className="hidden md:block">
          <Header type={"house_rental"} />

        </div>
      </div>

      <BookingProvider>
        <div className="bg-blue/10 shadow-sm">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pt-20 bg-primary/10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold mb-1 hidden md:block">{hotel?.title}</h1>

              <button
                onClick={() => { navigate(-1) }}
                className='flex items-center gap-2 justify-start shadow-lg p-2 rounded hover:bg-gray-100 md:hidden'>
                <TfiAngleLeft className="w-4 h-4" />
                <span className="underline">{t('singleProperty.back')}</span>
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg transition">
                  <Share className="w-4 h-4" />
                  <span className="underline">{t('singleProperty.share')}</span>
                </button>

                <SharePropertyModal
                  isOpen={isShareModalOpen}
                  onClose={() => setIsShareModalOpen(false)}
                  property={hotel || {}}
                />

                <button
                  onClick={handleClick}
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg transition">
                  <Heart className={`w-4 h-4 ${exists ? 'text-red-500 fill-red-500' : ''}`} />
                  <span className="underline">
                    {exists ? t('singleProperty.usaved') : t('singleProperty.save')}
                  </span>
                </button>
              </div>
            </div>

            <ImageGallery images={images} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6 md:mt-10">
              <div className="lg:col-span-2">
                <h1 className="text-2xl font-semibold mb-1 md:hidden">{hotel?.title}</h1>

                <div className="flex justify-between pb-6 border-b">
                  <div>
                    <h2 className="text-md md:text-lg flex items-start font-semibold mb-2 text-gray-900">
                      {type.type ? type.type.charAt(0).toUpperCase() + type.type.slice(1).toLowerCase() : ''}
                      <span className='px-1'> at </span>
                      {location.country ? location.country.charAt(0).toUpperCase() + location.country.slice(1).toLowerCase() : ''}
                      <MdArrowRight />
                      {location.region ? location.region.charAt(0).toUpperCase() + location.region.slice(1).toLowerCase() : ''}
                      <MdArrowRight />
                      {location.city ? location.city.charAt(0).toUpperCase() + location.city.slice(1).toLowerCase() : ''}
                      {location.neighborhood && (
                        <>
                          <MdArrowRight />
                          {location.neighborhood.charAt(0).toUpperCase() + location.neighborhood.slice(1).toLowerCase()}
                        </>
                      )}
                    </h2>

                    <div className="flex items-center mt-2">
                      <FaBed className="text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {rooms.length} {rooms.length === 1 ? t('singleProperty.room') : t('singleProperty.rooms')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-6 border-b">
                  <h1 className='text-2xl font-semibold mb-4'>{t('singleProperty.aboutThisPlace')}</h1>
                  <p className="whitespace-pre-line text-gray-700">
                    {description || 'No description available.'}
                  </p>
                </div>
              </div>

              {/* <div className="lg:col-start-3">
                <BookingCard
                  pricePerNight={hotel?.price || 0}
                  rating={hotel?.rating || 0}
                  reviewCount={hotel?.reviewCount || 0}
                />
              </div> */}
            </div>

            <div className="py-6 border-b">
              <h2 className="text-2xl font-semibold mb-6">{t('singleProperty.availableRooms')}</h2>
              {roomsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <LayoutRoom rooms={rooms} />
              )}
            </div>

            {/* REPLACED: Nearby Places Section with Tabbed Interface */}
            <HotelDetailsTabs
              proximities={proximities}
              propertyFeatures={propertyFeatures}
              propertyAmenities={propertyAmenities}
            />

            <ThingsToKnow propertyData={propertyData} />

            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-6">{t('singleProperty.location')}</h2>
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
                <MapIframe /> 
                
              </div>
            </div>

          </div>
        </div>
      </BookingProvider>

      <Footer />
    </div>
  );
}