// import { BookingProvider } from './context/BookingContext';
import { ImageGallery } from './componentHotel/ImageGallery';
import { BookingCard } from './componentHotel/BookingCard';
import { MapView } from './componentHotel/Map';
import { ThingsToKnow } from './componentHotel/ThingsToKnow';
import { Share, Heart, Globe2 } from 'lucide-react';
import { BookingProvider } from '../../contexts/BookingContext';
import { Navbar } from '../../components/Navbar';
import { Header } from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TfiAngleLeft } from "react-icons/tfi";
import { MdArrowRight } from 'react-icons/md';
import { FaUtensils, FaTrain, FaPlane, FaMapMarkerAlt } from "react-icons/fa";

const mockListing = {
  id: '1',
  title: 'Bed & Breakfast in Abundant Paradise',
  location: 'Almegíjar, Andalucía, Spain',
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687120-9e4abefd7e44?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  price: 250,
  description: 'La Catitera is a beautiful old inn, lovingly restored, nestled at the foothills of the Alpujarras, part of the Sierra Nevada mountain range.\n\nIt is the ideal place for relaxation and contemplation, bird and river song, reading, writing or painting. It sits in a popular walking and biking destination with spectacular mountain villages and is not far from the beach and from Granada ovingly restored, nestled at the foothills of the Alpujarras, part of the Sierra Nevada mountain range.\n\nIt is the ideal place for relaxation and contemplation, bird and river song, reading, writing or painting. It sits in a popular walking and biking destination with spectacular mountain villages and is not far from the beach and from Granada.',
  host: {
    name: 'Suzy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    reviewCount: 17,
    responseRate: 60,
    responseTime: 'within a day',
    description: 'My work: Was once an arts festival co-ordinator but now I\'m engaged in creating a sustainable lifestyle',
    languages: ['English', 'French', 'Spanish', 'Turkish'],
    location: 'Lives in Sorvilán, Spain',
    yearsHosting: 7
  },
  amenities: [
    'Kitchen',
    'Wifi',
    'Free parking on premises',
    'Pool',
    'TV',
    'Washer',
    'Patio or balcony'
  ],
  coordinates: {
    latitude: 36.9,
    longitude: -3.2
  },
  rating: 5.0,
  reviewCount: 16,
  rules: {
    checkIn: '12:00 PM',
    maxGuests: 3,
    pets: false
  }
};

export function Hotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const categoryIcons = {
    restaurants: <FaUtensils className="text-red-500 text-xl" />,
    publicTransit: <FaTrain className="text-blue-500 text-xl" />,
    airports: <FaPlane className="text-indigo-500 text-xl" />,
    attractions: <FaMapMarkerAlt className="text-green-500 text-xl" />,
  };
  const { data: hotel, error, loading, reFrech } = useFetch(`/api/hotels/find/${id}`);
  const { data: roomsData, error: roomsError, loading: roomsLoading, reFrech: roomsRefRech } = useFetch(`/api/rooms/${id}/find`);

  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({});
  const [rooms, setRooms] = useState([]);
  const [type, setType] = useState({});
  const [policies, setPolicies] = useState({});
  const [proximities, setProximities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  
   // Détection du mobile
   useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Vérification initiale
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {

    if (hotel && hotel.property_details && hotel.property_details.photos) {
      setImages(hotel.property_details.photos);
    };
    if (hotel && hotel.location) {
      setLocation(hotel.location);
    };
    if (hotel && hotel.type) {
      setType(hotel.type);
    };
    if (hotel && hotel.proximities) {
      setProximities(hotel.proximities);
    };
    if(hotel && hotel.policies) {
      setPolicies(hotel.policies);
    }
  }, [hotel])

  useEffect(() => {

    if (roomsData.length > 0) {
      setRooms(roomsData);
    }
  }, [roomsData])


  function formatRooms(rooms) {
    return rooms.map((room, index) => {
      const { roomName, bedCounts } = room;

      // Filter out beds with count > 0 and format them
      const bedDetails = Object.entries(bedCounts)
        .filter(([_, count]) => parseInt(count) > 0)
        .map(([type, count]) => `${count} ${type}`)
        .join(", ");

      return `${roomName.charAt(0).toUpperCase() + roomName.slice(1)} ${index + 1} > ${bedDetails}`;
    });
  };

  console.log(formatRooms(rooms).join("\n"));



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading property details. Please try again later.</div>;
  }

  return (
    <>

      <div className='hidden md:block'>
        <Navbar />
        <Header />
      </div>

      <BookingProvider >
        <div className="bg-blue/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  md:pt-20">

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold mb-1 hidden md:block">{hotel?.title}</h1>

              <button
              onClick={()=>{navigate(-1)}}
              className='flex items-center hap-2 justify-start shadow-lg p-2 rounded hover:bg-gray-100 md:hidden'>
                <TfiAngleLeft className="w-4 h-4" />
                <span className="underline ">Homes</span>
              </button>


              <div className="flex gap-4">

                <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  <Share className="w-4 h-4" />
                  <span className="underline">Share</span>
                </button>
                <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  <Heart className="w-4 h-4" />
                  <span className="underline">Save</span>
                </button>
              </div>
            </div>

            <ImageGallery images={images} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-80 md:mt-10">
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
                      <MdArrowRight />
                      {location.neighborhood ? location.neighborhood.charAt(0).toUpperCase() + location.neighborhood.slice(1).toLowerCase() : ''}
                    </h2>
                    <div>
                      {rooms.map((room, index) => {
                        const { roomName, bedCounts, amenities } = room;

                        // Check if "Path to room" exists in amenities
                        const hasPathToRoom = amenities && amenities["Private bathroom"];

                        // Filter beds with count > 0

                        const bedDetails = Object.entries(bedCounts)
                          .filter(([_, count]) => parseInt(count) > 0)
                          .map(([type, count]) => `${count} ${type}`)
                          .join(", ");

                        return (
                          <h5 key={index} className="text-lg ">
                            {rooms?.length > 1 && `${roomName.charAt(0).toUpperCase() + roomName.slice(1)} ${index + 1} : `}

                            {bedDetails}
                            {hasPathToRoom && " + Private Bathroom"}
                          </h5>
                        );
                      })}
                    </div>

                  </div>

                </div>



                <div className="py-6 border-b">
                  <h1 className='text-2xl font-semibold mb-4'>About this place</h1>
                  <p className="whitespace-pre-line text-gray-700">
                    {mockListing.description}
                  </p>
                </div>



                <div className="py-6 border-b">
                  <h2 className="text-2xl font-semibold mb-4">Where you'll sleep</h2>
                  <div className="flex flex-wrap gap-4">
                    {rooms.map((room, index) => {
                      // Format bed details dynamically
                      const bedDetails = Object.entries(room.bedCounts)
                        .filter(([_, count]) => parseInt(count, 10) > 0)
                        .map(([bedType, count]) => `${count} ${bedType}`)
                        .join(", ");

                      // Check if the room has a private bathroom
                      const hasPrivateBathroom = room.amenities["Private bathroom"];

                      return (
                        <div key={room._id.$oid} className="border rounded-xl p-6 max-w-xs">
                          <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                            alt={room.roomName}
                            className="rounded-lg w-full h-40 object-cover"
                          />
                          <h3 className="font-semibold mb-2">
                            {room.roomName.charAt(0).toUpperCase() + room.roomName.slice(1)}{" "}
                            {index + 1}
                          </h3>
                          <p className="text-gray-600">
                            {bedDetails}
                            {hasPrivateBathroom && " + Private Bathroom"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>




              </div>

              <div className="lg:col-start-3">
                <BookingCard
                  pricePerNight={mockListing.price}
                  rating={mockListing.rating}
                  reviewCount={mockListing.reviewCount}
                />
              </div>
            </div>

            <div className="py-8 border-b">
              <h2 className="text-2xl font-semibold mb-6">Nearby Places</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {Object.entries(proximities).slice(0, isMobile ? 2 : 4).map(([category, places]) => (
                  <div key={category} className="p-5 rounded-xl shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      {categoryIcons[category] || <FaMapMarkerAlt className="text-gray-500 text-xl" />}
                      <h3 className="text-lg font-semibold capitalize">
                        {category.replace(/([A-Z])/g, " $1")}
                      </h3>
                    </div>
                    <ul className="text-gray-700">
                      {places.map((place) => (
                        <li key={place.id} className="flex justify-between text-gray-600">
                          <span className="font-medium">{place.name}</span>
                          <span className="text-sm text-gray-500">{place.distance} km</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {
                isMobile &&
                  <button 
                  className="text-blue-500 underline" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Show All
                </button>}
              </div>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center pt-20">
                <div className="bg-white p-6 pt-10 w-full h-full z-50 rounded-lg shadow-lg relative animate-slide-up ">
                <button 
                      className="mt-4 absolute top-1 right-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" 
                      onClick={() => setIsModalOpen(false)}
                    >
                      X
                    </button>
                  <h2 className="text-2xl font-semibold mb-4">All Nearby Places</h2>
                  <div className="overflow-scroll h-full pb-20">
                  {Object.entries(proximities).map(([category, places]) => (
                  <div key={category} className="p-5 rounded-xl shadow-md ">
                    <div className="flex items-center gap-3 mb-4">
                      {categoryIcons[category] || <FaMapMarkerAlt className="text-gray-500 text-xl" />}
                      <h3 className="text-lg font-semibold capitalize">
                        {category.replace(/([A-Z])/g, " $1")}
                      </h3>
                    </div>
                    <ul className="text-gray-700">
                      {places.map((place) => (
                        <li key={place.id} className="flex justify-between text-gray-600">
                          <span className="font-medium">{place.name}</span>
                          <span className="text-sm text-gray-500">{place.distance} km</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    
                    
                  </div>
                </div>
              </div>
            )}

            <div className="py-6 border-b">
              <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {mockListing.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gray-600">
                      ★
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <ThingsToKnow data={policies} />
 

            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-4">Where you'll be</h2>
              <MapView
                latitude={mockListing.coordinates.latitude}
                longitude={mockListing.coordinates.longitude}
              />
              <div className="mt-4">
                <h3 className="font-semibold mb-2">{mockListing.location}</h3>
                <p className="text-gray-600">
                  The nearest airports to La Catitera are Granada which is 1:15 hours drive and Málaga which is 1:45 hours drive away. The house is set within a mountainous countryside landscape. There are beautiful walks in the area, interesting towns, villages and even vineyards to visit. Good restaurants are about a 20 minute drive away and the beach and Granada are both accessible. The nearest town is Torvizcon which is a five minute drive and 30 minute river walk...
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h2 className="text-2xl font-semibold mb-6">Meet your host</h2>
              <div className="flex gap-8">
                <div className="flex flex-col items-center text-center space-y-2">
                  <img
                    src={mockListing.host.avatar}
                    alt={mockListing.host.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <h3 className="font-semibold">{mockListing.host.name}</h3>
                  <p className="text-gray-600">Host</p>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="font-semibold">{mockListing.host.reviewCount}</p>
                      <p className="text-gray-600">Reviews</p>
                    </div>
                    <div>
                      <p className="font-semibold">{mockListing.host.rating} ★</p>
                      <p className="text-gray-600">Rating</p>
                    </div>
                    <div>
                      <p className="font-semibold">{mockListing.host.yearsHosting}</p>
                      <p className="text-gray-600">Years hosting</p>
                    </div>
                  </div>
                  <p>{mockListing.host.description}</p>
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5" />
                    <span>Speaks {mockListing.host.languages.join(', ')}</span>
                  </div>
                  <p className="text-gray-600">{mockListing.host.location}</p>
                  <button className="px-6 py-2 border border-black rounded-lg font-semibold hover:bg-gray-100">
                    Message host
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BookingProvider >
    </>

  );
}
