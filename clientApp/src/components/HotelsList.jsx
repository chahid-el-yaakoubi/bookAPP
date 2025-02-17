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
    <div
      className={`sticky top-20 md:top-0 left-0 bg-primary  z-40 transition-all duration-300 ${isAtTop ? " w-[80%] mx-auto" : "w-full"
        }`}
    >
      <div className="rounded-lg shadow-sm p-2 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full md:w-auto ">

          {!showButton && (
            <button
              onClick={scrollToTop}
              className=" w-10 h-10 bg-blue text-white p-3 rounded-full shadow-lg hover:bg-blue transition me-20 md:hidden"
            >
              Welecome
            </button>
          )}
          {/* Add a "to top" button */}

          {showButton && (

            <div className="md:hidden ">
              <Logo />

            </div>
           
          )}

          {showButton && (
            <SearchMobile />
          )}

          {showButton && (
            <button
              onClick={scrollToTop}
              className=" w-14 h-14  text-white p-3 rounded-xl shadow-lg bg-blue hover:bg-blue transition me-20 hidden  md:block "
            >
               Top ⬆️ 
            </button>
          )}



          <div className="hidden md:block w-full">
            <div className="flex  flex-row gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 max-w-[calc(100%-100px)]    ">


              {/* Add a "Show All" button */}
              <button
                onClick={() => handleChooseType("all")}
                className="transition-all duration-200 ease-in-out border px-2 sm:px-4 py-1.5 rounded-lg border-gray-200 cursor-pointer flex items-center gap-1.5 text-[6px] sm:text-base flex-shrink-0 justify-center w-[90px] sm:w-[110px] bg-white text-gray-900 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faArrowDownWideShort} className="text-base sm:text-lg" />
                <span className="whitespace-nowrap">Tout afficher</span>
              </button>

              {/* Type buttons */}
              {[
                { type: "house", icon: faHouse, label: "Maison" },
                { type: "penthouse", icon: faHouse, label: "Penthouse" },
                { type: "studio", icon: faHouse, label: "Studio" },
                { type: "duplex", icon: faHouse, label: "Deplux" },
                { type: "apartment", icon: faHouseFlag, label: "Appartement" },
                { type: "hotel", icon: faHotel, label: "Hôtel" },
                { type: "villa", icon: faSwimmingPool, label: "Villa" },
              ].map(({ type, icon, label }) => (
                <button
                  key={type}
                  onClick={() => handleChooseType(type)}
                  className={`transition-all duration-200 ease-in-out bg-primary text-white  hover:bg-primary/90 px-2 sm:px-4 py-1.5 rounded-lg cursor-pointer flex  flex-col items-center gap-1.5 text-[6px] sm:text-base flex-shrink-0 justify-center w-auto ${hotels.some((hotel) => hotel.type === type)
                    ? "bg-primary-dark hover:bg-primary-dark  border-b-4"
                    : ""
                    }`}
                >
                  <FontAwesomeIcon icon={icon} className="text-base sm:text-sm" />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters button */}
          <button
            onClick={() => setShowModel(true)}
            className="transition-all duration-200 ease-in-out border px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-2 justify-center flex-shrink-0 border-gray-200 text-gray-700 text-sm sm:text-base bg-white min-w-[90px]"
          >
            <FontAwesomeIcon icon={faSliders} className="text-lg" />
            <span>Filtres</span>
          </button>
        </div>
      </div>


      {/* Filter module */}
      {showModel && <FilterModule onClose={() => setShowModel(false)} />}
    </div>
  );
};

export default HotelsList;