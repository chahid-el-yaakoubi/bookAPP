import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMultiply, faSearch } from "@fortawesome/free-solid-svg-icons";
import { SearchForm } from "./SearchForm";

const SearchMobile = () => {
  const [searchMobile, setSearchMobile] = useState(false);
  
  // Handle body scroll lock when search is open
  useEffect(() => {
    if (searchMobile) {
      // Prevent background scrolling when search is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [searchMobile]);

  // Close search on escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && searchMobile) {
        setSearchMobile(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [searchMobile]);

  return (
    <div className="">
      {/* Mobile Navigation */}
      <div className="md:hidden gap-2 flex items-center">
        <div 
          className="flex items-center p-2 rounded-3xl bg-white shadow-lg transition-all hover:shadow-xl active:shadow-md cursor-pointer"
          onClick={() => setSearchMobile(!searchMobile)}
          aria-label="Open search"
        >
          {/* Use FontAwesome icon for better scaling and consistency */}
          <FontAwesomeIcon icon={faSearch} className="text-gray-600 w-6 h-6" />
          <p className="ps-4 pe-2 text-gray-700">Search</p>
        </div>
      </div>

      {/* Search Overlay */}
      {searchMobile && (
        <div className="fixed inset-0 flex items-start justify-center bg-blue-500 bg-opacity-20 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="w-full h-[85vh] rounded-b-2xl overflow-hidden shadow-2xl bg-white animate-slideDown">
            {/* Header */}
            <div className="bg-gray-50 py-4 px-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="font-medium text-lg text-gray-800">Search</h2>
              <button
                onClick={() => setSearchMobile(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                aria-label="Close search"
              >
                <FontAwesomeIcon icon={faMultiply} className="text-lg" />
              </button>
            </div>
            
            {/* Search Form Container */}
            <div className=" h-full pb-24 pe-8">
              <SearchForm />
              
             
            </div>
            
            {/* Fixed close button at bottom */}
            <button
              onClick={() => setSearchMobile(false)}
              className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Close search"
            >
              <FontAwesomeIcon icon={faMultiply} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMobile;