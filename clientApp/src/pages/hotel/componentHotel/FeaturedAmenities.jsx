import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSwimmingPool,
  faParking,
  faUtensils,
  faWifi,
  faSpa,
  faGlassMartini,
  faConciergeBell,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";

const amenitiesList = [
  { id: 'pool', icon: faSwimmingPool, text: "Swimming Pool" },
  { id: 'parking', icon: faParking, text: "Free Parking" },
  { id: 'restaurant', icon: faUtensils, text: "Restaurant" },
  { id: 'wifi', icon: faWifi, text: "Free WiFi" },
  { id: 'spa', icon: faSpa, text: "Spa Services" },
  { id: 'bar', icon: faGlassMartini, text: "Bar & Lounge" },
  { id: 'roomService', icon: faConciergeBell, text: "Room Service" },
  { id: 'ac', icon: faSnowflake, text: "Air Conditioning" }
];

export const FeaturedAmenities = () => {
  return (
    <section className="border-t pt-6" aria-labelledby="amenities-heading">
      <h2 id="amenities-heading" className="text-xl sm:text-2xl font-semibold mb-4">
        Featured Property Amenities
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {amenitiesList.map(({ id, icon, text }) => (
          <div 
            key={id}
            className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 sm:p-4 bg-gray-100/70 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-primary rounded">
              <FontAwesomeIcon icon={icon} className="text-white w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-gray-700">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}; 