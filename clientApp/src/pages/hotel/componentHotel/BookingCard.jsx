import React, { useState, useContext } from 'react';
import { DateRange } from 'react-date-range';
import { format, differenceInDays } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { SearchContext } from '../../../contexts/SearchContext';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ContactOwnersModule } from '../../../components/ContactOwnersModule';

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

export function BookingCard({ pricePerNight, rating, reviewCount, hotel, room = null }) {
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
    <div className="border rounded-xl p-6 shadow-lg sticky top-24 bg-white z-30 ">
      {/* Price & rating */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-2xl font-semibold">MAD {pricePerNight}</span>
          <span className="text-gray-500"> night</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">★ {rating}</span>
          <span className="text-gray-500"> · {reviewCount} reviews</span>
        </div>
      </div>

      {/* Date & guests */}
      <div className="border rounded-t-lg">
        <div className="grid grid-cols-2 divide-x">
          {[{
            label: 'CHECK-IN',
            date: startDate,
          }, {
            label: 'CHECKOUT',
            date: endDate,
          }].map((item, i) => (
            <button
              key={i}
              className="p-3 text-left"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <div className="text-xs font-semibold">{item.label}</div>
              <div>{format(item.date, 'MMM d, yyyy')}</div>
            </button>
          ))}
        </div>

        <div className="border-t p-3">
          <div className="text-xs font-semibold">GUESTS</div>
          <div className="flex justify-between items-center">

            <div>{guests} guest{(guests) > 1 ? 's' : ''}</div>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Date picker */}
      {showDatePicker && (
        <div className="absolute right-0  z-50 bg-white shadow-2xl rounded-lg p-4 border mt-2">
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
        className="w-full bg-[#38f8f8] text-black py-3 rounded-lg font-semibold mt-4 hover:bg-[#32e2e2] transition"
        onClick={() =>
        {
          dispatch({
            type: 'NEW_SEARCH',
            payload: {
              city,
              dates: [{ startDate, endDate, key: 'selection' }],
              options,
            },
          }); 
          setShowBookingCard(true);
        }
        }
      >
        Reserve
      </button>

      {/* Price breakdown */}
      <div className="mt-4 space-y-4">
        <div className="flex justify-between">
          <div className="underline">
            MAD {pricePerNight} × {nights} night{nights > 1 ? 's' : ''}
          </div>
          <div>MAD {totalPrice}</div>
        </div>
        <div className="flex justify-between">
          <div className="underline">Service fee</div>
          <div>MAD {serviceFee}</div>
        </div>
        <div className="border-t pt-4 flex justify-between font-semibold">
          <div>Total</div>
          <div>MAD {grandTotal}</div>
        </div>
      </div>

      {
        showBookingCard && <ContactOwnersModule hotel={hotel} room={room} onClose={onCloseBookingCard}  />
      }
    </div>
  );
}
