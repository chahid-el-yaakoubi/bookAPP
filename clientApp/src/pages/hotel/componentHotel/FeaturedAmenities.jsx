import React from 'react';

const amenitiesList = [
  { id: "wifi", text: "Wi-Fi 📶" },
  { id: "ac", text: "Air Conditioning ❄️" },
  { id: "heating", text: "Heating 🔥" },
  { id: "hotWater", text: "Hot Water 🚿" },
  { id: "kitchen", text: "Fully Equipped Kitchen 🍽️" },
  { id: "washingMachine", text: "Washing Machine 🧺" },
  { id: "tv", text: "TV 📺" },
  { id: "privateBathroom", text: "Private Bathroom 🚽" },
  { id: "parking", text: "Parking 🚗" },
  { id: "security", text: "Security (Gated Community or Guard) 🔐" }
];

export const FeaturedAmenities = () => {
  return (
    <section className="border-t pt-6" aria-labelledby="amenities-heading">
      <h2 id="amenities-heading" className="text-2xl font-semibold mb-6 text-gray-900">
        Featured Property Amenities
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {amenitiesList.map(({ id, text }) => (
          <div 
            key={id}
            className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
          >
            <span className="text-base font-medium text-gray-800">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};