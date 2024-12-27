import React, { useState } from "react";

function AddHotel() {
  const [hotelData, setHotelData] = useState({
    name: "",
    title: "",
    type: "apartment",
    location: {
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      distanceFromCityCenter: "",
    },
    contact: {
      phone: "",
      bookingPhone: "",
      email: "",
      website: "",
    },
    description: "",
    photos: [],
    basePrice: "",
    pricing: {
      taxIncluded: true,
      currency: "USD",
      additionalFees: {
        cleaningFee: 0,
        serviceFee: 0,
      },
      discounts: {
        weekly: 0,
        monthly: 0,
      },
    },
    rental: {
      durationType: "daily",
      customDays: 1,
      minimumStay: 1,
      maximumStay: 30,
    },
    amenities: {
      basic: [],
      premium: [],
      safety: [],
    },
    policies: {
      pets: { allowed: false, extraFee: 0 },
      smoking: { allowed: false },
      events: { allowed: false, restrictions: "" },
      quietHours: { enforced: true, from: "", to: "" },
      cancellationPolicy: { flexible: true, details: "" },
      checkIn: { from: "", to: "" },
      checkOut: { from: "", to: "" },
    },
    rooms: [],
    nearbyAttractions: [],
    status: "available",
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({
      ...hotelData,
      [name]: value,
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setHotelData({
      ...hotelData,
      location: {
        ...hotelData.location,
        [name]: value,
      },
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setHotelData({
      ...hotelData,
      contact: {
        ...hotelData.contact,
        [name]: value,
      },
    });
  };

  const handlePoliciesChange = (e) => {
    const { name, value } = e.target;
    setHotelData({
      ...hotelData,
      policies: {
        ...hotelData.policies,
        [name]: value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(hotelData);
    // Here you would typically send hotelData to your backend API
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Add New Hotel</h2>
      <form onSubmit={handleSubmit}>
        {/* Hotel Basic Information */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Hotel Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={hotelData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Hotel Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={hotelData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Hotel Type
            </label>
            <select
              id="type"
              name="type"
              value={hotelData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Location</h3>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={hotelData.location.city}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={hotelData.location.address}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={hotelData.location.latitude}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={hotelData.location.longitude}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="distanceFromCityCenter" className="block text-sm font-medium text-gray-700">
              Distance from City Center
            </label>
            <input
              type="text"
              id="distanceFromCityCenter"
              name="distanceFromCityCenter"
              value={hotelData.location.distanceFromCityCenter}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Contact Information</h3>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={hotelData.contact.phone}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="bookingPhone" className="block text-sm font-medium text-gray-700">
              Booking Phone
            </label>
            <input
              type="text"
              id="bookingPhone"
              name="bookingPhone"
              value={hotelData.contact.bookingPhone}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={hotelData.contact.email}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={hotelData.contact.website}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Policies */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Policies</h3>
          <div>
            <label htmlFor="petsAllowed" className="block text-sm font-medium text-gray-700">
              Pets Allowed (true/false)
            </label>
            <input
              type="text"
              id="petsAllowed"
              name="petsAllowed"
              value={hotelData.policies.pets.allowed}
              onChange={handlePoliciesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="smokingAllowed" className="block text-sm font-medium text-gray-700">
              Smoking Allowed (true/false)
            </label>
            <input
              type="text"
              id="smokingAllowed"
              name="smokingAllowed"
              value={hotelData.policies.smoking.allowed}
              onChange={handlePoliciesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="eventsAllowed" className="block text-sm font-medium text-gray-700">
              Events Allowed (true/false)
            </label>
            <input
              type="text"
              id="eventsAllowed"
              name="eventsAllowed"
              value={hotelData.policies.events.allowed}
              onChange={handlePoliciesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="quietHours" className="block text-sm font-medium text-gray-700">
              Quiet Hours (from, to)
            </label>
            <input
              type="text"
              id="quietHours"
              name="quietHours"
              value={`${hotelData.policies.quietHours.from} - ${hotelData.policies.quietHours.to}`}
              onChange={handlePoliciesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. 10 PM - 7 AM"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700"
          >
            Add Hotel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddHotel;
  