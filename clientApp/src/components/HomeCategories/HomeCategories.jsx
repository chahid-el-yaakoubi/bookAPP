import React from 'react';

export default function HomeCategories() {
    const categories = [
        { name: 'Car Rentals', icon: '🚗', bgColor: 'bg-lime-300' },
        { name: 'Real Estate', icon: '🏠', bgColor: 'bg-green-300' },
        { name: 'Apartment Booking', icon: '🏢', bgColor: 'bg-cyan-300' },
        { name: 'Holiday Apartments for Rent', icon: '🏖️', bgColor: 'bg-yellow-300' },
        { name: 'Shops', icon: '🛍️', bgColor: 'bg-orange-300' },
    ];

    return (
        <div className="min-h-[470px] container flex flex-col
                        items-center py-8 border border-4 border-blue
                        rounded mb-[220px] mt-[80px] relative" style={{backgroundImage: 'url(/imges/bgs/ddx12.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <h1 className="text-3xl font-bold text-center rounded p-2 text-gray-800 mb-8 bg-white absolute top-[-25px]">Hi there, what are you looking for?</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full  px-4 mt-[100px] ">
                {categories.map((category) => (
                    <div
                        key={category.name}
                        className={`${category.bgColor} cursor-pointer p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center hover:bg-opacity-75 transition duration-300`}
                    >
                        <div className="text-6xl mb-4">{category.icon}</div>
                        <h2 className="text-2xl font-semibold text-gray-700">{category.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
