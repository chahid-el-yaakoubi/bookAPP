import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faCalendarDay, faCar, faPerson, faPlane, faTaxi, faSearch, faKey, faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { SearchContext } from '../contextApi/SearchContext';
import { SearchForm } from './SearchForm';
import { useTranslation } from 'react-i18next';
import { TransContext } from '../contextApi/TransContext';
import { changeLanguage } from '../i18n';  // Adjust the path based on your i18n.js location

export const Header = ({ type }) => {

  const { t } = useTranslation();
  const { state } = useContext(TransContext);

  useEffect(() => {
    changeLanguage(state.language);
  }, [state.language]);

  const initializeDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const today = initializeDates();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const [dateRange, setDateRange] = useState(() => {
    const savedDateRange = JSON.parse(localStorage.getItem('dateRange'));
    const defaultRange = [{
      startDate: today,
      endDate: today,
      key: 'selection'
    }];

    if (!savedDateRange || savedDateRange.length === 0) {
      return defaultRange;
    }

    const savedStartDate = new Date(savedDateRange[0].startDate);
    const savedEndDate = new Date(savedDateRange[0].endDate);

    if (savedStartDate < today) {
      return defaultRange;
    }

    return [{
      startDate: savedStartDate,
      endDate: savedEndDate,
      key: 'selection'
    }];
  });

  const [destination, setDestination] = useState(() => localStorage.getItem('destination') || '');
  const [options, setOptions] = useState(() => JSON.parse(localStorage.getItem('options')) || { adult: 2, children: 0, room: 1 });

  const [opendate, setOpendate] = useState(false);
  const [openoptions, setOpenOptions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('dateRange', JSON.stringify(dateRange));
    localStorage.setItem('destination', destination);
    localStorage.setItem('options', JSON.stringify(options));
  }, [dateRange, destination, options]);

  const handleDateChange = (ranges) => { setDateRange([ranges.selection]); };

  const handleClick = (field, operation, min) => {
    setOptions((prevState) => {
      const newValue = operation === 'increase' ? prevState[field] + 1 : Math.max(min, prevState[field] - 1);
      return { ...prevState, [field]: newValue };
    });
  };

  const handleInputChange = (e, field) => {
    try {
      const value = parseInt(e.target.value, 10) || 0;
      setOptions(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error updating options:', error);
    }
  };

  const { dispatch } = useContext(SearchContext);

  const handleSearch = () => {
    if (!destination?.trim()) {
      setShowAlert(true);
      return;
    }

    dispatch({
      type: 'NEW_SEARCH',
      payload: {
        city: destination.trim(),
        dates: dateRange,
        options,
      },
    });

    navigate(`/hotels/${encodeURIComponent(destination)}`, {
      state: { dateRange, destination, options }
    });
  };

  const handleDateClick = () => {
    setOpendate(!opendate);
    setShowOverlay(!showOverlay);
    if (openoptions) {
      setOpenOptions(false);
    }
  };

  const handleCloseDatePicker = () => {
    setOpendate(false);
    setShowOverlay(false);
  };

  // Define class for active menu item based on type
  const getMenuItemClass = (menuType) => {
    const baseClass = "relative flex flex-col md:flex-row md:gap-3 items-center gap-1 py-1 px-1 md:p-3 cursor-pointer transition-all duration-300 rounded-xl";

    if (type === menuType) {
      return `${baseClass} text-white bg-primary-dark group active:scale-95`;
    }
    return `${baseClass} text-white/80 bg-gray-600  hover:text-orange-500 group`;
  };

  return (
    <div className="fixed md:relative top-0 flex justify-center z-40 md:z-30 bg-primary md:pb-14 w-full">
      <div className="container-fluid px-4 lg:px-16 xl:px-40 flex flex-col justify-center items-center w-full md:ps-20">
        <div className="w-full p-2 text-center rounded-b-lg overflow-x-auto">
          <div className="flex items-center justify-start gap-2 md:gap-10 mx-auto min-w-max">
            <Link to={'/'} className="min-w-[70px] md:min-w-[80px]">
              <div className={getMenuItemClass("house_rental")}>
                <div className="text-lg md:text-2xl h-6 md:h-7 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBed} className='text-sm md:text-lg' />
                </div>
                <span className="text-[10px] md:text-sm font-medium">{t('header.menu.home')}</span>
                {type === "house_rental" && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full transition-opacity duration-300"></div>
                )}
              </div>
            </Link>

            <div className="min-w-[70px] md:min-w-[100px]">
              <div className={getMenuItemClass("explore")}>
                <div className="text-lg md:text-2xl h-6 md:h-7 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-150">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <span className="text-[10px] md:text-sm font-medium text-center whitespace-nowrap">{t('header.menu.explore')}</span>
                {type === "explore" && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full transition-opacity duration-300"></div>
                )}
              </div>
            </div>

            <Link to={'/cars'} className="min-w-[70px] md:min-w-[80px]">

              <div className="min-w-[70px] md:min-w-[100px]">
                <div className={getMenuItemClass("location")}>
                  <div className="text-lg md:text-2xl h-6 md:h-7 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-150">
                    <FontAwesomeIcon icon={faCar} />
                  </div>
                  <span className="text-[10px] md:text-sm font-medium text-center whitespace-nowrap">{t('header.menu.location')}</span>
                  {type === "location" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full transition-opacity duration-300"></div>
                  )}
                </div>
              </div>
            </Link>


            <div className="min-w-[70px] md:min-w-[100px]">
              <div className={getMenuItemClass("taxi")}>
                <div className="text-lg md:text-2xl h-6 md:h-7 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-150">
                  <FontAwesomeIcon icon={faTaxi} />
                </div>
                <span className="text-[10px] md:text-sm font-medium text-center whitespace-nowrap">Plombers</span>
                 {/* {t('header.menu.taxi')} */}
                {type === "taxi" && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full transition-opacity duration-300"></div>
                )}
              </div>
            </div>

           
          </div>
        </div>

        {/* search bar desktop */}
        {(type === "house_rental" || type === "location") && (
          <div className="hidden md:block">
            <SearchForm />
          </div>
        )}
      </div>
    </div>
  );
};