
export const HotelBookingBox = ({ hotel, nights,  options, dates, contactModule }) => {

  
  const checkIn = dates?.[0]?.startDate ? new Date(dates[0].startDate).toLocaleDateString('fr-FR') : '';
  const checkOut = dates?.[0]?.endDate ? new Date(dates[0].endDate).toLocaleDateString('fr-FR') : '';
  return (
    <div className="bg-blue p-4 max-h-[900px] sm:p-6 rounded-lg sticky top-4 mx-4 sm:mx-0">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
            {hotel?.rating || "9.2"}
          </span>
          <span className="font-semibold">Excellent</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {hotel?.reviews || "1250"} reviews
        </p>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2 text-sm sm:text-base">
          Price for {nights} {nights === 1 ? 'night' : 'nights'}
        </h3>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          MAD {hotel?.cheapestPrice * nights * options.room}
        </div>
        <p className="text-xs sm:text-sm text-gray-500">Includes taxes and fees</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>Check-in</span>
          <span className="font-semibold">{checkIn || ""}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Check-out</span>
          <span className="font-semibold">{checkOut || ""}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Guests</span>
          <span className="font-semibold">{options.room} rooms, {options?.Adult} adults</span>
        </div>
      </div>

      <button onClick={()=>contactModule()} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition mt-4 text-sm sm:text-base">
        Reserve Now
      </button>
    </div>
  );
}; 