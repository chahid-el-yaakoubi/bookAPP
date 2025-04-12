import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contextApi/AuthContext';
import Login from './Login/login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMultiply, faGlobe, faSearch, faHeart, faSliders, faUser, faDollarSign, faChevronDown, faHouseUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TransContext } from '../contextApi/TransContext';
import SearchMobile from './searchMobile';
import { NavbarMobel } from './NavbarMobile';


export const Logo = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Link to="/" onClick={scrollToTop}>
            <div className="flex items-center">
                <span className="text-3xl font-extrabold tracking-tight">
                    <span className="text-blue text-3xl transition-colors duration-300 hover:text-[blue]">Axi</span>
                    <span className="text-orange-500 text-3xl transition-colors duration-300 hover:text-orange-600">Stay</span>
                    {/* <span className="text-sm text-white font-light opacity-80">.com</span> */}
                </span>
            </div>
        </Link>
    );
};


// Alternative version with background


export const Navbar = () => {
    const { t } = useTranslation(['translation', 'head']);
    const [loginForm, setLoginForm] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMobileNav, setShowMobileNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [languageDropdown, setLanguageDropdown] = useState(false);
    const [mobileLangDropdown, setMobileLangDropdown] = useState(false);
    const [mobileProfileDropdown, setMobileProfileDropdown] = useState(false); // New state for mobile profile dropdown
    const [priceDropdown, setPriceDropdown] = useState(false);
    const [mobilePriceDropdown, setMobilePriceDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState('search'); // Default active tab
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [currentCurrency, setCurrentCurrency] = useState('USD');
    const { state, dispatch: transDispatch } = useContext(TransContext);

    const currencies = {
        USD: { symbol: '$', label: 'USD' },
        EUR: { symbol: '€', label: 'EUR' },
        MAD: { symbol: 'د.م', label: 'MAD' },
    };

    useEffect(() => {
        if (mobileLangDropdown || mobileProfileDropdown) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileLangDropdown, mobileProfileDropdown]);


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

    // Update currentLanguage when context language changes
    useEffect(() => {
        setCurrentLanguage(state.language);
    }, [state.language]);

    const handleCurrencyChange = (currency) => {
        setCurrentCurrency(currency);
        setPriceDropdown(false);
        setMobilePriceDropdown(false);
        // Reset activeTab to search when currency is changed
        setActiveTab('search');
        // Here you would typically dispatch an action or call a function
        // to update prices throughout your application
    };

    // Handle clicking outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.dropdown-container')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    // Handle mobile nav show/hide on scroll
    useEffect(() => {
        const controlMobileNav = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setShowMobileNav(false);
                } else {
                    setShowMobileNav(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlMobileNav);
        return () => window.removeEventListener('scroll', controlMobileNav);
    }, [lastScrollY]);

    // Handle clicking outside the language dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-dropdown-container')) {
                setLanguageDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Add new useEffect for profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown-trigger') && !event.target.closest('.mobile-profile-dropdown')) {
                setMobileProfileDropdown(false);
                if (activeTab === 'profile') {
                    setActiveTab('search');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeTab]);

    // Add new useEffect for price dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.price-dropdown-container')) {
                setPriceDropdown(false);
            }
            if (!event.target.closest('.mobile-price-dropdown') && !event.target.closest(`.price-tab-trigger`)) {
                setMobilePriceDropdown(false);
                if (activeTab === 'price') {
                    setActiveTab('search');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeTab]);

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        setShowConfirmModal(false);
        setLoginForm(false);
        navigate("/");
    };


    const changeLanguage = (lng) => {
        transDispatch({ type: "CHANGE_LANGUAGE", payload: lng });
        setCurrentLanguage(lng);
        setLanguageDropdown(false);
        setMobileLangDropdown(false);
        // Reset activeTab to search when language is changed
        setActiveTab('search');
    };


    const location = useLocation();



    return (
        <div className="relative w-full max-h-[100px]">
            <div className="shadow-xl w-full bg-primary">
                <nav className="container-fluid px-10 lg:px-32 2xl:px-32 navbar w-full flex items-center justify-between py-0 md:py-4">
                    {/* Logo */}
                    <div className='hidden md:block ' >
                        <Logo />
                    </div>

                    {/* Mobile Navigation */}
                    {/* <SearchMobile/> */}


                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Currency Dropdown */}
                        {/* <div className="price-dropdown-container relative">
                            <div
                                className="price cursor-pointer hover:bg-black/80 shadow-xl h-10 rounded-lg px-4 py-2 text-white flex items-center gap-2  "
                                onClick={() => setPriceDropdown(!priceDropdown)}
                            >
                                <span className='text-2xl text-bold text-black bg-gradient-to-r from-orange-500 via-orange-100 to-blue h-8 w-8 rounded-full flex items-center justify-center'>{currencies[currentCurrency].symbol}</span>
                                <span className='text-sm'>{currencies[currentCurrency].label}</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`text-xs transition-transform duration-300 ${priceDropdown ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>

                            {priceDropdown && (
                                <div className="absolute w-[300px] h-[300px] right-0 mt-2 bg-gradient-to-b from-[#1a1a1a] to-blue border border-[#333333] rounded-xl shadow-lg z-50 overflow-hidden flex flex-col items-center justify-center">
                                    <div className="py-2 w-full">
                                        {Object.entries(currencies).map(([code, { symbol, label }]) => (
                                            <button
                                                key={code}
                                                className={`block w-full px-4 py-2 text-left text-white hover:bg-[#333333] flex flex-row items-center justify-start gap-2 ${currentCurrency === code ? 'bg-[#333333]' : ''
                                                    }`}
                                                onClick={() => handleCurrencyChange(code)}
                                            >
                                                <h1 className='text-3xl text-bold text-black h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-t from-blue via-orange-100 to-orange-500'>{symbol}</h1> {label} ({t(`currency.${code}`)})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div> */}

                        {/* Language Dropdown */}
                        <div className="language-dropdown-container relative">
                            <div
                                className="language-selector flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/80 cursor-pointer transition-all duration-300 shadow-xl"
                                onClick={() => setLanguageDropdown(!languageDropdown)}
                            >
                                <img
                                    src={languages[currentLanguage].flag}
                                    alt={`${currentLanguage} flag`}
                                    className="w-8 h-8 rounded-full object-cover object-center"
                                />
                                <span className='text-sm text-white font-medium'>
                                    {languages[currentLanguage].label}
                                </span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`text-white text-xs transition-transform duration-300 ${languageDropdown ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>

                            {languageDropdown && (
                                <div className="absolute right-0 w-[300px] h-[300px] mt-2 bg-gradient-to-b from-[#1a1a1a] to-blue border border-[#333333] rounded-xl shadow-lg z-50 overflow-hidden flex flex-col items-center justify-center">
                                    {Object.entries(languages).map(([code, { flag, label }]) => (
                                        <button
                                            key={code}
                                            className={`flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors duration-200 ${currentLanguage === code ? 'bg-[#333333]' : ''
                                                }`}
                                            onClick={() => changeLanguage(code)}
                                        >
                                            <img
                                                src={flag}
                                                alt={`${code} flag`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <span className="font-medium text-lg">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center justify-center space-x-2 border border-white rounded-full py-2 px-4 text-white bg-gradient-to-r from-orange-500 via-orange-100 to-blue hover:bg-gradient-to-l from-blue via-orange-200 transition-all duration-300"
                                >
                                    <div className="h-8 flex items-center justify-center w-[60px]">
                                        <FontAwesomeIcon icon={faSliders} className="text-xl text-black" />
                                        <FontAwesomeIcon icon={faUser} className="text-xl ms-4 text-black" />
                                    </div>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute top-14 left-[-300px] mt-2 w-[400px] bg-primary-dark border border-gray-700 rounded-xl shadow-xl z-50">
                                        <div className="p-2 flex flex-col">
                                            <button
                                                onClick={() => setShowConfirmModal(true)}
                                                className="flex items-center w-full px-4 py-3 text-left text-white rounded-lg hover:bg-gray-700 transition duration-200"
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-lg" />
                                                {t('translation:navbar.logout')}
                                            </button>

                                            <button
                                                onClick={() => navigate("/saved")}
                                                className="flex items-center w-full px-4 py-3 text-left text-white rounded-lg hover:bg-gray-700 transition duration-200"
                                            >
                                                <FontAwesomeIcon icon={faHeart} className="mr-3 text-lg" />
                                                {t('navbar.saved')}
                                            </button>

                                            <button
                                                onClick={() => navigate("/hosting")}
                                                className="flex items-center w-full px-4 py-3 text-left text-white rounded-lg hover:bg-gray-700 transition duration-200"
                                            >
                                                <FontAwesomeIcon icon={faHouseUser} className="mr-3 text-lg" />
                                                {t('navbar.partner')}
                                            </button>

                                            <button
                                                onClick={() => navigate("/profile")}
                                                className="flex items-center w-full px-4 py-3 text-left text-white rounded-lg hover:bg-gray-700 transition duration-200"
                                            >
                                                <FontAwesomeIcon icon={faUser} className="mr-3 text-lg" />
                                                {t('navbar.profile')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-x-2">
                                <Link to={'Login'}
                                    className="px-4 py-2 text-white hover:bg-[#333333] rounded-full transition"
                                >
                                    {t('navbar.login')}
                                </Link>
                                <Link to="/register">
                                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                                        {t('navbar.register')}
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

          <NavbarMobel />


            {/* Modals */}
            {showConfirmModal && (
                <ConfirmLogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
};

const ConfirmLogoutModal = ({ onConfirm, onCancel }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50">
            <div className="mt-20 w-full max-w-md bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-white">
                    {t('navbar.confirmLogout')}
                </h2>
                <p className="text-gray-400 mb-6">
                    {t('navbar.logoutMessage')}
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-400 hover:bg-[#333333] rounded-lg transition"
                    >
                        {t('navbar.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition"
                    >
                        {t('navbar.logout')}
                    </button>
                </div>
            </div>
        </div>
    );
};