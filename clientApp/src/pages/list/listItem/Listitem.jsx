import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faHeart as faHeartRegular, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { ContactModal } from '../../../components/ContactModal';

export const Listitem = ({ hotel, displayMode }) => {
    const [showPhone, setShowPhone] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const phoneNumber = hotel?.phone || "+212 000-000-000";
    const rating = hotel?.rating || 9.8;
    const photoSrc = hotel?.photos?.[0] || '/assets/images/placeholder-hotel.jpg';

    const handleWhatsAppClick = () => {
        const formattedPhone = phoneNumber.replace(/[^0-9+]/g, '');
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    const handlePhoneClick = () => {
        if (!showPhone) {
            setShowPhone(true);
            return;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(phoneNumber)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
            })
            .catch(err => console.error('Failed to copy:', err));
    };

    const handleSave = (e) => {
        e.preventDefault(); // Prevent event bubbling
        setIsSaved(!isSaved);
        // Here you would typically also handle the actual saving logic
        // For example: saveToDatabase(hotel._id);
    };

    // console.log(hotel)

    return (
        <div className={`
            ${displayMode === 'mosaic' 
                ? 'bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden'
                : 'flex flex-col md:flex-row gap-4 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200'
            }
        `}>
            {displayMode === 'mosaic' ? (
                <div className="flex flex-col bg-white p-2">
                    {/* Image section */}
                    <div className="relative w-full  h-48">
                        <img
                            src={photoSrc}
                            alt={hotel?.name || 'Hotel Image'}
                            className="h-full w-full object-cover"
                        />
                        <button 
                            onClick={handleSave}
                            className={`absolute top-2 right-2 flex items-center justify-center p-2 rounded-full w-12 h-12 bg-gray-100`}
                        >
                            <FontAwesomeIcon 
                                icon={isSaved ? faHeartSolid : faHeartRegular} 
                                className={`h-6 w-6 ${isSaved ? 'text-red-500' : 'text-gray-900'}`}
                            />
                        </button>
                        <div className="absolute top-2 left-2 bg-blue/90 backdrop-blur-sm px-2 py-1 rounded">
                            <span className="text-xs font-medium text-gray-900">
                                {hotel?.rooms?.length} {hotel?.rooms?.length > 1 ? 'Chambres' : 'Chambre'}
                            </span>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="p-3 flex flex-col justify-between">
                        {/* Header */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                {hotel?.title}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="inline-block mr-1">📍</span>
                                {hotel?.baseInfo?.address} • {hotel?.baseInfo?.city || 'Ville non spécifiée'}
                            </p>
                        </div>

                        {/* Price section */}
                        <div className="mt-3 flex items-start justify-between gap-2">
                            <div>
                                {hotel?.cheapestPrice > 100 && (
                                    <p className="text-sm text-gray-500 line-through">MAD {hotel?.cheapestPrice - 100}</p>
                                )}
                                <div className="flex items-baseline gap-1">
                                    <p className="text-xl font-bold text-gray-900">MAD {hotel?.cheapestPrice}</p>
                                    <p className="text-sm text-gray-600">/ nuit</p>
                                </div>
                            </div>
                            <Link to={`/hotel/${hotel._id}`}>
                                <button className="bg-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    <FontAwesomeIcon icon={faEye} className="mr-1" /> Détails
                                </button>
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 border-t border-gray-200 mt-3 pt-3">
                            <button 
                                className="flex-1 flex items-center justify-center gap-1 text-blue hover:text-blue-700 text-xs"
                                onClick={() => setIsContactModalOpen(true)}
                            >
                                <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />
                                <span>Contact</span>
                            </button>
                            <button 
                                className="flex-1 flex items-center justify-center gap-1 text-blue hover:text-blue/90 text-xs"
                                onClick={handlePhoneClick}
                            >
                                <FontAwesomeIcon icon={faPhone} className="h-3 w-3" />
                                {showPhone ? (
                                    <span>{isCopied ? "Copié!" : phoneNumber}</span>
                                ) : (
                                    <span>Phone</span>
                                )}
                            </button>
                            <button 
                                className="flex-1 flex items-center justify-center gap-1 text-green-500 hover:text-green-600 text-xs"
                                onClick={handleWhatsAppClick}
                            >
                                <FontAwesomeIcon icon={faPhone} className="h-3 w-3 bg-green-500 text-white p-1 rounded-full" />
                                <span>WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row w-full bg-white p-4 gap-6">
                    {/* Image section with improved styling */}
                    <div className="relative w-full md:w-72 h-64 md:h-48">
                        <img
                            src={photoSrc}
                            alt={hotel?.name || 'Hotel Image'}
                            className="h-full w-full object-cover rounded-lg"
                        />
                        <button 
                            onClick={handleSave}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm"
                        >
                            <FontAwesomeIcon 
                                icon={isSaved ? faHeartSolid : faHeartRegular} 
                                className={`h-4 w-4 ${isSaved ? 'text-red-500' : 'text-gray-600'}`}
                            />
                        </button>
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <span className="text-sm font-medium text-gray-800">
                                {hotel?.rooms?.length} {hotel?.rooms?.length > 1 ? 'Chambres' : 'Chambre'}
                            </span>
                        </div>
                    </div>

                    {/* Content section with improved layout */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                            {/* Header section */}
                            <div>
                                <div className="flex items-start justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                        {hotel?.title}
                                    </h2>
                                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                                        <span className="text-blue font-semibold">{rating}</span>
                                        <span className="text-sm text-blue">/10</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    <span className="inline-block mr-1">📍</span>
                                    {hotel?.baseInfo?.address} • {hotel?.baseInfo?.city || 'Ville non spécifiée'}
                                </p>
                            </div>

                            {/* Features section */}
                            <div className="flex gap-3">
                                {hotel?.features?.slice(0, 3).map((feature, index) => (
                                    <span key={index} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bottom section with price and actions */}
                        <div className="mt-4 flex items-end justify-between">
                            {/* Price section */}
                            <div>
                                {hotel?.cheapestPrice > 100 && (
                                    <p className="text-sm text-gray-500 line-through">
                                        MAD {hotel?.cheapestPrice - 100}
                                    </p>
                                )}
                                <div className="flex items-baseline gap-1.5">
                                    <p className="text-2xl font-bold text-gray-900">
                                        MAD {hotel?.cheapestPrice}
                                    </p>
                                    <p className="text-sm text-gray-600">par nuit</p>
                                </div>
                            </div>

                            {/* Actions section */}
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <button 
                                        className="flex items-center gap-2 px-3 py-2 text-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        onClick={() => setIsContactModalOpen(true)}
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                                        <span className="text-sm font-medium">Contact</span>
                                    </button>
                                    <button 
                                        className="flex items-center gap-2 px-3 py-2 text-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        onClick={handlePhoneClick}
                                    >
                                        <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {showPhone ? (isCopied ? "Copié!" : phoneNumber) : "Phone"}
                                        </span>
                                    </button>
                                </div>
                                <Link to={`/hotel/${hotel._id}`}>
                                    <button className="bg-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                        <FontAwesomeIcon icon={faEye} className="mr-2" /> 
                                        Voir détails
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ContactModal 
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                hotel={hotel}
            />
        </div>
    );
};
