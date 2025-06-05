import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMultiply, faGlobe, faSearch, faHeart, 
  faSliders, faUser, faDollarSign, faChevronDown, 
  faHouseUser, faSignOutAlt, faArrowLeft, faHome
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TransContext } from '../contexts/TransContext';

// Logo Component
 
// Mobile Logo Component
export const MobileLogo = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Link to="/" onClick={scrollToTop} className="inline-block">
            <div className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight">
                    <span className="text-blue transition-colors duration-300 hover:text-[blue]">Axi</span>
                    <span className="text-orange-500 transition-colors duration-300 hover:text-orange-600">Stay</span>
                </span>
            </div>
        </Link>
    );
};

// Search Mobile Component
const SearchMobile = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center ">
                <button 
                    onClick={onClose}
                    className="text-white mr-4"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                </button>
                <h2 className="text-xl font-semibold text-white">{t('search.title')}</h2>
            </div>
            
            <div className="p-4 flex-1">
                <form onSubmit={handleSearch} className="w-full">
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search.placeholder')}
                            className="w-full bg-gray-800 text-white border-none rounded-full py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue"
                        />
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                                <FontAwesomeIcon icon={faMultiply} />
                            </button>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        className="mt-4 w-full bg-blue text-white py-3 rounded-full font-medium"
                    >
                        {t('search.button')}
                    </button>
                </form>
                
                <div className="mt-8">
                    <h3 className="text-white text-lg font-medium mb-4">{t('search.recentSearches')}</h3>
                    <div className="space-y-4">
                        {/* This would typically be populated from localStorage or API */}
                        <div className="flex items-center justify-between text-gray-300 p-2 hover:bg-gray-800 rounded-lg">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faSearch} className="mr-3 text-gray-400" />
                                <span>New York, United States</span>
                            </div>
                            <FontAwesomeIcon icon={faMultiply} className="text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between text-gray-300 p-2 hover:bg-gray-800 rounded-lg">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faSearch} className="mr-3 text-gray-400" />
                                <span>Marrakech, Morocco</span>
                            </div>
                            <FontAwesomeIcon icon={faMultiply} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Confirmation Modal Component
