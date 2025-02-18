import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHotels, setSelectedFilter } from "../redux/hotelsSlice";
import { FilterModule } from "./FilterModule";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faHotel,
  faHouse,
  faHouseFlag,
  faStar,
  faSwimmingPool,
  faWifi,
  faCar,
  faUtensils,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { Logo } from "./Navbar";
import SearchMobile from './searchMobile';


const HotelsList = () => {
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels.filteredHotels); // Use filteredHotels from Redux
  console.log("hotels:", hotels);
  const [showModel, setShowModel] = useState(false);

  // Fetch hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("api/hotels");
        if (!response.ok) throw new Error("Failed to fetch hotels");
        const data = await response.json();
        dispatch(setHotels(data)); // Store hotels in Redux state
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, [dispatch]);

  // Handle type selection
  const handleChooseType = (type) => {
    if (type === "all") {
      dispatch(setSelectedFilter(null)); // Reset filter
    } else {
      dispatch(setSelectedFilter(type)); // Apply filter
    }
  };

  // Handle sorting
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // btn go to top
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200); // Show button when scrolled down 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full ">
      <div
        className={` top-20 md:top-0 left-0 bg-white shadow-sm  transition-all duration-300 ${isAtTop ? "w-[90%] mx-auto rounded-xl z-30 sticky" : "w-full z-50 fixed"
          }`}
      >
        <div className="container mx-auto px-4  ">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Logo and Back to Top */}
            <div className="flex items-center md:hidden">
              {showButton ? (
                <Logo />
              ) : (
                <button
                  onClick={scrollToTop}
                  className="w-10 h-10 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition flex items-center justify-center"
                >
                  <span className="text-sm">Back</span>
                </button>
              )}
            </div>

            {/* Mobile Search */}
            {showButton && <SearchMobile />}

            {/* Desktop Navigation */}
            <div className="hidden md:block flex-1">
              <div className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-hide">
                <button
                  onClick={() => handleChooseType("all")}
                  className="min-w-[120px] px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 text-gray-700"
                >
                  <FontAwesomeIcon icon={faArrowDownWideShort} className="text-lg" />
                  <span className="text-sm">Tout afficher</span>
                </button>

                {[
                  { type: "house", icon: faHouse, label: "Maison" },
                  { type: "penthouse", icon: faHouse, label: "Penthouse" },
                  { type: "studio", icon: faHouse, label: "Studio" },
                  { type: "duplex", icon: faHouse, label: "Duplex" },
                  { type: "apartment", icon: faHouseFlag, label: "Appartement" },
                  { type: "hotel", icon: faHotel, label: "Hôtel" },
                  { type: "villa", icon: faSwimmingPool, label: "Villa" },
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => handleChooseType(type)} style={{lineHeight: "10px"}}
                    className={` text-[8px] px-1 py-1 rounded-lg transition-all duration-200 flex flex-col items-center gap-2
                    ${hotels.some((hotel) => hotel.type === type)
                        ? "bg-primary text-white hover:bg-primary/90 border-b-2 border-primary-dark"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <FontAwesomeIcon icon={icon} className="text-[10px]" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Back to Top */}
            {showButton && (
              <button
                onClick={scrollToTop}
                className="hidden md:flex w-12 h-12 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition items-center justify-center"
              >
                <span>⬆️</span>
              </button>
            )}

            {/* Filters Button */}
            <button
              onClick={() => setShowModel(true)}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 text-gray-700"
            >
              <FontAwesomeIcon icon={faSliders} className="text-lg" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Filter module */}

      </div>
      {showModel && <FilterModule onClose={() => setShowModel(false)} />}

    </div>


  );
};

export default HotelsList;