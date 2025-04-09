import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

// Remove the router configuration if routes are defined elsewhere
// const router = createBrowserRouter([
//   // your routes
// ], {
//   future: {
//     v7_relativeSplatPath: true,
//   }
// });

const HotelsDisplay = () => {
  const hotels = useSelector((state) => state.hotels.filteredHotels);

  return (
    <div className="  xl:px-20 py-20 ">
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
      <HotelCardGrid hotels={hotels} />
    </div>
  );
};

export default HotelsDisplay;





import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Navigate to hotel details page when card is clicked
  const handleClick = () => {
    navigate(`/hotel/${hotel._id}`);
  };

  // Get photos array or create an array with a placeholder
  const photos = hotel.property_details.photos &&
    hotel.property_details.photos.length > 0
    ? hotel.property_details.photos
    : [{ url: 'https://via.placeholder.com/300x200?text=No+Image' }];

  // Format location
  const location = [
    hotel?.location.neighborhood,
    hotel?.location.city,
    hotel?.location.country
  ].filter(Boolean).join(', ');

  // Handle next image
  const handleNextImage = (e) => {
    e.stopPropagation(); // Prevent card click event
    setCurrentImageIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous image
  const handlePrevImage = (e) => {
    e.stopPropagation(); // Prevent card click event
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-gray-200 w-full"
      onClick={handleClick}
    >
      {/* Image Carousel Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={photos[currentImageIndex].url}
          alt={hotel?.title || 'Hotel'}
          className="w-full h-full object-cover"
        />

        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <button
            onClick={handlePrevImage}
            className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextImage}
            className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full z-10">
          {currentImageIndex + 1}/{photos.length}
        </div>

        {hotel?.type && hotel?.type.listingType && (
          <span className="absolute top-3 left-3 bg-white bg-opacity-90 px-2 py-1 text-xs font-semibold rounded z-10">
            {hotel?.type.listingType}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
          {hotel?.title || 'Untitled Hotel'}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">{location}</p>
        <div className="grid grid-cols-2 gap-2">
          {hotel?.rooms && (
            <p className="text-sm md:text-base font-bold text-gray-800">
              {hotel.rooms.length} rooms
            </p>
          )}
          {hotel?.property_details?.bathrooms && (
            <p className="text-sm md:text-base font-bold text-gray-600">
              {hotel?.property_details?.bathrooms?.length} bathrooms
            </p>
          )}
          {hotel?.pricing && (
            <p className="text-sm md:text-base font-bold text-green-600 col-span-2">
              {hotel?.pricing?.nightly_rate} MAD / night
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Hotel Card Grid Component to display multiple hotel cards
export const HotelCardGrid = ({ hotels }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {hotels?.map((hotel) => (
          <HotelCard hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

