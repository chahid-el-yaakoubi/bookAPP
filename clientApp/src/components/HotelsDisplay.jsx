import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

const HotelsDisplay = () => {
  const hotels = useSelector((state) => state.hotels.filteredHotels);
  const navigate = useNavigate();
  const [hoveredHotelId, setHoveredHotelId] = useState(null);
  const hotelcs = [];
  return (
    <div className="container-fluid px-10 xl:px-20 py-20 ">

<HotelCardGrid hotels={hotels} />

      {/* <h2 className="text-3xl font-bold mb-4">Welecome 😊 </h2> */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">


{hotelcs?.map((hotel) => (
          <div
            key={hotel._id}
            className="relative rounded-md md:rounded-xl overflow-hidden cursor-pointer hover:shadow-lg shadow-md transition-all bg-white"
            onClick={() => navigate(`/hotel/6743339ac1ae185b5869a5ed`)}
            onMouseEnter={() => setHoveredHotelId(hotel._id)}
            onMouseLeave={() => setHoveredHotelId(null)}
          >
            {/* Favorite Badge */}
            <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1 rounded-full shadow-md">
              <span className="text-sm font-medium">Featured Hotel</span>
            </div>

            {/* Favorite Button */}
            <button
              className={`absolute top-3 right-3 z-10 p-2 hidden md:block rounded transition-colors hover:scale-110 active:scale-90  ${hoveredHotelId === hotel._id ? 'bg-white/90  hover:bg-white' : 'bg-white'}`}
              onClick={(e) => {
                e.stopPropagation();
                // Add favorite logic here
              }}
            >
             save <FontAwesomeIcon icon={faHeart} className="w-5 h-5 text-gray-600" />
            </button>

            {/* Main Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={hotel.photos[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4 fill-current text-purple-600"  />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" className="mr-1" />
                  {hotel.location.city}, {hotel.location.region}
                </div>
              </div>

              <h3 className="font-medium text-gray-900">{hotel.name}</h3>

              <div className="text-gray-500 text-sm">
                {hotel.description || "No description available"}
              </div>

              <div className="relative p-2 ">
              <div className="flex items-center  absolute right-0 -bottom-2 p-1 rounded-sm space-x-1 shadow-md">
                <span className="font-semibold text-md">{hotel.basePrice}€</span>
                <span className="text-gray-900 font-normal">per night</span>
              </div>
              </div>
            </div>
          </div>
        ))}
    {hotelcs?.map((hotel) => (
          <div
            key={hotel._id}
            className="relative rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all bg-white"
            onClick={() => navigate(`/hotel/6743339ac1ae185b5869a5ed`)}
            onMouseEnter={() => setHoveredHotelId(hotel._id)}
            onMouseLeave={() => setHoveredHotelId(null)}
          >
            {/* Favorite Badge */}
            <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1 rounded-full shadow-md">
              <span className="text-sm font-medium">Featured Hotel</span>
            </div>

            {/* Favorite Button */}
            <button
              className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors ${hoveredHotelId === hotel._id.$oid ? 'bg-white/90 hover:bg-white' : 'bg-white/70'}`}
              onClick={(e) => {
                e.stopPropagation();
                // Add favorite logic here
              }}
            >
              <FontAwesomeIcon icon={faHeart} className="w-5 h-5 text-gray-600" />
            </button>

            {/* Main Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={hotel.photos[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4 fill-current text-primary-600" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" className="mr-1" />
                  {hotel.location.city}, {hotel.location.region}
                </div>
              </div>

              <h3 className="font-medium text-gray-900">{hotel.name}</h3>

              <div className="text-gray-500 text-sm">
                {hotel.description || "No description available"}
              </div>

              <div className="flex items-center space-x-1">
                <span className="font-semibold">{hotel.basePrice}€</span>
                <span className="text-gray-600">per night</span>
              </div>
            </div>
          </div>
        ))}

{hotelcs?.map((hotel) => (
          <div
            key={hotel._id}
            className="relative rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all bg-white"
            onClick={() => navigate(`/hotel/6743339ac1ae185b5869a5ed`)}
            onMouseEnter={() => setHoveredHotelId(hotel._id)}
            onMouseLeave={() => setHoveredHotelId(null)}
          >
            {/* Favorite Badge */}
            <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1 rounded-full shadow-md">
              <span className="text-sm font-medium">Featured Hotel</span>
            </div>

            {/* Favorite Button */}
            <button
              className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors ${hoveredHotelId === hotel._id.$oid ? 'bg-white/90 hover:bg-white' : 'bg-white/70'}`}
              onClick={(e) => {
                e.stopPropagation();
                // Add favorite logic here
              }}
            >
              <FontAwesomeIcon icon={faHeart} className="w-5 h-5 text-gray-600" />
            </button>

            {/* Main Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={hotel.photos[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4 fill-current text-primary-600" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" className="mr-1" />
                  {hotel.location.city}, {hotel.location.region}
                </div>
              </div>

              <h3 className="font-medium text-gray-900">{hotel.name}</h3>

              <div className="text-gray-500 text-sm">
                {hotel.description || "No description available"}
              </div>

              <div className="flex items-center space-x-1">
                <span className="font-semibold">{hotel.basePrice}€</span>
                <span className="text-gray-600">per night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelsDisplay;






// Hotel Card Component
const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  
  // Navigate to hotel details page when card is clicked
  const handleClick = () => {
    navigate(`/hotel/${hotel._id}`);
  };

  // Get the main photo URL, or use a placeholder if no photos
  const mainPhotoUrl = hotel.property_details.photos && 
    hotel.property_details.photos.length > 0 
    ? hotel.property_details.photos[0].url 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  // Format location
  const location = [
    hotel.location.neighborhood,
    hotel.location.city,
    hotel.location.country
  ].filter(Boolean).join(', ');

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={mainPhotoUrl} 
          alt={hotel.title || 'Hotel'} 
          className="w-full h-full object-cover"
        />
        {hotel.type && hotel.type.listingType && (
          <span className="absolute top-3 left-3 bg-white bg-opacity-90 px-2 py-1 text-xs font-semibold rounded">
            {hotel.type.listingType}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {hotel.title || 'Unnamed Property'}
          </h3>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-800">
              {hotel.property_details.max_guests} guests
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-1 truncate">{location}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {hotel.property_details.rooms && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {hotel.property_details.rooms} rooms
            </span>
          )}
          {hotel.property_details.bathrooms && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {hotel.property_details.bathrooms} baths
            </span>
          )}
          {hotel.type && hotel.type.type && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {hotel.type.type}
            </span>
          )}
        </div>

        {/* Amenities Section */}
        <div className="mt-3 flex flex-wrap gap-1">
          {hotel.property_details.spaces && hotel.property_details.spaces.length > 0 && 
            hotel.property_details.spaces.slice(0, 3).map((space, index) => (
              <span key={index} className="text-xs text-gray-600">
                {index > 0 ? ' · ' : ''}{space.type}
              </span>
            ))
          }
        </div>

        {/* Price Section */}
        <div className="mt-4 flex justify-between items-end">
          <div>
            {hotel.pricing && hotel.pricing.nightly_rate && (
              <p className="font-semibold text-lg">
                ${hotel.pricing.nightly_rate}
                <span className="text-sm font-normal text-gray-600"> night</span>
              </p>
            )}
          </div>
          
          {/* Status Badge */}
          {hotel.status && (
            <span className={`text-xs px-2 py-1 rounded capitalize ${
              hotel.status.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              hotel.status.status === 'approved' ? 'bg-green-100 text-green-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {hotel.status.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Hotel Card Grid Component to display multiple hotel cards
const HotelCardGrid = ({ hotels }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel._id.$oid} hotel={hotel} />
      ))}
    </div>
  );
};

export { HotelCard, HotelCardGrid };