const ConfirmLogoutModal = ({ onConfirm, onCancel, t }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full z-10 relative">
                <h3 className="text-xl font-bold text-white mb-4">{t('navbar.logoutConfirmation')}</h3>
                <p className="text-gray-300 mb-6">{t('navbar.logoutMessage')}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        {t('navbar.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        {t('navbar.logout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Mobile Header Component
export const MobileHeader = () => {
    const { t } = useTranslation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
                <MobileLogo />
                
                {isHomePage ? (
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="bg-gray-800 text-white rounded-full px-4 py-2 flex items-center"
                    >
                        <FontAwesomeIcon icon={faSearch} className="mr-2" />
                        {t('search.placeholder')}
                    </button>
                ) : (
                    <Link to="/" className="text-white">
                        <FontAwesomeIcon icon={faHome} className="text-xl" />
                    </Link>
                )}
            </div>
            
            <SearchMobile 
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </header>
    );
};

// Mobile Navigation Component
export const NavbarMobel = () => {
    const { t } = useTranslation(['translation', 'head']);
    const [showMobileNav, setShowMobileNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [activeTab, setActiveTab] = useState('search');
    const [mobileLangDropdown, setMobileLangDropdown] = useState(false);
    const [mobileProfileDropdown, setMobileProfileDropdown] = useState(false);
    const [mobilePriceDropdown, setMobilePriceDropdown] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [currentCurrency, setCurrentCurrency] = useState('USD');
    
    const { state: userState, dispatch } = useContext(AuthContext);
    const user = userState.user;
    const { state, dispatch: transDispatch } = useContext(TransContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Define languages and currencies
    const languages = {
        en: {
            flag: '../imges/lang/flag1.webp',
            label: 'English'
        },
        ar: {
            flag: '../imges/lang/flag2.webp',
            label: 'العربية'
        },
        es: {
            flag: '../imges/lang/flag3.webp',
            label: 'Español'
        },
        fr: {
            flag: '../imges/lang/flag4.webp',
            label: 'Français'
        },
        tf: {
            flag: 'https://play-lh.googleusercontent.com/dBTaZCYCeIEjd2ALu4krH8MRyzoYSxtuXAzPRYUMBLs-JYXCPoVjRsORFBJ21TMmFg',
            label: 'ⴰⵎⴰⵣⵉⵖ'
        }
    };

    const currencies = {
        USD: { symbol: '$', label: 'USD' },
        EUR: { symbol: '€', label: 'EUR' },
        MAD: { symbol: 'د.م', label: 'MAD' },
    };

    // Set appropriate active tab based on current route
    useEffect(() => {
        if (location.pathname === '/saved') setActiveTab('saved');
        else if (location.pathname === '/profile') setActiveTab('profile');
        else if (location.pathname === '/') setActiveTab('search');
        // Add more path checks as needed
    }, [location.pathname]);

    // Update current language when context changes
    useEffect(() => {
        setCurrentLanguage(state.language);
    }, [state.language]);

    // Control body overflow for modal-like dropdowns
    useEffect(() => {
        if (mobileLangDropdown || mobileProfileDropdown || mobilePriceDropdown) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileLangDropdown, mobileProfileDropdown, mobilePriceDropdown]);

    // Handle mobile nav show/hide on scroll - memoized with useCallback
    const controlMobileNav = useCallback(() => {
        // Don't hide the nav when dropdowns are open
        if (mobileLangDropdown || mobileProfileDropdown || mobilePriceDropdown) {
            setShowMobileNav(true);
            return;
        }
        
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                setShowMobileNav(false);
            } else {
                setShowMobileNav(true);
            }
            setLastScrollY(window.scrollY);
        }
    }, [lastScrollY, mobileLangDropdown, mobileProfileDropdown, mobilePriceDropdown]);

    useEffect(() => {
        window.addEventListener('scroll', controlMobileNav);
        return () => window.removeEventListener('scroll', controlMobileNav);
    }, [controlMobileNav]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Language dropdown
            if (mobileLangDropdown && 
                !event.target.closest('.language-dropdown-container') && 
                !event.target.closest('.language-dropdown-trigger')) {
                setMobileLangDropdown(false);
                if (activeTab === 'language') setActiveTab('search');
            }
            
            // Profile dropdown
            if (mobileProfileDropdown && 
                !event.target.closest('.profile-dropdown-trigger') && 
                !event.target.closest('.mobile-profile-dropdown')) {
                setMobileProfileDropdown(false);
                if (activeTab === 'profile') setActiveTab('search');
            }
            
            // Price dropdown
            if (mobilePriceDropdown && 
                !event.target.closest('.mobile-price-dropdown') && 
                !event.target.closest('[data-dropdown="price"]')) {
                setMobilePriceDropdown(false);
                if (activeTab === 'price') setActiveTab('search');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeTab, mobileLangDropdown, mobileProfileDropdown, mobilePriceDropdown]);

    // Handle language change
    const changeLanguage = (lng) => {
        transDispatch({ type: "CHANGE_LANGUAGE", payload: lng });
        setCurrentLanguage(lng);
        // setMobileLangDropdown(false);
        // setActiveTab('search');
    };

    // Handle currency change
    const handleCurrencyChange = (currency) => {
        setCurrentCurrency(currency);
        setMobilePriceDropdown(false);
        setActiveTab('search');
    };

    // Handle logout
    const handleLogout = () => {
        // Dispatch the LOGOUT action to reset state
        dispatch({ type: "LOGOUT" });
      
        // Clear user data from localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      
        // Hide any modals or forms
        setShowConfirmModal(false);
        setLoginForm(false);
      
        // Navigate to the home page or another route
        navigate("/");
      };

    // Toggle dropdown helpers
    const toggleLanguageDropdown = () => {
        setActiveTab(mobileLangDropdown ? 'search' : 'language');
        setMobileLangDropdown(!mobileLangDropdown);
        setMobilePriceDropdown(false);
        setMobileProfileDropdown(false);
    };

    const togglePriceDropdown = () => {
        setActiveTab(mobilePriceDropdown ? 'search' : 'price');
        setMobilePriceDropdown(!mobilePriceDropdown);
        setMobileLangDropdown(false);
        setMobileProfileDropdown(false);
    };

    const toggleProfileDropdown = () => {
        setActiveTab(mobileProfileDropdown ? 'search' : 'profile');
        setMobileProfileDropdown(!mobileProfileDropdown);
        setMobileLangDropdown(false);
        setMobilePriceDropdown(false);
    };

    return (
        <>
            {/* Mobile Navigation Bar */}
            <div 
                className={`fixed md:hidden bottom-0 left-0 right-0 w-full bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 transition-transform duration-300 z-50 
                    ${showMobileNav ? 'translate-y-0' : 'translate-y-full'} shadow-lg`}
            >
                <div className="flex items-center gap-2 justify-around py-3 px-4 safe-area-bottom ">
                    {/* Search Tab */}
                    <Link
                        to="/"
                        className={`flex gap-2 items-center justify-center h-12 w-full rounded-full ${
                            activeTab === 'search' ? 'text-white bg-blue' : 'text-gray-100 border border-blue'
                        } hover:bg-blue-100 transition-all`}
                        onClick={() => {
                            setActiveTab('search');
                            setMobileLangDropdown(false);
                            setMobilePriceDropdown(false);
                            setMobileProfileDropdown(false);
                        }}
                    >
                        <FontAwesomeIcon icon={faSearch} className="text-xl" />
                        {activeTab === 'search' && (
                            <span className="text-xs font-medium mt-1">{t('navbar.search')}</span>
                        )}
                    </Link>

                    {/* Language Tab */}
                    <div
                        className={`flex gap-2 items-center justify-center h-12 w-full rounded-full  ${
                            activeTab === 'language' ? 'text-white bg-blue' : 'text-gray-100 border border-blue'
                        } hover:bg-blue-100 transition-all`}
                        onClick={toggleLanguageDropdown}
                    >
                        <FontAwesomeIcon icon={faGlobe} className="text-xl" />
                        {activeTab === 'language' && (
                            <span className="text-xs font-medium mt-1">{t('navbar.language')}</span>
                        )}
                    </div>

                    {/* Currency Tab */}
                    {/* <div
                        data-dropdown="price"
                        className={`flex flex-col items-center justify-center h-12 w-16 rounded-full ${
                            activeTab === 'price' ? 'text-white bg-blue' : 'text-gray-100'
                        } hover:bg-blue-100 transition-all`}
                        onClick={togglePriceDropdown}
                    >
                        <FontAwesomeIcon icon={faDollarSign} className="text-xl" />
                        {activeTab === 'price' && (
                            <span className="text-xs font-medium mt-1">{t('navbar.currency')}</span>
                        )}
                    </div> */}

                    {/* User-specific tabs */}
                    {user ? (
                        <>
                            {/* Saved Tab */}
                            <Link
                                to="/saved"
                                className={`flex gap-2 items-center justify-center h-12 w-full  rounded-full  ${
                                    activeTab === 'saved' ? 'text-white bg-blue' : 'text-gray-100 border border-blue'
                                } hover:bg-blue-100 transition-all`}
                                onClick={() => {
                                    setActiveTab('saved');
                                    setMobileLangDropdown(false);
                                    setMobilePriceDropdown(false);
                                    setMobileProfileDropdown(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faHeart} className="text-xl" />
                                {activeTab === 'saved' && (
                                    <span className="text-xs font-medium mt-1">{t('navbar.saved')}</span>
                                )}
                            </Link>

                            {/* Profile Tab */}
                            <div
                                className={`flex gap-2 items-center justify-center h-12 w-full  rounded-full profile-dropdown-trigger ${
                                    activeTab === 'profile' ? 'text-white bg-blue' : 'text-gray-100 border border-blue'
                                } hover:bg-blue-100 transition-all`}
                                onClick={toggleProfileDropdown}
                            >
                                <FontAwesomeIcon icon={faUser} className="text-xl" />
                                {activeTab === 'profile' && (
                                    <span className="text-xs font-medium mt-1">{t('navbar.profile')}</span>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/Login"
                            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
                        >
                            {t('navbar.login')}
                        </Link>
                    )}
                </div>
            </div>

            {/* Language Dropdown Modal */}
            {mobileLangDropdown && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div className="fixed bottom-0 left-0 right-0 mx-auto bg-gradient-to-b from-[#1a1a1a] to-primary border border-[#333333] rounded-t-xl animate-slide-up safe-area-bottom language-dropdown-trigger z-50 h-[80vh] ">
                        <div className="flex justify-between items-center p-4 border-b border-[#333333]">
                            <h2 className="text-xl font-semibold text-white">{t('navbar.selectLanguage')}</h2>
                            <button 
                                onClick={() => {
                                    setMobileLangDropdown(false);
                                    setActiveTab('search');
                                }}
                                className="text-white p-2"
                            >
                                <FontAwesomeIcon icon={faMultiply} />
                            </button>
                        </div>
                        <div className="py-2 w-full max-h-[60vh] overflow-y-auto">
                            {Object.entries(languages).map(([code, { flag, label }]) => (
                                <button
                                    key={code}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors duration-200 ${
                                        currentLanguage === code ? 'bg-[#333333]' : ''
                                    }`}
                                    onClick={() => changeLanguage(code)}
                                >
                                    <img
                                        src={flag}
                                        alt={`${code} flag`}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Currency Dropdown Modal */}
            {mobilePriceDropdown && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div className="fixed bottom-0 left-0 right-0 mx-auto bg-gradient-to-b from-[#1a1a1a] to-primary border border-[#333333] rounded-t-xl animate-slide-up safe-area-bottom z-50 mobile-price-dropdown">
                        <div className="flex justify-between items-center p-4 border-b border-[#333333]">
                            <h2 className="text-xl font-semibold text-white">{t('navbar.selectCurrency')}</h2>
                            <button 
                                onClick={() => {
                                    setMobilePriceDropdown(false);
                                    setActiveTab('search');
                                }}
                                className="text-white p-2"
                            >
                                <FontAwesomeIcon icon={faMultiply} />
                            </button>
                        </div>
                        <div className="py-2 w-full max-h-[60vh] overflow-y-auto">
                            {Object.entries(currencies).map(([code, { symbol, label }]) => (
                                <button
                                    key={code}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors duration-200 ${
                                        currentCurrency === code ? 'bg-[#333333]' : ''
                                    }`}
                                    onClick={() => handleCurrencyChange(code)}
                                >
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 via-orange-100 to-blue flex items-center justify-center">
                                        <span className="text-lg font-bold text-black">{symbol}</span>
                                    </div>
                                    <span className="font-medium">{label} ({t(`currency.${code}`)})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Dropdown Modal */}
            {mobileProfileDropdown && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div className="fixed bottom-0 left-0 right-0 mx-auto bg-gradient-to-b from-[#1a1a1a] to-primary border border-[#333333] rounded-t-xl animate-slide-up safe-area-bottom z-50 mobile-profile-dropdown h-[80vh] ">
                        <div className="flex justify-between items-center p-4 border-b border-[#333333]">
                            <h2 className="text-xl font-semibold text-white">{t('navbar.accountOptions')}</h2>
                            <button 
                                onClick={() => {
                                    setMobileProfileDropdown(false);
                                    setActiveTab('search');
                                }}
                                className="text-white p-2"
                            >
                                <FontAwesomeIcon icon={faMultiply} />
                            </button>
                        </div>
                        <div className="py-2 w-full">
                            <button
                                className="flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors duration-200"
                                onClick={() => {
                                    navigate("/profile");
                                    setMobileProfileDropdown(false);
                                    setActiveTab('profile');
                                }}
                            >
                                <FontAwesomeIcon icon={faUser} className="text-xl" />
                                <span className="font-medium">{t('navbar.profile')}</span>
                            </button>
                            
                            <button
                                className="flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors duration-200"
                                onClick={() => {
                                    navigate("/hosting");
                                    setMobileProfileDropdown(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faHouseUser} className="text-xl" />
                                <span className="font-medium">{t('navbar.partner')}</span>
                            </button>
                            
                            <button
                                className="flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors duration-200"
                                onClick={() => {
                                    setShowConfirmModal(!showConfirmModal);
                                    // setMobileProfileDropdown(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                                <span className="font-medium">{t('navbar.logout')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showConfirmModal && (
                <ConfirmLogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => {
                    setShowConfirmModal(false);
                    } }
                    t={t}
                />
            )}
        </>
    );
};
