import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { setHotels, applyFilters } from "../../../redux/hotelsSlice";
import { togglePropertyType } from "../../../redux/filtersSlice";
import { FilterModule } from "../../../components/FilterModule";
import { Logo } from "../../../components/Navbar";
import SearchMobile from '../../../components/searchMobile';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faHotel,
  faHouse,
  faHouseFlag,
  faSwimmingPool,
  faSliders,
  faArrowUp,
  faSpinner,
  faExclamationTriangle,
  faRedoAlt
} from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../../hooks/useFetch";

// Define property types as a constant outside the component
const PROPERTY_TYPES = [
  { type: "house", icon: faHouse, labelKey: "house" },
  { type: "guesthouse", icon: faHouse, labelKey: "guesthouse" },
  { type: "apartment", icon: faHouseFlag, labelKey: "apartment" },
  { type: "hotel", icon: faHotel, labelKey: "hotel" },
  { type: "villa", icon: faSwimmingPool, labelKey: "villa" },
];


const HotelsList = ({ city, }) => {

  const itemapplied = localStorage.getItem('applied-filters-count');

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels.filteredHotels);
  const filters = useSelector((state) => state.filters);
  const propertyTypes = useSelector((state) => state.filters.propertyTypes);

  const [showModel, setShowModel] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const req = city.length > 0 ? `?city=${city}` : '';
  const { data, loading, error, reFetch } = useFetch(`/api/hotels${req}`);

  const [errorL, setErrorL] = useState(null);



  useEffect(() => {
    if (data) {
      dispatch(setHotels(data));
      dispatch(applyFilters(filters));
    }
    if (error) {
      setErrorL(error)
    } else {
    }
    if (data) {
      setErrorL(null)
    }
  }, [data, dispatch, filters, error]);

  // Set default selection to "all" property types on mount
  useEffect(() => {
    PROPERTY_TYPES.forEach(({ type }) => {
      dispatch(togglePropertyType(type));
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(applyFilters(filters));
  }, [dispatch, filters]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerWidth < 768 ? 20 : 200;
      setIsAtTop(window.scrollY <= scrollThreshold);
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle type selection with useCallback
  const handleChooseType = useCallback((type) => {
    if (type === "all") {
      // Clear all property type filters by setting each to false if it's currently true
      PROPERTY_TYPES.forEach(({ type }) => {
        if (propertyTypes && propertyTypes[type.toLowerCase()]) {
          dispatch(togglePropertyType(type.toLowerCase()));
        }
      });
    } else {
      // Toggle the selected property type without affecting others
      dispatch(togglePropertyType(type.toLowerCase()));
    }
  }, [dispatch, propertyTypes]);

  // Check if any property type is selected
  const hasActivePropertyFilter = useMemo(() => {
    return propertyTypes && Object.values(propertyTypes).some(value => value === true);
  }, [propertyTypes]);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Memoize whether each property type has matching hotels
  const typesWithHotels = useMemo(() => {
    const types = {};
    PROPERTY_TYPES.forEach(({ type }) => {
      types[type] = hotels.some(hotel =>
        hotel.type && hotel.type.type &&
        hotel.type.type.toLowerCase() === type.toLowerCase()
      );
    });
    return types;
  }, [hotels]);

  // Toggle filter modal
  const toggleFilterModal = useCallback(() => {
    setShowModel(prev => !prev);
  }, []);

  // Check if a specific filter is active
  const isFilterActive = useCallback((type) => {
    if (!propertyTypes) return false;
    return !!propertyTypes[type.toLowerCase()];
  }, [propertyTypes]);

  // Function to handle data refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await reFetch();
    } finally {
      // Set a small timeout to ensure UI updates properly
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [reFetch]);

  return (
    <div className="w-full relative mt-10">
      {/* Loading Indicator - Enhanced version */}
      {(loading || isRefreshing) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-blue text-4xl animate-spin mb-3"
              aria-hidden="true"
            />
            <span className="text-lg font-medium text-gray-800">
              {isRefreshing ? t('hotelsList.refreshing') || 'Refreshing data...' : t('hotelsList.loading') || 'Loading...'}
            </span>
          </div>
        </div>
      )}

      {/* Error Handling - Enhanced version */}
      {errorL && !loading && !isRefreshing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-red-500 text-4xl mb-4"
              aria-hidden="true"
            />
            <span className="text-lg font-medium text-gray-800 mb-4 text-center">
              {t('hotelsList.errorLoading') || 'Error loading data. Please try again.'}
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-dark transition-colors"
              disabled={loading || isRefreshing}
            >
              <FontAwesomeIcon icon={faRedoAlt} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{t('hotelsList.refresh') || 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing content with higher z-index */}
      <div className="relative">
        {/* Navigation Bar - Remove decorative elements for cleaner look */}
        <div className={`overflow-hidden flex justify-between ${!isAtTop ? 'hidden' : null}`}>
          {/* Remove decorative divs */}
        </div>

        <div
          className={`
            shadow-md transition-all duration-300 mx-auto z-50 md:z-20
            fixed top-[61px] left-0 right-0 w-[96%] rounded-b-md bg-white 
            md:w-full
            ${isAtTop
              ? "md:relative md:top-0 md:mt-0 shadow-lg"
              : "md:fixed md:top-0 md:bg-white md:rounded-none"}
          `}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile Logo */}
              <div className="flex items-center md:hidden">
                <Logo />
              </div>

              {/* Mobile Search */}
              <SearchMobile />

              {/* Desktop Navigation */}
              <div className="hidden md:block flex-1">
                <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {/* Show All Button */}
                  <button
                    onClick={() => handleChooseType("all")}
                    className={`
                      min-w-[120px] px-4 py-2.5 rounded-full border transition-all duration-200 
                      flex items-center gap-2
                      ${!hasActivePropertyFilter
                        ? "bg-blue text-white border-blue hover:bg-blue-dark"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}
                    `}
                  >
                    <FontAwesomeIcon icon={faArrowDownWideShort} className="text-lg" />
                    <span className="text-sm font-medium">{t('hotelsList.showAll')}</span>
                  </button>

                  {/* Property Type Buttons */}
                  {PROPERTY_TYPES.map(({ type, icon, labelKey }) => (
                    <button
                      key={type}
                      onClick={() => handleChooseType(type)}
                      className={`
                        min-w-[100px] px-4 py-2.5 rounded-full transition-all duration-200 
                        flex items-center gap-2 relative
                        ${isFilterActive(type)
                          ? "bg-blue text-white hover:bg-blue-dark border-2 border-blue"
                          : typesWithHotels[type]
                            ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                            : "bg-gray-100 text-gray-400 cursor-pointer "
                        }
                        ${isFilterActive(type) ? 'ring-2 ring-blue ring-opacity-50' : ''}
                      `}
                      disabled={loading || isRefreshing}
                    >
                      <FontAwesomeIcon icon={icon} className="text-lg" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {t(`hotelsList.propertyTypes.${labelKey}`)}
                      </span>
                      {isFilterActive(type) && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Back to Top Button */}
              {showButton && (
                <button
                  onClick={scrollToTop}
                  className="hidden md:flex w-10 h-10 bg-blue text-white rounded-full shadow-lg hover:bg-blue-dark transition-all duration-200 items-center justify-center"
                  aria-label={t('hotelsList.backToTop')}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
              )}

              {/* Filters Button */}
              <button
                onClick={toggleFilterModal}
                className="flex items-center gap-2 py-2.5 px-4 rounded-full border border-gray-200 hover:shadow-md transition-all duration-200 text-gray-700 text-sm font-medium bg-white hover:bg-gray-50"
                disabled={loading || isRefreshing}
              >
                <FontAwesomeIcon icon={faSliders} />
                <span>{t('hotelsList.filters')}</span>
                {itemapplied - 3}

              </button>

              {/* Refresh Button */}
              {hotels.length <= 0 ? <button
                onClick={handleRefresh}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:shadow-md transition-all duration-200 text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading || isRefreshing}
                aria-label={t('hotelsList.refresh') || 'Refresh Data'}
              >
                <FontAwesomeIcon
                  icon={faRedoAlt}
                  className={`text-lg ${isRefreshing ? 'animate-spin text-blue' : ''}`}
                />
              </button> : ''}

            </div>
          </div>
        </div>

        {/* Filter Module */}
        {showModel && <FilterModule onClose={toggleFilterModal} />}

        {/* Floating Back to Top button for mobile */}
        {showButton && (
          <button
            onClick={scrollToTop}
            className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-primary-dark text-white rounded-full shadow-lg hover:bg-primary transition-all duration-200 flex items-center justify-center z-30"
            aria-label={t('hotelsList.backToTop')}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        )}
      </div>

    </div>
  );
};

export default HotelsList;