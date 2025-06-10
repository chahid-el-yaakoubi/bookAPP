// src/components/DateRangePicker.jsx
import { DateRange } from 'react-date-range';
import { SearchContext } from '../src/contexts/SearchContext';
import { useContext, useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export function DateRangePicker({ show, onClose }) {
  const { dates, dispatch } = useContext(SearchContext);
  const today = new Date();
  const getValidDate = (d) => {
    if (!d) return today;
    const dateObj = new Date(d);
    return isNaN(dateObj.getTime()) ? today : dateObj;
  };

  // Always keep a single range with key 'selection'
  const [dateRange, setDateRange] = useState([
    {
      startDate: getValidDate(dates && dates[0]),
      endDate: getValidDate(dates && dates[1]),
      key: 'selection',
    },
  ]);

  // Sync with context changes
  useEffect(() => {
    setDateRange([
      {
        startDate: getValidDate(dates && dates[0]),
        endDate: getValidDate(dates && dates[1]),
        key: 'selection',
      },
    ]);
  }, [dates]);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleApplyDates = () => {
    dispatch({
      type: 'UPDATE_DATES',
      payload: [dateRange[0].startDate, dateRange[0].endDate],
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white shadow-2xl rounded-lg p-4 border max-w-fit">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Select Dates</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>
        <DateRange
          editableDateInputs
          onChange={handleDateChange}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          minDate={today}
          months={window.innerWidth > 768 ? 2 : 1}
          direction={window.innerWidth > 768 ? 'horizontal' : 'vertical'}
          className="date-range-wrapper"
          rangeColors={['#2563eb']}
          showMonthAndYearPickers={true}
          monthDisplayFormat="MMMM yyyy"
        />
        <div className="flex justify-between mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyDates}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Apply Dates
          </button>
        </div>
      </div>
    </div>
  );
}