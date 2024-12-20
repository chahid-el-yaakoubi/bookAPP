import React from 'react';
import { SimilarProperties } from './componentHotel/SimilarProperties';
import { GuestReviews } from './componentHotel/GuestReviews';
// import { RoomCalendar } from './componentHotel/RoomCalendar';
import { PropertyPolicies } from './componentHotel/PropertyPolicies';

const hotelData = {
  similarProperties: [
    {
      id: 1,
      name: "Luxury Beach Resort & Spa",
      location: "Agadir, Morocco",
      mainImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      rating: 4.8,
      reviewCount: 245,
      price: 1200
    },
    {
      id: 2,
      name: "Mountain View Hotel",
      location: "Ifrane, Morocco",
      mainImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      rating: 4.6,
      reviewCount: 182,
      price: 800
    },
    {
      id: 3,
      name: "Medina Heritage Riad",
      location: "Fes, Morocco",
      mainImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      rating: 4.9,
      reviewCount: 312,
      price: 1500
    }
  ],
  
  reviews: [
    {
      id: 1,
      userName: "Sarah M.",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      rating: 5,
      date: "2024-02-15",
      comment: "Amazing stay! The service was impeccable and the views were breathtaking.",
      pros: ["Beautiful location", "Excellent service", "Clean rooms"],
      cons: ["Slightly expensive"]
    },
    {
      id: 2,
      userName: "John D.",
      userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
      rating: 4,
      date: "2024-02-10",
      comment: "Great experience overall. The staff was very friendly and helpful.",
      pros: ["Friendly staff", "Good location", "Comfortable beds"],
      cons: ["Wifi could be better"]
    }
  ],

  availability: {
    bookedDates: [
      "2024-03-15",
      "2024-03-16",
      "2024-03-17",
      "2024-03-25",
      "2024-03-26"
    ],
    priceByDate: {
      "2024-03-14": 1200,
      "2024-03-18": 1200,
      "2024-03-19": 1100,
      "2024-03-20": 1100,
      "2024-03-21": 1300
    },
    minStay: 2,
    maxStay: 14
  },

  policies: {
    checkIn: {
      from: "15:00",
      to: "23:00"
    },
    checkOut: {
      from: "07:00",
      to: "11:00"
    },
    cancellation: {
      freeUntil: "48 hours before check-in",
      penalties: "One night charge after free cancellation period"
    },
    houseRules: [
      "No smoking",
      "No parties or events",
      "Pets allowed (on request)",
      "Children welcome"
    ],
    paymentOptions: [
      "Credit Card",
      "Debit Card",
      "Cash"
    ],
    specialNotes: [
      "Tourist tax may apply",
      "Security deposit required",
      "Government-issued ID required at check-in"
    ]
  }
};

export const TestLastAdded = () => {
    return <>
        <SimilarProperties properties={hotelData.similarProperties} />
        <PropertyPolicies policies={hotelData.policies} />
        <GuestReviews reviews={hotelData.reviews} />
    </>;
};

