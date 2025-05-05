import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { setHotels } from "../../../redux/hotelsSlice";
import useFetch from "../../../hooks/useFetch";

// Remove the router configuration if routes are defined elsewhere
// const router = createBrowserRouter([
//   // your routes
// ], {
//   future: {
//     v7_relativeSplatPath: true,
//   }
// });



const HotelsDisplay = () => {
  const { t } = useTranslation();



  const hotels = useSelector(state => state.hotels.filteredHotels);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(40); // Default to 40 for desktop

  useEffect(() => {
    // Set items per page based on window width
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 10 : 40);
    };

    updateItemsPerPage(); // Set initial value
    window.addEventListener('resize', updateItemsPerPage); // Update on resize

    return () => {
      window.removeEventListener('resize', updateItemsPerPage); // Cleanup
    };
  }, []);

  // Calculate the current hotels to display
  const indexOfLastHotel = currentPage * itemsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;
  const currentHotels = hotels?.slice(indexOfFirstHotel, indexOfLastHotel);

  // Calculate total pages
  const totalPages = Math.ceil(hotels.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {currentHotels.length > 0 && <div className="  xl:px-20 py-20 ">
        <HotelCardGrid hotels={currentHotels} />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

      </div>
      }

      {/* {
        (currentHotels.length === 0) && <div className="container py-20 h-[40vh]">

          <h1 className="text-2xl font-bold text-center text-red-500">Sorry, no results found. Please adjust your filters.</h1>

        </div>


      } */}
    </>
  );
};

export default HotelsDisplay;





import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HotelCard = ({ hotel }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isRTL = i18n.dir() === 'rtl';

  // Navigate to hotel details page when card is clicked
  const handleClick = () => {
    window.open(`/hotel/${hotel._id}`, '_blank');
  };

  // Get photos array or create an array with a placeholder
  const photos = hotel?.property_details?.photos && hotel.property_details.photos.length > 0
    ? hotel.property_details.photos
    : [{ url: 'https://via.placeholder.com/300x200?text=No+Image' }];

  // Format location
  const location = (isRTL ? hotel?.location?.addressAr : hotel?.location?.addressEn) || t('hotelsDisplay.noLocation');

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
      className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-gray-200 w-full ${isRTL ? 'text-right' : 'text-left'}`}
      onClick={handleClick}
    >
      {/* Image Carousel Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={photos[currentImageIndex].url}
          alt={hotel?.title || t('hotelsDisplay.untitledHotel')}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Navigation buttons - Swap positions for RTL */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <button
            onClick={isRTL ? handleNextImage : handlePrevImage}
            className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
            aria-label={t('hotelsDisplay.previousImage')}
          >
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}

          </button>
          <button
            onClick={isRTL ? handlePrevImage : handleNextImage}
            className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
            aria-label={t('hotelsDisplay.nextImage')}
          >
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}

          </button>
        </div>

        {/* Image counter - Adjust position for RTL */}
        <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'} bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full z-10`}>
          {currentImageIndex + 1}/{photos.length}
        </div>

        {/* Type badge - Adjust position for RTL */}
        {hotel?.type && hotel?.type?.type && (
          <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-white bg-opacity-90 px-2 py-1 text-xs font-semibold rounded z-10`}>
            {t(`hotelsDisplay.listingTypes.${hotel.type.type}`)}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
          {hotel?.title || t('hotelsDisplay.untitledHotel')}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">{location}</p>

        {/* Star Rating Section */}
        {(hotel?.type?.type === 'hotel' || hotel?.type?.type === 'guesthouse') && (
          <p className="text-sm text-gray-800 mb-2">
            {t(`hotelsDisplay.listingTypes.${hotel.type.type}`)}
            {` ${hotel?.rating} `}
            {Array.from({ length: 5 }, (_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={`text-${index < (hotel?.rating || 0) ? 'yellow-500' : 'gray-300'}`}
              />
            ))}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          {/* Conditional rendering for rooms and pricing based on hotel type */}
          {!(hotel?.type?.type === 'hotel' || hotel?.type?.type === 'guesthouse') && hotel?.rooms && (
            <p className="text-sm md:text-base font-bold text-gray-800">
              {t('hotelsDisplay.rooms', { count: hotel?.roomSummary?.totalRooms })}
              {` (${hotel?.roomSummary?.totalBeds} ${t('hotelsDisplay.beds')})`}
            </p>
          )}
          {!(hotel?.type?.type === 'hotel' || hotel?.type?.type === 'guesthouse') && hotel?.pricing && (
            <>
              <p className="text-sm m font-bold text-green-600 col-span-2">
                {t('hotelsDisplay.pricePerNight', { price: hotel?.pricing?.nightly_rate })}
              </p>

            </>
          )}
          {(hotel?.type?.type === 'hotel' || hotel?.type?.type === 'guesthouse') && hotel?.roomSummary && (
            <div className="flex gap-1 ">
              {/* <span className="text-sm">Start from</span> */}
              <span className="text-sm"> ({hotel.roomSummary.maxPrice} - {hotel.roomSummary.minPrice}) </span>

              <p className="text-sm  font-bold text-green-600 col-span-2">
                {t('hotelsDisplay.pricePerNight', { price: '' })}


              </p>

            </div>

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
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};



