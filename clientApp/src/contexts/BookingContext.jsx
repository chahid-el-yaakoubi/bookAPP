import React, { createContext, useContext, useState } from 'react';
import { addDays } from 'date-fns';

const BookingContext = createContext(undefined);

export function BookingProvider({ children }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 5));
  const [guests, setGuests] = useState(1);

  const setDateRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const calculateTotalPrice = (pricePerNight) => {
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return nights * pricePerNight;
  };

  return (
    <BookingContext.Provider value={{ startDate, endDate, guests, setDateRange, setGuests, calculateTotalPrice }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
