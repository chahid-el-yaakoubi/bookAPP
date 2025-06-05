import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Header } from '../../components/Header';
import { Listitem } from './listItem/Listitem';
import BlurListItem from './listItem/BlurListItem';
import { SearchContext } from '../../contexts/SearchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownWideShort,
  faHouse,
  faHouseFlag,
  faHotel,
  faArrowUpFromWaterPump,
  faSliders
} from '@fortawesome/free-solid-svg-icons';
import useFetch from '../../hooks/useFetch';

// Import styles once at the top
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import HotelsDisplay, { HotelCard, HotelCardGrid } from './listItem/HotelsDisplay';
import HotelsList from './listItem/HotelsList';
import { useDispatch, useSelector } from 'react-redux';
import { setHotels } from '../../redux/hotelsSlice';
import Footer from '../../components/footer';
import { useTranslation } from 'react-i18next';


export const List = () => {
  const { city } = useContext(SearchContext);
  const location = useLocation();
  const { t } = useTranslation();


  const hotels = useSelector((state) => state.hotels.filteredHotels);

  const City = city?.toLowerCase();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [
    "https://scontent-mad2-1.xx.fbcdn.net/v/t39.30808-6/473249589_1004743535033428_1926124240494421714_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=100&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=WQRJbFVbhzoQ7kNvwHKdW_w&_nc_oc=AdnT10wDJkkmbi7Y9nBmrZWmiG1JYL9b6mpC4G6Zlj7bNdTXqS7I0GRviH5Odcw292A&_nc_zt=23&_nc_ht=scontent-mad2-1.xx&_nc_gid=2t7298YCKKT4RNDfRdNSkg&oh=00_AfEGAsTmWr0jCPUAj7mIACDyPXOwWL-8OtA0zUxHGyQX4Q&oe=681C117E","https://www.fly-inselair.com/wp-content/uploads/2025/02/week-end-a-nador-au-maroc-que-faut-il-visiter.jpg","https://fr.le360.ma/resizer/v2/3O6QFC674VH2RL6E3XGTGVBDAI.jpg?auth=87f591ca9ebf3d1ff1da73ae5ec7f8a3b4b98c2f5cbd1a08c56a55197d319e74","https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/3e/a7/6d/getlstd-property-photo.jpg?w=700&h=-1&s=1"

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Handle errors
  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="p-6 bg-red-50 rounded-lg border border-red-200">
  //         <h2 className="text-xl font-semibold text-red-600">Error loading data</h2>
  //         <p className="text-red-500">{error.message}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-blue/30 min-h-screen">
      <Navbar />
      <Header type="house_rental" />
      <div className="flex flex-col items-center justify-center w-full mt-20 ">
        <div className="mt-10 md:mt-0 container mad:px-10 shadow-xl rounded-lg border border-gray-300">
          <div className="flex flex-col md:flex-row w-full">
            <div className="w-full md:w-1/2 mt-10 md:mt-0 md:p-10 " 
            dir='ltr'
            >
              <Carousel images={images} />
            </div>
            <div className="w-full md:w-1/2 px-4  md:p-20">
              <h1 className='text-3xl md:text-6xl text-center py-4 md:mb-10 font-bold text-blue-700'>{t('descriptionCities.wlcmnador')} </h1>
              <h1></h1>
              <p className={`text-lg text-gray-800 leading-relaxed md:line-clamp-10 ${!isExpanded ? 'line-clamp-4' : ''} md:text-xl`}>
                {t('descriptionCities.desc')}
              </p>
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500 mt-2 hover:underline">
                {isExpanded ? t('descriptionCities.less') : t('descriptionCities.more')}
              </button>
            </div>
          </div>
        </div>
        <HotelsList city={City} />

        <div className="container w-full px-2 sm:px-4 mt-10">
          {/* Filter Controls */}
          <HotelsDisplay hotels={hotels} />
        </div>
        <Footer />
      </div>
    </div>
  );
};



import {  useRef } from 'react';

export default function Carousel({ images }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = images.length;
  const intervalRef = useRef(null);

  // Auto-advance slides with pause capability
  useEffect(() => {
    // Start auto-advance if not paused
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveSlide((current) => (current === totalSlides - 1 ? 0 : current + 1));
      }, 3000);
    }
    
    // Cleanup interval when component unmounts or when isPaused changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalSlides]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const goToSlide = (slideIndex) => {
    setActiveSlide(slideIndex);
  };

  const goToPrevSlide = () => {
    setActiveSlide((current) => (current === 0 ? totalSlides - 1 : current - 1));
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current === totalSlides - 1 ? 0 : current + 1));
  };

  return (
    <div 
      className="relative w-full"
      id="default-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((img, i) => (
          <div 
            key={i} 
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
              activeSlide === i ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img} 
              className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" 
              alt={`Slide ${i + 1}`} 
              loading='lazy'
            />
          </div>
        ))}
      </div>

      {/* Slider indicators */}
      <div className="absolute z-20 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              activeSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-current={activeSlide === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToPrevSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 end-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToNextSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}