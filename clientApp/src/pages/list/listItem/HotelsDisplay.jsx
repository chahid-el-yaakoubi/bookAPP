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
  const dispatch = useDispatch()


  const { data } = useFetch(`/api/hotels`)
  useEffect(() => {

    dispatch(setHotels(data));

  }, [data]); //filters
  const hotels = useSelector(state => state.hotels.filteredHotels);

  return (
    <>
      {hotels.length > 0 ? <div className="  xl:px-20 py-20 ">
        <HotelCardGrid hotels={hotels} />

      </div> :
        <div className="container py-20">

          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            {/* Cube */}
            <div className="relative w-[100px] h-[100px] animate-spinCube [transform-style:preserve-3d]">
              {["front", "back", "right", "left", "top", "bottom"].map((face, i) => (
                <div
                  key={face}
                  className={`absolute w-full h-full ${i % 2 === 0 ? "bg-cyan-500" : "bg-orange-500"
                    } border-2 border-white rounded shadow-[0_0_15px_white] face-${face}`}
                />
              ))}


              <style>{`
          @keyframes spinCube {
            33% {
              transform: rotateX(-36deg) rotateY(-405deg);
            }
            100% {
              transform: rotateX(-36deg) rotateY(-405deg);
            }
          }

          .animate-spinCube {
            animation: spinCube 3s infinite cubic-bezier(0.16, 0.61, 0.49, 0.91);
          }

          .face-top {
            transform: rotateX(90deg) translateZ(50px);
            animation: shiftTop 3s infinite ease-out;
          }

          .face-bottom {
            transform: rotateX(-90deg) translateZ(50px);
            animation: shiftBottom 3s infinite ease-out;
          }

          .face-right {
            transform: rotateY(90deg) translateZ(50px);
            animation: shiftRight 3s infinite ease-out;
          }

          .face-left {
            transform: rotateY(-90deg) translateZ(50px);
            animation: shiftLeft 3s infinite ease-out;
          }

          .face-front {
            transform: translateZ(50px);
            animation: shiftFront 3s infinite ease-out;
          }

          .face-back {
            transform: rotateY(-180deg) translateZ(50px);
            animation: shiftBack 3s infinite ease-out;
          }

          @keyframes shiftTop {
            33% { transform: rotateX(90deg) translateZ(50px); }
            50%, 60% { transform: rotateX(90deg) translateZ(100px); }
            75% { transform: rotateX(90deg) translateZ(50px); }
          }

          @keyframes shiftBottom {
            33% { transform: rotateX(-90deg) translateZ(50px); }
            50%, 60% { transform: rotateX(-90deg) translateZ(100px); }
            75% { transform: rotateX(-90deg) translateZ(50px); }
          }

          @keyframes shiftRight {
            33% { transform: rotateY(90deg) translateZ(50px); }
            50%, 60% { transform: rotateY(90deg) translateZ(100px); }
            75% { transform: rotateY(90deg) translateZ(50px); }
          }

          @keyframes shiftLeft {
            33% { transform: rotateY(-90deg) translateZ(50px); }
            50%, 60% { transform: rotateY(-90deg) translateZ(100px); }
            75% { transform: rotateY(-90deg) translateZ(50px); }
          }

          @keyframes shiftFront {
            33% { transform: translateZ(50px); }
            50%, 60% { transform: translateZ(100px); }
            75% { transform: translateZ(50px); }
          }

          @keyframes shiftBack {
            33% { transform: rotateY(-180deg) translateZ(50px); }
            50%, 60% { transform: rotateY(-180deg) translateZ(100px); }
            75% { transform: rotateY(-180deg) translateZ(50px); }
          }
        `}</style>
            </div>

            {/* Loading Text */}
            <p className="mt-6 text-black text-xl font-medium tracking-wide animate-pulse">
              Loading...
            </p>
          </div>

        </div>}

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
    navigate(`/hotel/${hotel._id}`);
  };

  // Get photos array or create an array with a placeholder
  const photos = hotel.property_details.photos &&
    hotel.property_details.photos.length > 0
    ? hotel.property_details.photos
    : [{ url: 'https://via.placeholder.com/300x200?text=No+Image' }];

  // Format location
  const location = hotel?.location.neighborhood || hotel?.location.city || hotel?.location.country || t('hotelsDisplay.noLocation');

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
        />

        {/* Navigation buttons - Swap positions for RTL */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <button
            onClick={isRTL ? handleNextImage : handlePrevImage}
            className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
            aria-label={t('hotelsDisplay.previousImage')}
          >
            {isRTL ? <ChevronRight size={20} /> :  <ChevronLeft size={20} /> }
           
          </button>
          <button
            onClick={isRTL ? handlePrevImage : handleNextImage}
            className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-10"
            aria-label={t('hotelsDisplay.nextImage')}
          >
                        {isRTL ? <ChevronLeft size={20} /> :  <ChevronRight size={20} /> }

          </button>
        </div>

        {/* Image counter - Adjust position for RTL */}
        <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'} bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full z-10`}>
          {currentImageIndex + 1}/{photos.length}
        </div>

        {/* Type badge - Adjust position for RTL */}
        {hotel?.type && hotel?.type.listingType && (
          <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-white bg-opacity-90 px-2 py-1 text-xs font-semibold rounded z-10`}>
            {t(`${hotel.type.listingType}`)}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
          {hotel?.title || t('hotelsDisplay.untitledHotel')}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">{location}</p>
        <div className="grid grid-cols-2 gap-2">
          {hotel?.rooms && (
            <p className="text-sm md:text-base font-bold text-gray-800">
              {t('hotelsDisplay.rooms', { count: hotel.rooms.length })}
            </p>
          )}
          {hotel?.property_details?.bathrooms && (
            <p className="text-sm md:text-base font-bold text-gray-600">
              {t('hotelsDisplay.bathrooms', { count: hotel.property_details.bathrooms.length })}
            </p>
          )}
          {hotel?.pricing && (
            <p className="text-sm md:text-base font-bold text-green-600 col-span-2">
              {t('hotelsDisplay.pricePerNight', { price: hotel.pricing.nightly_rate })}
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
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};



