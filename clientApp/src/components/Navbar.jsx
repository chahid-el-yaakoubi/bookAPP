import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contextApi/AuthContext';
import Login from './Login/login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMultiply, faGlobe, faSearch, faHeart, faSliders , faUser, faDollarSign, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TransContext } from '../contextApi/TransContext';

export const Logo = () => {
    return (
        <Link to="/">
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
    const { t } = useTranslation();
    const [loginForm, setLoginForm] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMobileNav, setShowMobileNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [languageDropdown, setLanguageDropdown] = useState(false);
    const [mobileLangDropdown, setMobileLangDropdown] = useState(false);
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
        tf:{
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

    // Add this effect to handle clicking outside mobile language dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.mobile-language-dropdown')) {
                setMobileLangDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Add new useEffect for price dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.price-dropdown-container')) {
                setPriceDropdown(false);
            }
            if (!event.target.closest('.mobile-price-dropdown')) {
                setMobilePriceDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
    };

    return (
        <div className="relative w-full max-h-[100px]">
            <div className="shadow-xl w-full bg-primary">
                <nav className="container mx-auto navbar w-full flex items-center justify-between py-4 px-6">
                    {/* Logo */}
                    <Link to={'/'}>
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Currency Dropdown */}
                        <div className="price-dropdown-container relative">
                            <div 
                                className="price cursor-pointer hover:bg-black/80 shadow-xl h-10 rounded-lg px-4 py-2 text-white flex items-center gap-2  "
                                onClick={() => setPriceDropdown(!priceDropdown)} 
                            >
                                <span className='text-2xl text-bold text-black bg-gradient-to-r from-orange-500 via-orange-100 to-blue h-8 w-8 rounded-full flex items-center justify-center'>{currencies[currentCurrency].symbol}</span>
                                <span className='text-sm'>{currencies[currentCurrency].label}</span>
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`text-xs transition-transform duration-300 ${
                                        priceDropdown ? 'rotate-180' : ''
                                    }`}
                                />
                            </div>
                            
                            {priceDropdown && (
                                <div className="absolute w-[300px] h-[300px] right-0 mt-2 bg-gradient-to-b from-[#1a1a1a] to-blue border border-[#333333] rounded-xl shadow-lg z-40 overflow-hidden flex flex-col items-center justify-center">
                                    <div className="py-2 w-full">
                                        {Object.entries(currencies).map(([code, { symbol, label }]) => (
                                            <button 
                                                key={code}
                                                className={`block w-full px-4 py-2 text-left text-white hover:bg-[#333333] flex flex-row items-center justify-start gap-2 ${
                                                    currentCurrency === code ? 'bg-[#333333]' : ''
                                                }`}
                                                onClick={() => handleCurrencyChange(code)}
                                            >
                                                <h1 className='text-3xl text-bold text-black h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-t from-blue via-orange-100 to-orange-500'>{symbol}</h1> {label} ({t(`currency.${code}`)})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

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
                                    className={`text-white text-xs transition-transform duration-300 ${
                                        languageDropdown ? 'rotate-180' : ''
                                    }`}
                                />
                            </div>
                            
                            {languageDropdown && (
                                <div className="absolute right-0 w-[300px] h-[300px] mt-2 bg-gradient-to-b from-[#1a1a1a] to-blue border border-[#333333] rounded-xl shadow-lg z-40 overflow-hidden flex flex-col items-center justify-center">
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
                                    className="flex items-center justify-center space-x-2 border border-white rounded-full py-2 px-4 text-white bg-gradient-to-r from-orange-500 via-orange-100 to-blue  hover:bg-gradient-to-l from-blue via-orange-200  transition-all duration-300"
                                >
                                    <div className="h-8  flex items-center justify-center w-[60px]">
                                        <FontAwesomeIcon icon={faSliders} className='text-xl text-black' />
                                        <FontAwesomeIcon icon={faUser} className='text-xl ms-4 text-black' />
                                    </div>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-lg z-40">
                                        <div className="py-2">
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className="block w-full px-4 py-3 text-left text-white hover:bg-[#333333]"
                                            >
                                                {t('navbar.profile')}
                                            </button>
                                            <button
                                                onClick={() => setShowConfirmModal(true)}
                                                className="block w-full px-4 py-3 text-left text-white hover:bg-[#333333]"
                                            >
                                                {t('navbar.logout')}
                                            </button>
                                            <button
                                                onClick={() => navigate("/saved")}
                                                className="block w-full px-4 py-3 text-left text-white hover:bg-[#333333]"
                                            >
                                                {t('navbar.saved')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    className="px-4 py-2 text-white hover:bg-[#333333] rounded-full transition"
                                    onClick={() => setLoginForm(true)}
                                >
                                    {t('navbar.login')}
                                </button>
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

            {/* Updated Mobile Navigation */}
            <div className={`fixed md:hidden bottom-0 left-0 right-0 w-full bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 transition-transform duration-300 z-50 
                ${showMobileNav ? 'translate-y-0' : 'translate-y-full'} shadow-lg`}>
                <div className="flex items-center justify-around py-3 px-4 safe-area-bottom">
                    <Link 
                        to="/" 
                        className={`flex flex-row items-center gap-1 rounded-full px-4 py-2 ${
                            activeTab === 'search' 
                                ? 'text-white bg-blue' 
                                : 'text-gray-100'
                        } hover:bg-blue-100 active:scale-95 transition-all`}
                        onClick={() => setActiveTab('search')}
                    >
                        <FontAwesomeIcon icon={faSearch} className="text-xl" />
                        {activeTab === 'search' && <span className="text-xs font-medium">{t('navbar.search')}</span>}
                    </Link>

                    <div 
                        className={`flex flex-row items-center gap-1 rounded-full px-4 py-2 ${
                            activeTab === 'price' 
                                ? 'text-white bg-blue' 
                                : 'text-gray-100'
                        } hover:bg-blue-100 active:scale-95 transition-all`}
                        onClick={() => {
                            setActiveTab('price');
                            setMobilePriceDropdown(!mobilePriceDropdown);
                        }}
                    >
                        <FontAwesomeIcon icon={faDollarSign} className="text-xl" />
                        {activeTab === 'price' && <span className="text-xs font-medium">{t('currency.current')}</span>}
                        {mobilePriceDropdown && (
                            <div className="fixed bottom-16 left-0 right-0 mx-auto w-[90%] max-w-[300px] bg-gradient-to-b from-[#1a1a1a] to-blue border border-[#333333] rounded-xl shadow-lg overflow-hidden safe-area-bottom">
                                <div className="py-2 w-full max-h-[400px] overflow-y-auto">
                                    {Object.entries(currencies).map(([code, { symbol, label }]) => (
                                        <button 
                                            key={code}
                                            className={`block w-full px-4 py-3 text-left text-white hover:bg-[#333333] flex items-center gap-3 ${
                                                currentCurrency === code ? 'bg-[#333333]' : ''
                                            }`}
                                            onClick={() => handleCurrencyChange(code)}
                                        >
                                            <span className='text-2xl text-bold text-black bg-gradient-to-r from-orange-500 via-orange-100 to-blue h-10 w-10 rounded-full flex items-center justify-center'>
                                                {symbol}
                                            </span>
                                            <span>{label} ({t(`currency.${code}`)})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div 
                        className={`flex flex-row items-center gap-1 rounded-full px-4 py-2 ${
                            activeTab === 'language' 
                                ? 'text-white bg-blue' 
                                : 'text-gray-100'
                        } hover:bg-blue-100 active:scale-95 transition-all mobile-language-dropdown`}
                        onClick={() => {
                            setActiveTab('language');
                            setMobileLangDropdown(!mobileLangDropdown);
                        }}
                    >
                        <FontAwesomeIcon icon={faGlobe} className="text-xl" />
                        {activeTab === 'language' && <span className="text-xs font-medium">{t('navbar.language')}</span>}
                        {mobileLangDropdown && (
                            <div className="fixed bottom-16 left-0 right-0 mx-auto w-[90%] max-w-[300px] bg-gradient-to-b from-[#1a1a1a] to-blue border border-[#333333] rounded-xl shadow-lg overflow-hidden safe-area-bottom">
                                <div className="py-2 w-full max-h-[400px] overflow-y-auto">
                                    {Object.entries(languages).map(([code, { flag, label }]) => (
                                        <button 
                                            key={code}
                                            className={`flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-[#333333] transition-colors duration-200 ${
                                                currentLanguage === code ? 'bg-[#333333]' : ''
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent event bubbling
                                                changeLanguage(code);
                                            }}
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
                        )}
                    </div>

                    {user ? (
                        <>
                            <Link 
                                to="" 
                                className={`flex flex-row items-center gap-1 rounded-full px-4 py-2 ${
                                    activeTab === 'saved' 
                                        ? 'text-white bg-blue' 
                                        : 'text-gray-100'
                                } hover:bg-blue-100 active:scale-95 transition-all`}
                                onClick={() => setActiveTab('saved')}
                            >
                                <FontAwesomeIcon icon={faHeart} className="text-xl" />
                                {activeTab === 'saved' && <span className="text-xs font-medium">{t('navbar.saved')}</span>}
                            </Link>
                            <Link 
                                to="" 
                                className={`flex flex-row items-center gap-1 rounded-full px-4 py-2 ${
                                    activeTab === 'count' 
                                        ? 'text-white bg-blue' 
                                        : 'text-gray-100'
                                } hover:bg-blue-100 active:scale-95 transition-all`}
                                onClick={() => setActiveTab('count')}
                            >
                                <FontAwesomeIcon icon={faUser} className="text-xl" />
                                {activeTab === 'count' && <span className="text-xs font-medium">Count</span>}
                            </Link>
                        </>
                    ) : (
                        <div className="space-x-2 flex items-center">
                            <button
                                className="px-4 py-2 hover:bg-gray-50 text-[10px] rounded-lg border border-white text-white transition"
                                onClick={() => setLoginForm(true)}
                            >
                                {t('navbar.login')}
                            </button>
                            <Link to="/register">
                                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                                    {t('navbar.register')}
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {!user && loginForm && <LoginComponent setLoginForm={setLoginForm} />}
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

const LoginComponent = ({ setLoginForm }) => {
    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-70 z-50">
            <div className="mt-20 w-full max-w-xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-6 shadow-lg relative">
                <button
                    onClick={() => setLoginForm(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >

                    <FontAwesomeIcon icon={faMultiply} className='text-white text-xl bg-red-600 p-2 rounded-sm' />

                </button>
                <Login />
            </div>
        </div >
    );
};
