import React from 'react';
import { FaStar } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';

export const GuestFavorites = () => {
    const favorites = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
            title: "Beachfront Villas",
            location: "Bali, Indonesia",
            rating: 4.8,
            reviews: 2341,
            price: 200
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
            title: "Mountain Chalets",
            location: "Swiss Alps",
            rating: 4.9,
            reviews: 1876,
            price: 350
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
            title: "City Apartments",
            location: "Paris, France",
            rating: 4.7,
            reviews: 3102,
            price: 180
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
            title: "Luxury Resorts",
            location: "Maldives",
            rating: 4.9,
            reviews: 2854,
            price: 450
        },
    ];

    return (
        <div className="w-full max-w-[1024px] mx-auto">
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {favorites.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex-shrink-0 w-[230px] cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative h-[200px] w-full">
                            <img 
                                src={item.image} 
                                alt={item.title}
                                className="h-full w-full object-cover rounded-t-lg"
                            />
                        </div>
                        <div className="p-4 bg-white rounded-b-lg">
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <div className="flex items-center gap-1 text-gray-500 mb-2">
                                <IoLocationSharp />
                                <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    <FaStar className="text-yellow-400" />
                                    <span className="font-bold">{item.rating}</span>
                                </div>
                                <span className="text-gray-500">
                                    ({item.reviews} reviews)
                                </span>
                            </div>
                            <div className="font-bold">
                                Starting from ${item.price}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 