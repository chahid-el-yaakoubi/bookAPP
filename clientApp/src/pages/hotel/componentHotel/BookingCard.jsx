import { useState } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
// import { useBooking } from '../context/BookingContext';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useBooking } from '../../../contexts/BookingContext';

export function BookingCard({ pricePerNight, rating, reviewCount }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { startDate, endDate, guests, setDateRange, setGuests, calculateTotalPrice } = useBooking();

  const handleSelect = (ranges) => {
    setDateRange(ranges.selection.startDate, ranges.selection.endDate);
  };

  const totalPrice = calculateTotalPrice(pricePerNight);
  const serviceFee = Math.floor(totalPrice * 0.15);

  return (
    <div className="border rounded-xl p-6 shadow-lg sticky top-24">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-2xl font-semibold">${pricePerNight}</span>
          <span className="text-gray-500"> night</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">★ {rating}</span>
          <span className="text-gray-500"> · {reviewCount} reviews</span>
        </div>
      </div>

      <div className="border rounded-t-lg">
        <div className="grid grid-cols-2 divide-x">
          <button
            className="p-3 text-left"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <div className="text-xs font-semibold">CHECK-IN</div>
            <div>{format(startDate, 'MMM d, yyyy')}</div>
          </button>
          <button
            className="p-3 text-left"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <div className="text-xs font-semibold">CHECKOUT</div>
            <div>{format(endDate, 'MMM d, yyyy')}</div>
          </button>
        </div>

        <div className="border-t p-3">
          <div className="text-xs font-semibold">GUESTS</div>
          <div className="flex justify-between items-center">
            <div>{guests} guest</div>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {showDatePicker && (
        <div className="absolute z-10 bg-white shadow-2xl rounded-lg p-4 border mt-2">
          <DateRange
            ranges={[{
              startDate,
              endDate,
              key: 'selection'
            }]}
            onChange={handleSelect}
            minDate={new Date()}
          />
        </div>
      )}

      <button className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-semibold mt-4 hover:bg-[#E31C5F] transition">
        Reserve
      </button>

      <div className="mt-4 space-y-4">
        <div className="flex justify-between">
          <div className="underline">${pricePerNight} × {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} nights</div>
          <div>${totalPrice}</div>
        </div>
        <div className="flex justify-between">
          <div className="underline">Service fee</div>
          <div>${serviceFee}</div>
        </div>
        <div className="border-t pt-4 flex justify-between font-semibold">
          <div>Total</div>
          <div>${totalPrice + serviceFee}</div>
        </div>
      </div>
    </div>
  );
}
