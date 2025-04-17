import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaList, FaChevronDown } from 'react-icons/fa';
import { LuNotebookPen } from 'react-icons/lu';

const TopNavHost = ({category}) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    

    const menuItems = [
        { name: 'Reservations', path: `/host/${category}/reservations` },
        { name: 'Earnings', path: `/host/${category}/earnings` },
        { name: 'Reviews', path: `/host/${category}/reviews` },
        { name: 'Settings', path: `/host/${category}/settings` }
    ];

    return (
        <div className="bg-white shadow-sm fixed top-16 md:top-0 right-0 left-0 z-20 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Today's Date */}
                    <div className="flex items-center space-x-8">
                         

                        {/* Calendar and Listing Links */}
                        <div className="flex space-x-4">
                            <Link
                                to={`/host/${category}/calendar`}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hidden
                                    ${location.pathname === `/host/${category}/calendar` 
                                    ? 'bg-blue text-white' 
                                    : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <FaCalendarAlt className="w-4 h-4" />
                                <span>Calendar</span>
                            </Link>
                            <Link
                                to={`/host/properties`}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                                    ${location.pathname.includes("properties") && !location.pathname.includes("bookings") 
                                      ? 'bg-blue text-white' 
                                      : 'text-gray-600 hover:bg-gray-100'}`}
                                  
                            >
                                <FaList className="w-4 h-4" />
                                <span>Listings</span>
                            </Link>
                            <Link
                                to={`/host/properties/bookings`}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                                    ${location.pathname.includes("bookings") 
                                      ? 'bg-blue text-white' 
                                      : 'text-gray-600 hover:bg-gray-100'}`}
                                  
                            >
                                <LuNotebookPen className="w-4 h-4" />
                                <span>Bookings</span>
                            </Link>
                        </div>
                    </div>

                    {/* Custom Dropdown Menu */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            <span>Menu</span>
                            <FaChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isMenuOpen && (
                            <>
                                {/* Invisible overlay to handle clicking outside */}
                                <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                
                                {/* Dropdown menu */}
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-1">
                                        {menuItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNavHost; 