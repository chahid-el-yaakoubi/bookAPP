// import { BookingProvider } from './context/BookingContext';

import React from 'react';

const MapIframe = () => {
  const embedLink = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d740.2628554265848!2d-5.353500794964029!3d35.57215546645905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDM0JzE5LjYiTiA1wrAyMScxMC42Ilc!5e1!3m2!1sfr!2sde!4v1744208309979!5m2!1sfr!2sde"; // paste the one from Google

  return (
    <iframe
      src={embedLink}
      width="350"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Maps"
    ></iframe>
  );
};

export default MapIframe;


import { ImageGallery } from './componentHotel/ImageGallery';
import { BookingCard } from './componentHotel/BookingCard';
import { MapView } from './componentHotel/Map';
import { ThingsToKnow } from './componentHotel/ThingsToKnow';
import { Share, Heart, Globe2 } from 'lucide-react';
import { BookingProvider } from '../../contexts/BookingContext';
import { Navbar } from '../../components/Navbar';
import { Header } from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TfiAngleLeft } from "react-icons/tfi";
import { MdArrowRight } from 'react-icons/md';
import { FaUtensils, FaTrain, FaPlane, FaMapMarkerAlt } from "react-icons/fa";
import HotelRoomsDisplay from './rooms/TableRooms';
import { SharePropertyModal } from './componentHotel/Share.jsx';
import { toggleReservation } from '../../redux/SaveClient.js';
import Footer from '../../components/footer.jsx';

const apiUrl = import.meta.env.VITE_API_URL;


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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const categoryIcons = {
    restaurants: <FaUtensils className="text-red-500 text-xl" />,
    publicTransit: <FaTrain className="text-blue-500 text-xl" />,
    airports: <FaPlane className="text-indigo-500 text-xl" />,
    attractions: <FaMapMarkerAlt className="text-green-500 text-xl" />,
  };
  const { data: hotel, error, loading, reFrech } = useFetch(`api/hotels/find/${id}`);
  const { data: roomsData, error: roomsError, loading: roomsLoading, reFrech: roomsRefRech } = useFetch(`${apiUrl}/rooms/${id}/find`);

  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({});
  const [rooms, setRooms] = useState([]);
  const [type, setType] = useState({});
  const [policies, setPolicies] = useState({});
  const [proximities, setProximities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);



  // save action
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.save.reservations);
  console.log(reservations)
  const exists = reservations.find((r) => r.hotelId === id);

  const handleClick = () => {
    const date = new Date().toISOString();
    dispatch(toggleReservation(id, 'userId', date));
  };


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
    if (hotel && hotel.policies) {
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

      const bedDetails = bedCounts
        ? Object.entries(bedCounts)
          .filter(([_, count]) => parseInt(count) > 0)
          .map(([type, count]) => `${count} ${type}`)
          .join(", ")
        : '';


      return `${roomName?.charAt(0)?.toUpperCase() + roomName?.slice(1)} ${index + 1} > ${bedDetails}`;
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
    <div >

      <div className='hidden md:block'>
        <Navbar />
        <Header type={"house_rental"}/>
      </div>

      <BookingProvider >
        <div className="bg-blue/10 className='shadow-lg container mx-auto">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  md:pt-20">

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold mb-1 hidden md:block">{hotel?.title}</h1>

              <button
                onClick={() => { navigate(-1) }}
                className='flex items-center hap-2 justify-start shadow-lg p-2 rounded hover:bg-gray-100 md:hidden'>
                <TfiAngleLeft className="w-4 h-4" />
                <span className="underline ">Homes</span>
              </button>


              <div className="flex gap-4">

                <button
                  onClick={(() => {
                    setIsShareModalOpen(true)
                  })}
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  <Share className="w-4 h-4" />
                  <span className="underline">Share</span>
                </button>
                <SharePropertyModal
                  isOpen={isShareModalOpen}
                  onClose={() => setIsShareModalOpen(false)}
                  property={[]}
                />
                <button
                onClick={handleClick}
                 className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  <Heart className="w-4 h-4" />
                  <span className="underline">
                    {exists ? 'usaved' : 'save'}
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
                      <MdArrowRight />
                      {location.neighborhood ? location.neighborhood.charAt(0).toUpperCase() + location.neighborhood.slice(1).toLowerCase() : ''}
                    </h2>
                    <div>
                      {rooms.map((room, index) => {
                        const { roomName, bedCounts, amenities } = room;

                        // Check if "Path to room" exists in amenities
                        const hasPathToRoom = amenities && amenities["Private bathroom"];

                        // Filter beds with count > 0

                        const bedDetails = bedCounts
                          ? Object.entries(bedCounts)
                            .filter(([_, count]) => parseInt(count) > 0)
                            .map(([type, count]) => `${count} ${type}`)
                            .join(", ")
                          : '';


                        return (
                          <h5 key={index} className="text-lg ">
                            {rooms?.length > 1 && `${roomName?.charAt(0)?.toUpperCase() + roomName?.slice(1)} ${index + 1} : `}

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


              </div>

              <div className="lg:col-start-3">
                <BookingCard
                  pricePerNight={mockListing.price}
                  rating={mockListing.rating}
                  reviewCount={mockListing.reviewCount}
                />
              </div>
            </div>

            <div className="py-6 border-b">
              {roomsData &&
                <HotelRoomsDisplay roomsData={roomsData} propertyType={'hotel'} />

              }
            </div>

            {/* Nearby Places Section */}
            <div className="py-8 border-b">
              <h2 className="text-2xl font-semibold mb-6">Nearby Places</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {Object.entries(proximities)
                  .filter(([category, places]) => category !== null && places && places.length > 0)
                  .slice(0, isMobile ? 2 : 6)
                  .map(([category, places]) => (
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
                {isMobile && (
                  <button
                    className="text-blue-500 underline"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>

            {/* Modal for Mobile View */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center pt-20">
                <div className="bg-white p-6 pt-10 w-full h-full z-50 rounded-lg shadow-lg relative animate-slide-up">
                  <button
                    className="mt-4 absolute top-1 right-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => setIsModalOpen(false)}
                  >
                    X
                  </button>
                  <h2 className="text-2xl font-semibold mb-4">All Nearby Places</h2>
                  <div className="overflow-scroll h-full pb-20">
                    {Object.entries(proximities)
                      .filter(([category, places]) => category !== null && places && places.length > 0)
                      .map(([category, places]) => (
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
                  </div>
                  <div className="flex justify-between mt-4"></div>
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
              {/* <MapView
                latitude={mockListing.coordinates.latitude}
                longitude={mockListing.coordinates.longitude}
              /> */}

              <div className="w-full h-[400px] mb-20">

                <MapIframe />

              </div>

              
            </div>

            
          </div>
        </div>
      </BookingProvider >

      <Footer />
    </div>

  );
}
