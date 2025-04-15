import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHotels, setSelectedFilter } from "../../../redux/hotelsSlice";
import { FilterModule } from "../../../components/FilterModule";
import { Logo } from "../../../components/Navbar";
import SearchMobile from '../../../components/searchMobile';
import { getProperties } from "../../../Lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faHotel,
  faHouse,
  faHouseFlag,
  faSwimmingPool,
  faSliders,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";

// Define property types as a constant outside the component
const PROPERTY_TYPES = [
  { type: "house", icon: faHouse, label: "House" },
  { type: "guesthouse", icon: faHouse, label: "Guesthouse" },
  { type: "apartment", icon: faHouseFlag, label: "Appartement" },
  { type: "hotel", icon: faHotel, label: "Hôtel" },
  { type: "villa", icon: faSwimmingPool, label: "Villa" },
];

const HotelsList = ({city}) => {
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels.filteredHotels);
  const selectedFilter = useSelector((state) => state.hotels.selectedFilter);
  
  const [showModel, setShowModel] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showButton, setShowButton] = useState(false);

  // Fetch hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getProperties(city);
        dispatch(setHotels(response.data));
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, [dispatch]);

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
    dispatch(setSelectedFilter(type === "all" ? null : type));
  }, [dispatch]);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Memoize whether each property type has matching hotels
  const typesWithHotels = useMemo(() => {
    const types = {};
    PROPERTY_TYPES.forEach(({ type }) => {
      types[type] = hotels.some(hotel => hotel.type.type === type);
    });
    return types;
  }, [hotels]);

  // Toggle filter modal
  const toggleFilterModal = useCallback(() => {
    setShowModel(prev => !prev);
  }, []);

  return (
    <div className="container">
      {/* Navigation Bar */}
      <div
        className={`
         py-1 shadow-md transition-all duration-300 mx-auto z-20
          fixed top-[61px] left-0 right-0 bg-primary w-[96%] rounded-b-xl
          md:w-full
          ${isAtTop 
            ? "md:relative md:top-0 md:mt-0 md:bg-primary md:rounded shadow-xl"
            : "md:fixed md:top-0 md:bg-primary md:rounded-none"}
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Logo */}
            <div className="flex items-center md:hidden">
              <Logo />
            </div>

            {/* Mobile Search */}
            <SearchMobile />

            {/* Desktop Navigation */}
            <div className="hidden md:block flex-1">
              <div className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-hide">
                {/* Show All Button */}
                <button
                  onClick={() => handleChooseType("all")}
                  className={`
                    min-w-[120px] px-4 py-2 rounded-lg border transition-all duration-200 
                    flex items-center gap-2
                    ${selectedFilter === null
                      ? "bg-orange-500 text-white border-primary-dark"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}
                  `}
                >
                  <FontAwesomeIcon icon={faArrowDownWideShort} className="text-lg" />
                  <span className="text-sm">Tout afficher</span>
                </button>

                {/* Property Type Buttons */}
                {PROPERTY_TYPES.map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => handleChooseType(type)}
                    className={`
                      min-w-[90px] px-3 py-2 rounded-lg transition-all duration-200 
                      flex  items-center gap-1 shadow-sm
                      ${selectedFilter === type
                        ? "bg-orange-500 text-white  hover:bg-orange-400 border-b-2 border-primary-dark"
                        : typesWithHotels[type]
                          ? "bg-transparant text-gray-100 hover:bg-blue border border-gray-200"
                          : "bg-transparant text-gray-100 hover:bg-blue border border-gray-200 opacity-75"
                      }
                    `}
                    // disabled={typesWithHotels[type]}
                  >
                    <FontAwesomeIcon icon={icon} className="text-lg" />
                    <span className="text-sm whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Back to Top Button */}
            {showButton && (
              <button
                onClick={scrollToTop}
                className="hidden md:flex w-10 h-10 bg-primary-dark text-white rounded-full shadow-lg hover:bg-primary transition-all duration-200 items-center justify-center"
                aria-label="Back to top"
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            )}

            {/* Filters Button */}
            <button
              onClick={toggleFilterModal}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 text-gray-700 shadow-sm"
            >
              <FontAwesomeIcon icon={faSliders} />
              <span className="text-sm font-medium">Filtres</span>
            </button>
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
          aria-label="Back to top"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </div>
  );
};

export default HotelsList;