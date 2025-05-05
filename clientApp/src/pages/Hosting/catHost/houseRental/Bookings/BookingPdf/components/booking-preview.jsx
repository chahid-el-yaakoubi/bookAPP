import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Home, CreditCard, Phone, Mail, Users } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"


export default function BookingCard({ bookingData }) {
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format price to include currency symbol and commas
  const formatPrice = (price) => {
    if (!price && price !== 0) return "";

    // If price is already formatted with currency symbol, return as is
    if (typeof price === 'string' && price.includes('$')) {
      return price;
    }

    // Otherwise format the number
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calculate number of nights
  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Generate a verification URL based on booking ID
  const verificationUrl = bookingData.bookingId
    ? `https://stayWhere.com/verify/${bookingData.bookingId}`
    : "";

  const nights = calculateNights(bookingData.startDate, bookingData.endDate);

  return (
    <div className="border border-gray-900 rounded-lg overflow-hidden shadow-lg max-w-lg mx-auto bg-gradient-to-b from-blue to-orange-500 ">
      {/* Header with logo */}
      <div className="bg-blue px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <svg width="40" height="40" viewBox="0 0 40 40" className="mr-2">
            <rect width="40" height="40" fill="#ff6b00" rx="4" />
            <text x="4" y="16" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="white">S</text>
            <text x="24" y="34" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="white">w</text>
          </svg>
          <span className="text-black font-bold text-xl">stayWhere</span>
        </div>
        <div className={`${bookingData.status === 'confirmed' ? 'bg-green-500' : bookingData.status === 'pending' ? 'bg-orange-500' : 'bg-gray-900'} px-3 py-1 rounded-full`}>
          <span className="text-black text-sm font-medium capitalize">{bookingData.status || 'Processing'}</span>
        </div>
      </div>

      {/* Booking content */}
      <div className="p-6 space-y-6 text-black">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmation</h2>
            <p className="text-sm text-gray-900">Thank you for choosing stayWhere</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Booking ID:</p>
            <p className="text-lg font-bold text-black">{bookingData.bookingId}</p>
          </div>
        </div>

        {/* Guest and Hotel Info */}
        <div className="pt-4 border-t border-gray-900 grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="flex items-start">
            <User className="mr-2 text-black flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">Guest</p>
              <p className="font-medium">{bookingData.guestName}</p>
              <div className="flex items-center mt-1">
                <Phone className="mr-1 text-gray-900" size={14} />
                <p className="text-sm text-gray-900">{bookingData.guestPhone}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <Home className="mr-2 text-black flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">Property</p>
              <p className="font-medium">{bookingData.propertyId?.title || bookingData.hotelName}</p>
              <p className="text-sm text-gray-900">{bookingData.roomId?.type || bookingData.roomType}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="mr-2 text-orange-500 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">Check-in</p>
              <p className="font-medium">{formatDate(bookingData.startDate || bookingData.checkIn)}</p>
              <p className="text-sm text-gray-900">After 3:00 PM</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="mr-2 text-orange-500 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">Check-out</p>
              <p className="font-medium">{formatDate(bookingData.endDate || bookingData.checkOut)}</p>
              <p className="text-sm text-gray-900">Before 11:00 AM</p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="mr-2 text-black flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">Location</p>
              <p className="font-medium">
                {bookingData.propertyId?.location?.city
                  ? `${bookingData.propertyId.location.city}, ${bookingData.propertyId.location.country}`
                  : bookingData.location || "Location info unavailable"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Users className="mr-2 text-black flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">Guests</p>
              <p className="font-medium">{bookingData.guests || "2"} {bookingData.guests === 1 ? "Guest" : "Guests"}</p>
              <p className="text-sm text-gray-900">{nights} {nights === 1 ? "Night" : "Nights"}</p>
            </div>
          </div>
        </div>

        {/* Price section */}
        <div className="bg-gray-200 rounded-lg p-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">Total Price</p>
              <div className="flex items-center">
                <CreditCard className="mr-2 text-orange-500" size={20} />
                <p className="font-bold text-lg text-orange-500">{formatPrice(bookingData.totalPrice)}</p>
              </div>
              {/* <p className="text-xs text-gray-900">Taxes included</p> */}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Payment Method</p>
              <p className="font-medium capitalize">{bookingData.payment?.method || "Credit Card"}</p>
              <p className="text-xs text-gray-900">{bookingData.payment?.cashReceived ? "Payment received" : "Pending payment"}</p>
            </div>
          </div>
        </div>

        {/* QR Code section */}
        <div className="flex justify-center pt-6 border-t border-gray-900">
          <div className="text-center">
            <div className="border-4 border-blue rounded-lg p-2 inline-block">
              <QRCodeSVG value={verificationUrl} size={120} level="H" includeMargin={true} />
            </div>
            <p className="text-sm font-medium mt-2">Scan for easy check-in</p>
            <p className="text-xs text-gray-900">Present this confirmation at the front desk</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-orange-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-900">Need help? Contact us at</p>
          <a href="mailto:support@stayWhere.com" className="text-sm font-medium text-black">support@stayWhere.com</a>
        </div>
      </div>
    </div>
  );
}