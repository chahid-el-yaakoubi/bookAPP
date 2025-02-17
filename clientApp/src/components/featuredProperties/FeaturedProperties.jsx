import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Constants
const SCROLL_AMOUNT = 330; // Width of item + gap
const RATING_THRESHOLDS = {
    EXCEPTIONAL: 4.8,
    EXCELLENT: 4.5,
    VERY_GOOD: 4.0,
};

// Property data
const properties = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
        name: 'Aparthotel Stare Miasto',
        city: 'Madrid',
        price: 120,
        rating: 4.9,
        reviews: 537,
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        name: 'Riad Nador Beach',
        city: 'Nador',
        price: 85,
        rating: 4.7,
        reviews: 324,
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        name: 'Marina View Hotel',
        city: 'Nador',
        price: 95,
        rating: 4.6,
        reviews: 251,
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        name: 'Marchica Lagoon Resort',
        city: 'Nador',
        price: 150,
        rating: 4.8,
        reviews: 428,
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        name: 'Atlas Mountain View Villa',
        city: 'Nador',
        price: 110,
        rating: 4.5,
        reviews: 183,
    },
];

// PropertyCard Component
const PropertyCard = ({ property }) => {
    const { t } = useTranslation();
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="flex-shrink-0 w-full max-w-[300px] md:max-w-[320px] lg:max-w-[300px]" style={{ scrollSnapAlign: 'start' }}>
            <div className="overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative group">
                    <img
                        src={property.image}
                        alt={`${property.name} in ${property.city}`}
                        className="w-full h-[200px] object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2 text-gray-800">{property.name}</h3>
                    <div className="flex items-center mb-3">
                        <span className="text-gray-600">{property.city}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-green-500">${property.price}</span>
                        <span className="text-sm text-gray-500">{t('FeaturedProperties.perNight')}</span>
                    </div>
                    <RatingBadge rating={property.rating} reviews={property.reviews} />

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="mt-4 w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                        {showDetails ? t('FeaturedProperties.showLess') : t('FeaturedProperties.bookNow')}
                    </button>

                    {showDetails && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-semibold mb-2">{t('FeaturedProperties.propertyDetails')}</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• {t('FeaturedProperties.totalReviews')}: {property.reviews}</li>
                                <li>• {t('FeaturedProperties.rating')}: {property.rating}/5.0</li>
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
        reviews: PropTypes.number.isRequired,
    }).isRequired,
};

// RatingBadge Component
const RatingBadge = ({ rating }) => {
    const { t } = useTranslation();

    const getRatingText = (rating) => {
        if (rating >= RATING_THRESHOLDS.EXCEPTIONAL) return t('FeaturedProperties.ratings.exceptional');
        if (rating >= RATING_THRESHOLDS.EXCELLENT) return t('FeaturedProperties.ratings.excellent');
        if (rating >= RATING_THRESHOLDS.VERY_GOOD) return t('FeaturedProperties.ratings.veryGood');
        return t('FeaturedProperties.ratings.good');
    };

    const getRatingColor = (rating) => {
        if (rating >= RATING_THRESHOLDS.EXCEPTIONAL) return 'bg-green-600';
        if (rating >= RATING_THRESHOLDS.EXCELLENT) return 'bg-blue-500';
        if (rating >= RATING_THRESHOLDS.VERY_GOOD) return 'bg-indigo-600';
        return 'bg-gray-600';
    };

    return (
        <div className="flex items-center gap-3">
            <div className={`${getRatingColor(rating)} text-white px-3 py-1.5 rounded-lg font-bold text-sm`}>
                {rating}
            </div>
            <span>{getRatingText(rating)}</span>
        </div>
    );
};

RatingBadge.propTypes = {
    rating: PropTypes.number.isRequired,
};

// ScrollButton Component
const ScrollButton = ({ direction, onClick }) => (
    <button
        onClick={onClick}
        className={`hidden md:flex absolute top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full w-12 h-12 items-center justify-center
        ${direction === 'left' ? '-left-8' : '-right-8'} hover:bg-green-600 transition`}
    >
        {direction === 'left' ? '<' : '>'}
    </button>
);

ScrollButton.propTypes = {
    direction: PropTypes.oneOf(['left', 'right']).isRequired,
    onClick: PropTypes.func.isRequired,
};

// FeaturedProperties Component
export const FeaturedProperties = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            current.scrollBy({
                left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative">
            {/* Scroll buttons visible only on larger screens */}
            <ScrollButton direction="left" onClick={() => scroll('left')} />
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide md:flex-row flex-col"
            >
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
            <ScrollButton direction="right" onClick={() => scroll('right')} />
        </div>
    );
};
