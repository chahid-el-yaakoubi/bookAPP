import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faPerson, faSearch, faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextApi/SearchContext';
import { useTranslation } from 'react-i18next';

export const SearchForm = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // State management
  const [dateRange, setDateRange] = useState(() => {
    const savedDateRange = JSON.parse(localStorage.getItem('dateRange'));
    const defaultRange = [{
      startDate: today,
      endDate: today,
      key: 'selection'
    }];

    if (!savedDateRange || savedDateRange.length === 0) return defaultRange;

    const savedStartDate = new Date(savedDateRange[0].startDate);
    const savedEndDate = new Date(savedDateRange[0].endDate);

    return savedStartDate < today ? defaultRange : [{
      startDate: savedStartDate,
      endDate: savedEndDate,
      key: 'selection'
    }];
  });

  const [destination, setDestination] = useState(() => localStorage.getItem('destination') || '');
  const [options, setOptions] = useState(() => JSON.parse(localStorage.getItem('Options')) || { Adult: 2, Children: 0, room: 1 });
  const [opendate, setOpendate] = useState(false);
  const [openoptions, setOpenOptions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);

  // LocalStorage effects
  useEffect(() => { localStorage.setItem('dateRange', JSON.stringify(dateRange)); }, [dateRange]);
  useEffect(() => { localStorage.setItem('destination', destination); }, [destination]);
  useEffect(() => { localStorage.setItem('Options', JSON.stringify(options)); }, [options]);

  // Add useEffect for handling clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (opendate || openoptions) {
        const datePickerContainer = document.querySelector('.date-picker-container');
        const optionsContainer = document.querySelector('.options-container');
        const dateButton = document.querySelector('.date-button');
        const optionsButton = document.querySelector('.options-button');

        if (
          (datePickerContainer && !datePickerContainer.contains(event.target) && !dateButton.contains(event.target)) ||
          (optionsContainer && !optionsContainer.contains(event.target) && !optionsButton.contains(event.target))
        ) {
          setOpendate(false);
          setOpenOptions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [opendate, openoptions]);

  // Handlers
  const handleDateChange = (ranges) => setDateRange([ranges.selection]);

  const handleClick = (field, operation, min) => {
    setOptions(prev => ({
      ...prev,
      [field]: operation === 'increase' ? prev[field] + 1 : Math.max(min, prev[field] - 1)
    }));
  };

  const handleSearch = () => {
    if (!destination) {
      setShowAlert(true);
      return;
    }

    dispatch({
      type: 'NEW_SEARCH',
      payload: { city: destination, dates: dateRange, options: options }
    });

    navigate(`/hotels/${destination}`, { state: { dateRange, destination, options } });
  };

  const handleDateClick = () => {
    setOpendate(!opendate);
    if (openoptions) setOpenOptions(false);
  };

  const handleCloseDatePicker = () => {
    setOpendate(false);
  };

  return (
    <div className="searchbar sticky md:absolute left-0 right-0 mx-4 top-24 md:mx-auto max-w-[1024px] w-full z-10">
      <div className={`searchItem flex flex-col md:flex-row border-4 border-gray-500 text-black justify-between items-stretch md:items-center rounded-lg bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Destination Input */}
        <div className={`searchComponent rounded bg-white test border-b-4 md:border-b-0 ${isRTL ? 'md:border-l-4' : 'md:border-r-4'} ps-4 border-blue relative flex items-center w-full md:w-1/3`}>
          <FontAwesomeIcon icon={faMagnifyingGlassLocation} className={isRTL ? 'ml-2' : 'mr-2'} />
          <input 
            type="search" 
            className='placeholder:text-gray-600 w-full h-[50px] p-2  text-gray-900 outline-none ' 
            placeholder={t('search.whereTo')}
            value={destination} 
            onChange={(e) => {
              setDestination(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase());
              setShowAlert(false);
            }} 
            dir={isRTL ? 'ltr' : 'ltr'}
          />
          {showAlert && (
            <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-12 bg-red-600 text-white px-3 rounded-md shadow-lg z-50 flex items-center space-x-2 alertInput`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01m-6.938 1.687A9.956 9.956 0 0112 2.25c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.956 9.956 0 01-7.938-3.937M9.75 15h4.5m0-4.5h-.011" />
              </svg>
              <span>{t('search.alertMessage')}</span>
            </div>
          )}
        </div>

        {/* Date Range Picker */}
        <div className={`searchComponent border-b-4 md:border-b-0 ${isRTL ? 'md:border-l-4' : 'md:border-r-4'} border-blue relative bg-white w-full md:w-1/3`}>
          <div className='cursor-pointer p-4 text-sm md:text-base date-button w-full'
            onClick={handleDateClick}>
            <FontAwesomeIcon icon={faCalendarDay} className={isRTL ? 'ml-3' : 'mr-3'} />
            <span className='text-black'>
              {`${format(dateRange[0].startDate, "MMM dd, yyyy")} --- ${format(dateRange[0].endDate, "MMM dd, yyyy")}`}
            </span>
          </div>

          {opendate && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" 
                onClick={handleCloseDatePicker}
              ></div>
              
              <div className="date-picker-container absolute top-14 left-0 md:left-auto w-screen md:w-auto">
                <div className="date-picker-header md:hidden flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">{t('search.selectDates')}</h2>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={handleCloseDatePicker}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <DateRange
                  editableDateInputs
                  onChange={handleDateChange}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  minDate={today}
                  maxDate={maxDate}
                  months={2}
                  direction={window.innerWidth > 768 ? "horizontal" : "vertical"}
                  className="date-range-wrapper bg-white"
                  rangeColors={['#2563eb']}
                  showMonthAndYearPickers={true}
                  monthDisplayFormat="MMMM yyyy"
                />
              </div>
            </>
          )}
        </div>

        {/* Options Selector */}
        <div className={`searchComponent test border-b-4 md:border-b-0 ${isRTL ? 'md:border-l-4' : 'md:border-r-4'} border-blue relative bg-white w-full md:w-1/3`}>
          <div className="p-4 cursor-pointer text-sm md:text-base options-button" 
            onClick={() => {
              setOpenOptions(!openoptions);
              if (opendate) setOpendate(false);
            }}>
            <FontAwesomeIcon icon={faPerson} className={isRTL ? 'ml-3' : 'mr-3'} />
            <span className='text-black'>
              {`${options.Adult} ${t('search.adults')} · ${options.Children} ${t('search.children')} · ${options.room} ${t('search.rooms')}`}
            </span>
          </div>

          {openoptions && (
            <div className={`options-container bg-white absolute top-14 ${isRTL ? 'right-0' : 'left-0'} md:left-auto rounded-lg shadow-lg z-50 w-screen md:w-auto`}>
              <div className="p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Adults */}
                <div className="option-item flex items-center justify-between">
                  <div className="option-text">
                    <h3 className="text-gray-700 font-medium">{t('search.adults')}</h3>
                    <p className="text-gray-500 text-sm">{t('search.ageText.adults')}</p>
                  </div>
                  <div className="option-counter flex items-center gap-3">
                    <button
                      className="counter-btn disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleClick('Adult', 'decrease', 1)}
                      disabled={options.Adult <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="counter-number">{options.Adult}</span>
                    <button
                      className="counter-btn"
                      onClick={() => handleClick('Adult', 'increase', 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="option-item flex items-center justify-between">
                  <div className="option-text">
                    <h3 className="text-gray-700 font-medium">{t('search.children')}</h3>
                    <p className="text-gray-500 text-sm">{t('search.ageText.children')}</p>
                  </div>
                  <div className="option-counter flex items-center gap-3">
                    <button
                      className="counter-btn disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleClick('Children', 'decrease', 0)}
                      disabled={options.Children <= 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="counter-number">{options.Children}</span>
                    <button
                      className="counter-btn"
                      onClick={() => handleClick('Children', 'increase', 0)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Rooms */}
                <div className="option-item flex items-center justify-between">
                  <div className="option-text">
                    <h3 className="text-gray-700 font-medium">{t('search.rooms')}</h3>
                  </div>
                  <div className="option-counter flex items-center gap-3">
                    <button
                      className="counter-btn disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleClick('room', 'decrease', 1)}
                      disabled={options.room <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="counter-number">{options.room}</span>
                    <button
                      className="counter-btn"
                      onClick={() => handleClick('room', 'increase', 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          className='bg-blue hover:bg-blue/80 m-1 h-full text-white p-3 rounded gap-2 md:py-auto flex items-center justify-center space-x-2 w- md:w-auto' 
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} /> 
          <span className='text-sm md:text-base'>{t('search.search')}</span>
        </button>
      </div>
    </div>
  );
}; 