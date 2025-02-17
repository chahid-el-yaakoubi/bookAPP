import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

const HotelsDisplay = () => {
  const hotels = useSelector((state) => state.hotels.filteredHotels);
  const navigate = useNavigate();
  const [hoveredHotelId, setHoveredHotelId] = useState(null);

  return (
    <div className="container  mx-auto px-6 py-10 ">
      {/* <h2 className="text-3xl font-bold mb-4">Welecome 😊 </h2> */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">


{hotels.map((hotel) => (
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
    {hotels.map((hotel) => (
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

{hotels.map((hotel) => (
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
