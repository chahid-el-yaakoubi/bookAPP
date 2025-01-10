import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUtensils,
  faTrain,
  faUmbrellaBeach,
  faPlane,
  faCoffee,
} from "@fortawesome/free-solid-svg-icons";

export const AreaInfo = ({hotelData, contactModule}) => {
  const areaData = hotelData

  console.log(areaData)

  return (
    
    <div className="mt-8 px-4  bg-gray-100  shadow-xl rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">Area info</h2>
        <div className='flex flex-col gap-2'>
          <h6 className="text-sm text-gray-600 mb-2">Best rates guaranteed - Book directly with us!</h6>
          <button onClick={()=>contactModule()} className="bg-blue text-white px-4 py-2 rounded-md w-full sm:w-auto">
            Book Now
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-blue hover:underline cursor-pointer mb-6">
          Excellent location – show map
        </p>

        {/* Main sections grid */}
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
          {/* What's nearby */}
          <div className="bg-gray-100 md:bg-gray-200 hover:bg-blue/50 transition rounded-lg p-4 shadow-xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-gray-600" />
              What's nearby
            </h3>
            <div className="space-y-3">
              {areaData?.nearbyPlaces.map((place, index) => (
                <div key={index} className="flex justify-between items-center text-sm md:text-base">
                  <span className="flex-1">{place.name}</span>
                  <span className="text-gray-600 ml-2">{place.distance} km</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurants & cafes */}
          <div className="bg-gray-100 md:bg-gray-200 hover:bg-green-100 transition rounded-lg p-4 shadow-xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUtensils} className="text-gray-600" />
              Restaurants & cafes
            </h3>
            <div className="space-y-3">
              {areaData?.restaurants.map((restaurant, index) => (
                <div key={index} className="flex justify-between items-center text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCoffee} className="text-gray-600" />
                    <span>{restaurant.name}</span>
                  </div>
                  <span className="text-gray-600 ml-2">{restaurant.distance} km</span>
                </div>
              ))}
            </div>
          </div>

          {/* Public transit */}
          <div className="bg-gray-100 md:bg-gray-200 hover:bg-red-100 transition rounded-lg p-4 shadow-xl">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faTrain} className="text-gray-600" />
              Public transit
            </h3>
            <div className="space-y-3">
              {areaData?.publicTransit.map((transit, index) => (
                <div key={index} className="flex justify-between items-center text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faTrain} className="text-gray-600" />
                    <span>{transit.name}</span>
                  </div>
                  <span className="text-gray-600 ml-2">{transit.distance} km</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beaches */}
        <div className="mt-8 bg-gray-100 md:bg-gray-200 hover:bg-orange-100 transition rounded-lg p-4 shadow-xl">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faUmbrellaBeach} className="text-gray-600" />
            Beaches in the Neighborhood
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {areaData?.beaches.map((beach, index) => (
              <div key={index} className="flex justify-between items-center text-sm md:text-base">
                <span>{beach.name}</span>
                <span className="text-gray-600 ml-2">{beach.distance} km</span>
              </div>
            ))}
          </div>
        </div>

        {/* Airports */}
        <div className="mt-8 bg-gray-100 md:bg-gray-200 hover:bg-yellow-100 transition rounded-lg p-4 shadow-xl">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faPlane} className="text-gray-600" />
            Closest Airports
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {areaData?.airports.map((airport, index) => (
              <div key={index} className="flex justify-between items-center text-sm md:text-base">
                <span>{airport.name}</span>
                <span className="text-gray-600 ml-2">{airport.distance} km</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            Shortest estimated walking or driving distances displayed. Actual distances may vary.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-2">
            <span className="text-sm">Missing some information?</span>
            <div className="flex items-center gap-2">
              <span className="text-blue hover:underline cursor-pointer">Yes</span>
              <span>/</span>
              <span className="text-blue hover:underline cursor-pointer">No</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 