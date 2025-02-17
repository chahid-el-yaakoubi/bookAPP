import React from 'react';
import { Bed, Bath, Move, DollarSign } from 'lucide-react';

 function HouseCard({ house }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full dark:bg-gray-800">
      <img
        src={house.imageUrl}
        alt={house.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{house.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{house.address}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-green-600" />
            <span className="font-semibold">{house.price.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <Bed className="w-4 h-4 mr-1" />
          <span>{house.bedrooms} beds</span>
        </div>
        <div className="flex items-center">
          <Bath className="w-4 h-4 mr-1" />
          <span>{house.bathrooms} baths</span>
        </div>
        <div className="flex items-center">
          <Move className="w-4 h-4 mr-1" />
          <span>{house.sqft} sqft</span>
        </div>
      </div>
    </div>
  );
}

export default HouseCard;