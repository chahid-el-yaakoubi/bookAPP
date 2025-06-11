import React, { useState, useContext } from 'react';
import { DateRange } from 'react-date-range';
import { format, differenceInDays } from 'date-fns';
import { ChevronDown, Calendar, Users, Star } from 'lucide-react';
import { SearchContext } from '../../../contexts/SearchContext';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import ContactOwnersModule from '../../../components/ContactOwnersModule';

// Load saved dates from localStorage and convert to Date objects
function getStoredDates() {
  const stored = localStorage.getItem('dates');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((d) => ({
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      key: d.key || 'selection',
    }));
  } catch (e) {
    return null;
  }
}

export function BookingCard({ pricePerNight, rating, reviewCount, hotel, roomId  }) {
  const { dates, options, dispatch, city } = useContext(SearchContext);

  const [showBookingCard, setShowBookingCard] = useState(false);
  const onCloseBookingCard = () => {
    setShowBookingCard(false);
  };
  let guests = 1; // Default value if parsing fails

  if (options) {
    try {
      const getOptions = options;
      guests = (getOptions.Adult || 0) + (getOptions.Children || 0);
    } catch (error) {
      console.error("Failed to parse options from localStorage", error);
    }
  }

  const storedDates = getStoredDates();
  const initialStart = storedDates?.[0]?.startDate || dates?.[0]?.startDate || new Date();
  const initialEnd = storedDates?.[0]?.endDate || dates?.[0]?.endDate || new Date();

  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (ranges) => {
    const selection = ranges.selection;
    const newDates = [{
      startDate: selection.startDate,
      endDate: selection.endDate,
      key: 'selection',
    }];

    // Update local state
    setStartDate(selection.startDate);
    setEndDate(selection.endDate);

    // Save to localStorage
    localStorage.setItem("dates", JSON.stringify(newDates));

    // Dispatch to context
    dispatch({ type: "UPDATE_DATES", payload: newDates });
  };

  const nights = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));
  const totalPrice = nights * pricePerNight;
  const serviceFee = 0;
  const grandTotal = totalPrice + serviceFee;

  return (
    <div className="border border-gray-200 rounded-2xl p-5 shadow-xl bg-white max-w-md mx-auto w-full relative">
      {/* Price & rating */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <div>
          <span className="text-3xl font-bold text-blue-700">MAD {pricePerNight}</span>
          <span className="text-gray-500 ml-1">/night</span>
        </div>
        {/* <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="flex items-center bg-blue text-blue-700 px-2 py-1 rounded-full text-sm font-semibold">
            <Star size={16} className="mr-1" /> {rating}
          </span>
          <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
        </div> */}
      </div>

      {/* Date & guests */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x">
          {[{
            label: 'Check-in',
            date: startDate,
          }, {
            label: 'Check-out',
            date: endDate,
          }].map((item, i) => (
            <button
              key={i}
              className="flex flex-col items-start p-4 hover:bg-blue transition text-left"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Calendar size={14} /> {item.label}
              </span>
              <span className="text-base font-medium mt-1">{format(item.date, 'MMM d, yyyy')}</span>
            </button>
          ))}
        </div>
        <div className="border-t p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Users size={14} /> Guests
          </span>
          <span className="font-medium">{guests} guest{guests > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Date picker */}
      {showDatePicker && (
        <div className="absolute right-0 -left-3 top-40 z-50 bg-white shadow-2xl rounded-xl p-4 border mt-2">
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={[{
              startDate,
              endDate,
              key: 'selection',
            }]}
          />
        </div>
      )}

      {/* Reserve button */}
      <button
        className="w-full bg-blue text-white py-3 rounded-xl font-bold text-lg mt-4 shadow-md hover:bg-blue transition"
        onClick={() => {
          dispatch({
            type: 'NEW_SEARCH',
            payload: {
              city,
              dates: [{ startDate, endDate, key: 'selection' }],
              options,
            },
          });
          setShowBookingCard(true);
        }}
      >
        Reserve
      </button>

      {/* Price breakdown */}
      <div className="mt-6 bg-gray-50 rounded-xl p-5 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="underline">MAD {pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
          <span className="font-medium">MAD {totalPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="underline">Service fee</span>
          <span>MAD {serviceFee}</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-blue-700">MAD {grandTotal}</span>
        </div>
      </div>

      {showBookingCard && <ContactOwnersModule hotel={hotel} roomId={roomId} onClose={onCloseBookingCard} />}
    </div>
  );
}
