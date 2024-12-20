import useFetch from '../../hooks/useFetch'
import './featured.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faChevronLeft, faChevronRight, faCirclePlay, faGamepad } from '@fortawesome/free-solid-svg-icons';

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Featured = () => {
  // const { data, error, loading } = useFetch("/api/hotels/contByCity?cities=marrakech,casablanca,fes,tangier,chefchaouen");
  // const {data, error, loading} = [];
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const [isTablet, setIsTablet] = React.useState(window.innerWidth <= 1024);
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth <= 1280);
  const [, forceUpdate] = React.useState({});
  const [isHovered, setIsHovered] = React.useState(false);
  const [timeUntilDiscountEnds, setTimeUntilDiscountEnds] = useState('');
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(false);
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const cities = [
    {
      id: "6743339ac1ae185b5869a5ed",
      name: 'Luxury Beach Villa in Nador',
      images: [
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Stunning beachfront villa with Mediterranean views",
      price: "299.99",
      discountedPrice: "254.99",
      discount: "15",
      location: "Nador Bay",
      rating: 4.8,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5ed",
      name: 'Rif Mountains Traditional House',
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Authentic Moroccan house with mountain views",
      price: "199.99",
      discountedPrice: "169.99",
      discount: "15",
      location: "Nador Hills",
      rating: 4.5,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5ed",
      name: 'Marchica Lagoon Apartment',
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Modern apartment overlooking Marchica lagoon",
      price: "159.99",
      discountedPrice: "135.99",
      discount: "15",
      location: "Marchica",
      rating: 4.6,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5ed",
      name: 'Downtown Nador Suite',
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Central location with easy access to markets",
      price: "129.99",
      discountedPrice: "110.49",
      discount: "15",
      location: "Downtown",
      rating: 4.3,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5ee",
      name: 'Mountain View Chalet',
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Cozy chalet with panoramic mountain views",
      price: "179.99",
      discountedPrice: "152.99",
      discount: "15",
      location: "Atlas Mountains",
      rating: 4.7,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5ef",
      name: 'Seaside Resort Suite',
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Luxurious suite with ocean views",
      price: "399.99",
      discountedPrice: "339.99",
      discount: "15",
      location: "Tangier Coast",
      rating: 4.9,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5f0",
      name: 'Desert Oasis Lodge',
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Traditional lodge in the heart of the desert",
      price: "259.99",
      discountedPrice: "220.99",
      discount: "15",
      location: "Sahara Desert",
      rating: 4.6,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5f1",
      name: 'Medina Heritage House',
      images: [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Authentic riad in the historic medina",
      price: "189.99",
      discountedPrice: "161.49",
      discount: "15",
      location: "Fes Medina",
      rating: 4.5,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5f2",
      name: 'Coastal Boutique Hotel',
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Modern hotel with private beach access",
      price: "289.99",
      discountedPrice: "246.49",
      discount: "15",
      location: "Agadir",
      rating: 4.8,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5f3",
      name: 'Garden Villa Retreat',
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Peaceful villa surrounded by gardens",
      price: "229.99",
      discountedPrice: "195.49",
      discount: "15",
      location: "Rabat",
      rating: 4.7,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5f4",
      name: 'Urban Luxury Apartment',
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Contemporary apartment in city center",
      price: "169.99",
      discountedPrice: "144.49",
      discount: "15",
      location: "Casablanca",
      rating: 4.4,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5f5",
      name: 'Historic Palace Hotel',
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Restored palace with luxury amenities",
      price: "449.99",
      discountedPrice: "382.49",
      discount: "15",
      location: "Marrakech",
      rating: 4.9,
      isGamePass: false,
    },
    {
      id: "6743339ac1ae185b5869a5f6",
      name: 'Mountain Resort & Spa',
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
      ],
      description: "Luxury resort with spa facilities",
      price: "379.99",
      discountedPrice: "322.99",
      discount: "15",
      location: "Ifrane",
      rating: 4.8,
      isGamePass: false,
    }
  ];

  const handleCityClick = (index) => {
    setCurrentImageIndex(index);
    setIsPaused(true);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setIsHovered(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  React.useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % cities.length);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
      setIsSmallScreen(window.innerWidth <= 1280);
      forceUpdate({});
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        handleNextClick();
      } else {
        handlePrevClick();
      }
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? cities.length - 1 : prev - 1));
    setIsPaused(true);
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % cities.length);
    setIsPaused(true);
  };

  // Add effect to handle wheel event
  React.useEffect(() => {
    const preventScroll = (e) => {
      if (isHovered) {
        e.preventDefault();
      }
    };

    // Add passive: false to allow preventDefault()
    window.addEventListener('wheel', preventScroll, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', preventScroll);
    };
  }, [isHovered]);

  // if (loading) return <div>Loading please wait...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  const navigate = useNavigate();

  const handleSeeDetails = (id) => {
    navigate(`/hotel/${id}`);
  };

  const getImageWidths = () => {
    if (window.innerWidth <= 768) {  // Mobile
      return {
        mainImage: 'w-full',
        preview: []
      };
    } else if (window.innerWidth <= 1024) {  // Tablet
      return {
        mainImage: 'w-[600px]',
        preview: ['w-[200px]', 'w-[180px]', 'hidden']
      };
    } else {  // Desktop (any size above 1024px)
      return {
        mainImage: 'w-[800px]',
        preview: ['w-[280px]', 'w-[260px]', 'hidden']
      };
    }
  };

  // Add new helper function to calculate date-based discount
  const calculateDateDiscount = (basePrice, baseDiscount) => {
    if (isFirstTimeVisitor) {
      const firstTimeDiscount = 30;
      const discountedPrice = (basePrice * (100 - firstTimeDiscount) / 100).toFixed(2);
      return {
        discountedPrice,
        discount: firstTimeDiscount,
        label: 'welcomeDiscount',
        isSpecial: true
      };
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const hour = today.getHours();

    if ((dayOfWeek === 5 && hour >= 17) || dayOfWeek === 6 || dayOfWeek === 0) {
      const weekendDiscount = 20;
      const discountedPrice = (basePrice * (100 - weekendDiscount) / 100).toFixed(2);
      return {
        discountedPrice,
        discount: weekendDiscount,
        label: 'weekendSpecial',
        isSpecial: true
      };
    }

    if (hour >= 22 || hour < 6) {
      const nightDiscount = 25;
      const discountedPrice = (basePrice * (100 - nightDiscount) / 100).toFixed(2);
      return {
        discountedPrice,
        discount: nightDiscount,
        label: 'nightOwlSpecial',
        isSpecial: true
      };
    }

    const discountedPrice = (basePrice * (100 - baseDiscount) / 100).toFixed(2);
    return {
      discountedPrice,
      discount: baseDiscount,
      label: 'specialOffer',
      isSpecial: false
    };
  };

  // Update the useEffect for countdown to use a shorter interval and handle negative times
  React.useEffect(() => {
    const updateCountdown = () => {
      const timeRemaining = calculateTimeRemaining();
      if (timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        setTimeUntilDiscountEnds(`${hours}h ${minutes}m ${seconds < 10 ? `0${seconds}s` : `${seconds}s`}`);
      } else {
        setTimeUntilDiscountEnds('');
      }
    };

    // Update every second instead of every minute
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial update

    return () => clearInterval(timer);
  }, []);

  // Modify calculateTimeRemaining to handle edge cases
  const calculateTimeRemaining = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Weekend discount end time (Sunday midnight)
    if ((dayOfWeek === 5 && hour >= 17) || dayOfWeek === 6 || dayOfWeek === 0) {
      const endDate = new Date();
      if (dayOfWeek === 0) {
        // If it's Sunday, set end time to next Monday 12:00 AM
        endDate.setDate(endDate.getDate() + 1);
      } else {
        // Otherwise, set to next Sunday 11:59:59 PM
        endDate.setDate(endDate.getDate() + (7 - dayOfWeek));
      }
      endDate.setHours(23, 59, 59, 999);
      return Math.max(0, endDate - now);
    }

    // Night discount end time (6 AM)
    if (hour >= 22 || hour < 6) {
      const endDate = new Date();
      if (hour >= 22) {
        endDate.setDate(endDate.getDate() + 1);
      }
      endDate.setHours(6, 0, 0, 0);
      return Math.max(0, endDate - now);
    }

    return 0;
  };

  // Add function to check and handle first-time visitor discount
  const checkFirstTimeVisitor = () => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsFirstTimeVisitor(true);
      // Set a flag in localStorage to track that they've visited
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  };

  // Add to useEffect to check first-time visitor status on mount
  React.useEffect(() => {
    checkFirstTimeVisitor();
  }, []);

  // Update the PreviewImage component to use Arabic translations
  const PreviewImage = () => (
    <div 
      className={`
        ${getImageWidths().mainImage} 
        h-[300px] md:h-[450px] 
        relative 
        rounded-lg 
        overflow-hidden 
        cursor-pointer
        transform transition-all duration-300 hover:scale-[1.02]
      `}
    >
      <img
        src={cities[currentImageIndex].images[0]}
        alt={cities[currentImageIndex].name}
        className={`
          w-full h-full 
          object-cover 
          transition-transform duration-300
          transform translate-x-0
          ${isHovered ? 'scale-105' : 'scale-100'}
        `}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className={`absolute bottom-0  p-3 md:p-6 flex flex-col gap-1 md:gap-2 ${t('dir') === 'rtl' ? 'text-right right-0' : 'text-left left-0'}`}>
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <span className="bg-blue text-white text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded">
            {cities[currentImageIndex].location}
          </span>
          {(() => {
            const { discount, label, isSpecial } = calculateDateDiscount(
              cities[currentImageIndex].price,
              parseInt(cities[currentImageIndex].discount)
            );
            return (
              <>
                <span className={`
                  text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded 
                  flex items-center gap-1
                  ${isFirstTimeVisitor ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-yellow-500'}
                `}>
                  <span>-{discount}% {t(`featured.${label}`)}</span>
                  {timeUntilDiscountEnds && !isFirstTimeVisitor && (
                    <span className="text-[9px] md:text-[10px] bg-black/20 px-1 rounded">
                      {t('featured.endsIn')} {timeUntilDiscountEnds}
                    </span>
                  )}
                </span>
                {isFirstTimeVisitor && (
                  <span className="bg-green-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded animate-pulse">
                    {t('featured.firstTimeVisitor')}
                  </span>
                )}
              </>
            );
          })()}
          <span className="bg-green-600 text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded">
            ★ {cities[currentImageIndex].rating}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs md:text-sm line-through">
            {cities[currentImageIndex].price}€
          </span>
          <span className="text-white text-sm md:text-lg font-bold">
            {calculateDateDiscount(
              cities[currentImageIndex].price,
              parseInt(cities[currentImageIndex].discount)
            ).discountedPrice}€
          </span>
        </div>
        <h2 className="text-lg md:text-3xl font-bold text-white">
          {cities[currentImageIndex].name}
        </h2>
        <p className="text-white/80 text-[10px] md:text-sm line-clamp-2 md:line-clamp-none">
          {cities[currentImageIndex].description}
        </p>
        <button 
          onClick={() => handleSeeDetails(cities[currentImageIndex].id)} 
          className="mt-1 md:mt-2 bg-blue hover:bg-blue/90 text-white text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded w-fit flex items-center gap-1 md:gap-2"
        >
          <span>{t('featured.bookNow')}</span>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs md:text-sm" />
        </button>
      </div>
    </div>
  );

  // Add these button components near the PreviewImage component
  const NavigationButton = ({ direction, onClick }) => (
    <button 
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2 z-20
        ${direction === 'prev' ? 'left-1 md:left-2' : 'right-1 md:right-2'}
        bg-black/50 hover:bg-black/70 text-white 
        p-1.5 md:p-3
        rounded-full transition-all duration-300
        scale-75 md:scale-100
      `}
    >
      <FontAwesomeIcon 
        icon={direction === 'prev' ? faChevronLeft : faChevronRight} 
        className="text-sm md:text-lg"
      />
    </button>
  );

  return (
    <div 
      className="w-full mx-auto bg-[#2D2D2D] dark:bg-gray-800/50 py-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-4 justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NavigationButton direction="prev" onClick={handlePrevClick} />
            <NavigationButton direction="next" onClick={handleNextClick} />
            <PreviewImage />
            
            {/* Move the preview images section here */}
            {!isMobile && (
              <div className={`
                ${isMobile ? 'hidden' : 'flex'} 
                gap-2 lg:gap-4
              `}>
                {[1, 2].map((offset, idx) => {
                  const widths = getImageWidths().preview;
                  if (isTablet && idx === 2) return null;

                  return (
                    <div 
                      key={offset}
                      className={`
                        ${widths[idx]} 
                        h-[450px] 
                        relative 
                        rounded-lg 
                        overflow-hidden 
                        cursor-pointer
                        transform transition-all duration-300 hover:scale-[1.02]
                      `}
                      onClick={() => setCurrentImageIndex((currentImageIndex + offset) % cities.length)}
                    >
                      <img 
                        src={cities[(currentImageIndex + offset) % cities.length].images[0]}
                        alt={cities[(currentImageIndex + offset) % cities.length].name}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded mb-2 inline-block">
                          <FontAwesomeIcon icon={faBed} className="mr-2" />
                          Available Now
                        </span>
                        <h3 className="text-xl font-bold text-white">
                          {cities[(currentImageIndex + offset) % cities.length].name}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {cities.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCityClick(index)}
              className={`
                h-1.5 md:h-1 rounded-full transition-all duration-300
                ${index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}
                ${isMobile ? 'p-1.5' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
