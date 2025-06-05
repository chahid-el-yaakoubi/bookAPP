import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faPerson, faSearch, faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../contexts/SearchContext';
import { useTranslation } from 'react-i18next';
import { getRegions } from '../Lib/api';

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

  // State for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cities = ["Nador"];
  const [filteredCities, setFilteredCities] = useState(cities);

  // Add useEffect for handling clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const datePickerContainer = document.querySelector('.date-picker-container');
      const optionsContainer = document.querySelector('.options-container');
      const dateButton = document.querySelector('.date-button');
      const optionsButton = document.querySelector('.options-button');
      const dropdown = document.querySelector('.city-dropdown'); // Add reference for city dropdown

      if (
        (opendate && datePickerContainer && !datePickerContainer.contains(event.target) && !dateButton.contains(event.target)) ||
        (openoptions && optionsContainer && !optionsContainer.contains(event.target) && !optionsButton.contains(event.target)) ||
        (isDropdownOpen && dropdown && !dropdown.contains(event.target)) // Close city dropdown
      ) {
        setOpendate(false);
        setOpenOptions(false);
        setIsDropdownOpen(false); // Close city dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [opendate, openoptions, isDropdownOpen]); // Include `isDropdownOpen` in dependencies



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
    <div className="searchbar sticky md:absolute left-0 right-0 mx-4 top-24 md:mx-auto max-w-[1024px] w-full z-40">
      <div className={`searchItem flex flex-col md:flex-row border-4 border-gray-500 text-black justify-between items-stretch md:items-center rounded-lg  ${showAlert ? 'bg-red-500': 'bg-white' } ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Destination Input */}

        <div className="relative w-full md:w-1/3">
          <div className={`searchComponent rounded  ${showAlert ? 'bg-red-500': 'bg-white' } test border-b-4 md:border-b-0 ${isRTL ? 'md:border-l-4' : 'md:border-r-4'} ps-4 border-blue relative flex items-center w-full`}>
            <FontAwesomeIcon icon={faMagnifyingGlassLocation} className={isRTL ? 'ml-2' : 'mr-2'} />

            {/* Search Input */}
            <input
              type="search"
              className={` ${showAlert ? 'placeholder:text-red-500' : 'placeholder:text-gray-600'} w-full h-[50px] p-2 text-gray-900 outline-none ${isRTL ? 'text-right' : 'text-left' }  `}
              placeholder={t('search.whereTo')}
              value={destination}
              onFocus={() => setIsDropdownOpen(true)} // Show dropdown on focus
              onChange={(e) => {
                const query = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
                setDestination(query);
                setFilteredCities(cities.filter(city => city.toLowerCase().includes(query.toLowerCase())));
                setIsDropdownOpen(true);
              }}
              dir={isRTL ? 'ltr' : 'ltr'}
            />
          </div>

          {/* City Suggestions Dropdown */}
          {isDropdownOpen && (
            <div className="city-dropdown absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1  max-h-80 overflow-auto z-50">
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-blue hover:text-white cursor-pointer"
                    onClick={() => {
                      setDestination(city);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {city}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-600">{t('search.noResults')}</div>
              )}
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
                className="fixed inset-0 bg-black bg-opacity-0 z-50"
                onClick={handleCloseDatePicker}
              ></div>

              <div className="date-picker-container fixed md:absolute top-0 md:top-14 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto z-50 bg-blue" dir='ltr'>
                <div className="date-picker-header md:hidden flex justify-between items-center p-4 w-full bg-white border-b sticky top-0 ">
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
                  months={window.innerWidth > 768 ? 2 : 1}
                  direction={window.innerWidth > 768 ? "horizontal" : "vertical"}
                  className="date-range-wrapper  max-h-screen md:max-h-none  "
                  rangeColors={['#2563eb']}
                  showMonthAndYearPickers={true}
                  monthDisplayFormat="MMMM yyyy"
                />

                <div className="md:hidden flex justify-end p-4 bg-white border-t sticky bottom-0">
                  <button
                    className="px-4 py-2 bg-blue text-black rounded-md"
                    onClick={handleCloseDatePicker}
                  >
                    {t('common.apply')}
                  </button>
                </div>
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
            <div
              className={`options-container bg-white absolute top-14 ${isRTL ? 'right-0' : 'left-0'} md:left-auto rounded-lg shadow-lg z-50 w-full  `}
            >
              <div className="p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Adults */}
                <div className="option-item flex items-center justify-between">
                  <div className="option-text">
                    <h3 className="text-gray-700 font-medium">{t('search.adults')}</h3>
                    <p className="text-gray-500 text-sm">{t('search.ageText.adults')}</p>
                  </div>
                  <div className="option-counter flex items-center gap-3">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleClick('Adult', 'decrease', 1)}
                      disabled={options.Adult <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="font-semibold text-lg">{options.Adult}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition"
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
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleClick('Children', 'decrease', 0)}
                      disabled={options.Children <= 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="font-semibold text-lg">{options.Children}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition"
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
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleClick('room', 'decrease', 1)}
                      disabled={options.room <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="font-semibold text-lg">{options.room}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 transition"
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