import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Constants
const SCROLL_AMOUNT = 330; // Width of item + gap
const RATING_THRESHOLDS = {
    EXCEPTIONAL: 4.8,
    EXCELLENT: 4.5,
    VERY_GOOD: 4.0
};

// Property data (move to separate data file in real application)
const properties = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
        name: "Aparthotel Stare Miasto",
        city: "Madrid",
        price: 120,
        rating: 4.9,
        reviews: 537
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
        name: "Riad Nador Beach",
        city: "Nador",
        price: 85,
        rating: 4.7,
        reviews: 324
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
        name: "Marina View Hotel",
        city: "Nador",
        price: 95,
        rating: 4.6,
        reviews: 251
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        name: "Marchica Lagoon Resort",
        city: "Nador",
        price: 150,
        rating: 4.8,
        reviews: 428
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        name: "Atlas Mountain View Villa",
        city: "Nador",
        price: 110,
        rating: 4.5,
        reviews: 183
    }
];

// Component for property card
const PropertyCard = ({ property }) => {
    const { t } = useTranslation();
    const [showDetails, setShowDetails] = useState(false);
    
    return (
        <div 
            className="flex-shrink-0 w-[300px]"
            style={{ scrollSnapAlign: 'start' }}
        >
            <div className="overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative group">
                    <img 
                        src={property.image} 
                        alt={`${property.name} in ${property.city}`}
                        className="w-full h-[200px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300"/>
                </div>
                <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2 text-gray-800">
                        {property.name}
                    </h3>
                    <div className="flex items-center mb-3">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-600">{property.city}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-green-500">${property.price}</span>
                        <span className="text-sm text-gray-500">{t('FeaturedProperties.perNight')}</span>
                    </div>
                    <RatingBadge rating={property.rating} reviews={property.reviews} />
                    
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="mt-4 w-full py-2 px-4 bg-green-500 text-white rounded-lg 
                            hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                        {showDetails ? t('FeaturedProperties.showLess') : t('FeaturedProperties.bookNow')}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`w-4 h-4 transform transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {showDetails && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-semibold mb-2">{t('FeaturedProperties.propertyDetails')}</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• {t('FeaturedProperties.totalReviews')}: {property.reviews}</li>
                                <li>• {t('FeaturedProperties.rating')}: {property.rating}/5.0</li>
                                {/* Add more details as needed */}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

PropertyCard.propTypes = {
    property: PropTypes.shape({
        id: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        reviews: PropTypes.number.isRequired
    }).isRequired
};

// Component for rating badge
const RatingBadge = ({ rating, reviews }) => {
    const { t } = useTranslation();
    
    const getRatingText = (rating) => {
        if (rating >= RATING_THRESHOLDS.EXCEPTIONAL) return t('FeaturedProperties.ratings.exceptional');
        if (rating >= RATING_THRESHOLDS.EXCELLENT) return t('FeaturedProperties.ratings.excellent');
        if (rating >= RATING_THRESHOLDS.VERY_GOOD) return t('FeaturedProperties.ratings.veryGood');
        return t('FeaturedProperties.ratings.good');
    };

    const getRatingColor = (rating) => {
        if (rating >= RATING_THRESHOLDS.EXCEPTIONAL) return "bg-green-600";
        if (rating >= RATING_THRESHOLDS.EXCELLENT) return "bg-blue";
        if (rating >= RATING_THRESHOLDS.VERY_GOOD) return "bg-indigo-600";
        return "bg-gray-600";
    };

    if (!rating) return null;

    return (
        <div className="flex items-center gap-3 border-t pt-4">
            <div className={`${getRatingColor(rating)} text-white px-3 py-1.5 rounded-lg font-bold text-sm`}>
                {rating}
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-gray-800">{getRatingText(rating)}</span>
                <span className="text-sm text-gray-500">

                    {/* TODO: Add reviews */}
                    {/* {t('FeaturedProperties.reviews')} */}
                </span>
            </div>
        </div>
    );
};

RatingBadge.propTypes = {
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired
};

// Navigation button component
const ScrollButton = ({ direction, onClick }) => (
    <button 
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-1/2 
            ${direction === 'left' ? '-left-8' : '-right-8'}
            w-12 h-12 rounded-full bg-green-500 shadow-lg hover:shadow-xl
            flex items-center justify-center
            text-gray-800 hover:text-white
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-green-600`}
    >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-6 h-6"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={direction === 'left' 
                    ? "M15.75 19.5L8.25 12l7.5-7.5" 
                    : "M8.25 4.5l7.5 7.5-7.5 7.5"
                } 
            />
        </svg>
    </button>
);

ScrollButton.propTypes = {
    direction: PropTypes.oneOf(['left', 'right']).isRequired,
    onClick: PropTypes.func.isRequired
};

// Add memo to optimize performance for child components
const MemoizedPropertyCard = React.memo(PropertyCard);
const MemoizedScrollButton = React.memo(ScrollButton);

// Main component
export const FeaturedProperties = () => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const handleScroll = () => {
        const { current } = scrollRef;
        if (current) {
            setCanScrollLeft(current.scrollLeft > 0);
            setCanScrollRight(
                current.scrollLeft < current.scrollWidth - current.clientWidth
            );
        }
    };

    useEffect(() => {
        const { current } = scrollRef;
        if (current) {
            current.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
        }
        return () => current?.removeEventListener('scroll', handleScroll);
    }, []);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            current.scrollBy({
                left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="container mx-auto pb-12 relative px-4 sm:px-6">
            <div className="relative">
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide gap-6 py-4 justify-start sm:justify-between"
                    onScroll={handleScroll}
                    style={{ 
                        scrollSnapType: 'x mandatory',
                        scrollPaddingLeft: '24px',
                        scrollPaddingRight: '24px'
                    }}
                >
                    <div className="flex-shrink-0 w-4 sm:hidden" aria-hidden="true" />
                    {properties.map((property) => (
                        <MemoizedPropertyCard key={property.id} property={property} />
                    ))}
                    <div className="flex-shrink-0 w-4 sm:hidden" aria-hidden="true" />
                </div>

                {canScrollLeft && <MemoizedScrollButton direction="left" onClick={() => scroll('left')} />}
                {canScrollRight && <MemoizedScrollButton direction="right" onClick={() => scroll('right')} />}
            </div>
        </div>
    );
}; 