import {
    Bath, Bed, Check, Maximize,
    Users,
    MapPin,
    Info,
    Music,
    Wifi,
    Diamond,
    Utensils,
    Smartphone,
    X,
    ShowerHead
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BookingCard } from "../componentHotel/BookingCard";

// Main RoomDetail component
function RoomDetail({ room, onClose }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const [activeTab, setActiveTab] = useState("overview");
    const [current, setCurrent] = useState(0);
    const [expandedBathrooms, setExpandedBathrooms] = useState({});
    const [showBookingCardMobile, setShowBookingCardMobile] = useState(false);

    const total = room.photos.length;

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % total);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + total) % total);
    };

    // Prevent body scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Helper function to get icon for amenity category
    const getCategoryIcon = (category) => {
        switch (category) {
            case "Entertainment":
                return <Music className="h-5 w-5" />;
            case "Workspace":
                return <Wifi className="h-5 w-5" />;
            case "Moroccan Features":
                return <Diamond className="h-5 w-5" />;
            case "Kitchen & Dining":
                return <Utensils className="h-5 w-5" />;
            case "Technology":
                return <Smartphone className="h-5 w-5" />;
            default:
                return <Info className="h-5 w-5" />;
        }
    };

    const toggleBathroomExpansion = (bathroomIndex) => {
        setExpandedBathrooms(prev => ({
            ...prev,
            [bathroomIndex]: !prev[bathroomIndex]
        }));
    };

    return (
        <div className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 `}>
            <div className="bg-white rounded-lg w-full  h-full overflow-hidden flex flex-col pb-20 md:pb-0">
                {/* Header with close button */}
                <div className={`flex justify-between items-center p-4 border-b`}>
                    <h2 className={`text-xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{room.type}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className={`flex-1 overflow-y-auto p-4 md:p-6 flex flex-col md:flex-row gap-8 h-full`}>
                    {/* Room Images */}
                   <div className="flex flex-col md:flex-col gap-4 w-full md:w-2/5">
                   <div className="relative w-full md:w-full">
                        <div className="relative w-full rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                            <img
                                src={room.photos[current].url}
                                alt={`${room.type} ${current + 1}`}
                                className="w-auto h-[30vh] md:max-h-[40vh] md:h-full object-cover transition-all duration-500"
                            />
                            {/* Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                             
                                <h1 className={`text-xl md:text-2xl font-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>{room.type}</h1>
                             
                            </div>
                            {/* Navigation Buttons */}
                            <button
                                onClick={prevSlide}
                                className={`absolute top-1/2 ${isRTL ? 'right-4' : 'left-4'} transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black`}
                            >
                                {'❮'}
                            </button>
                            <button
                                onClick={nextSlide}
                                className={`absolute top-1/2 ${isRTL ? 'left-4' : 'right-4'} transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black`}
                            >
                                {'❯'}
                            </button>
                        </div>
                        {/* Book Now Button for mobile (fixed at bottom) */}
                        <div className="md:hidden">
                            <div className="fixed left-0 right-0 bottom-0 z-10 px-2 pb-2 pointer-events-none">
                                <button
                                    className="w-full bg-blue text-white py-3 rounded-full font-semibold shadow-lg pointer-events-auto text-lg"
                                    onClick={() => setShowBookingCardMobile(true)}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                        {/* BookingCard Modal for mobile */}
                        {showBookingCardMobile && (
                            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 md:hidden">
                                <div className="relative w-full max-w-md mx-auto p-4">
                                    <button
                                        className="top-2 right-2 z-30 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                                        onClick={() => setShowBookingCardMobile(false)}
                                        aria-label="Close Booking Card"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                    <BookingCard
                                        pricePerNight={room.price}
                                        rating={room.rating}
                                        reviewCount={room.reviewCount}
                                        hotel={null}
                                        roomId={room._id}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                     {/* BookingCard for desktop (sidebar) */}
                     <div className="hidden md:block mt-6">
                            <BookingCard
                                pricePerNight={room.price}
                                rating={room.rating}
                                reviewCount={room.reviewCount}
                                hotel={null}
                                roomId={room._id}
                            />
                        </div></div>
                    {/* Room Details Tabs and BookingCard for desktop */}
                    <div className="w-full md:w-2/3 mb-6 flex flex-col gap-6   overflow-y-scroll">
                        <div className="grid grid-cols-3 bg-gray-900 rounded-lg overflow-hidden mt-40 ">
                            <button
                                className={`py-2 px-4 text-sm font-medium ${activeTab === "overview" ? "bg-blue text-white" : "text-gray-900"}`}
                                onClick={() => setActiveTab("overview")}
                            >
                                {t('overview')}
                            </button>
                            <button
                                className={`py-2 px-4 text-sm font-medium ${activeTab === "amenities" ? "bg-blue text-white" : "text-gray-900"}`}
                                onClick={() => setActiveTab("amenities")}
                            >
                                {t('amenities')}
                            </button>
                            <button
                                className={`py-2 px-4 text-sm font-medium ${activeTab === "features" ? "bg-blue text-white" : "text-gray-900"}`}
                                onClick={() => setActiveTab("features")}
                            >
                                {t('features')}
                            </button>
                        </div>
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="pt-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <Bed className="h-8 w-8 mb-2 text-gray-900" />
                                            <span className="text-sm font-medium text-gray-900 text-center">
                                                {room.beds?.map((bed) => `${bed.count} ${t(bed.type.toLowerCase().replace(/ /g, '_'))}`).join(", ") || "1 King Bed"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <Maximize className="h-8 w-8 mb-2 text-gray-900" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {room.size?.value} {room.size?.unit || "m²"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <Users className="h-8 w-8 mb-2 text-gray-900" />
                                            <span className="text-sm font-medium text-gray-900">{room.capacity || "2"} {t('guests')}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <Bath className="h-8 w-8 mb-2 text-gray-900" />
                                            <span className="text-sm font-medium text-gray-900">{room.bathrooms?.length || "1"} {t('bathrooms')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t('description')}</h3>
                                        <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t('default_room_description')}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t('views')}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(room.view || ["Garden", "Pool"]).map((view, index) => (
                                                <div key={index} className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 text-xs font-medium rounded-full">
                                                    {t(view.toLowerCase().replace(/ /g, '_'))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Amenities Tab */}
                        {activeTab === "amenities" && (
                            <div className="pt-6">
                                <div className="space-y-8">
                                    {Object.entries(room.categorizedAmenities || {
                                        "Entertainment": ["smart_tv", "streaming_services"],
                                        "Workspace": ["desk", "wifi", "charging_ports"],
                                        "Moroccan Features": ["traditional_decor", "local_artworks"],
                                        "Technology": ["smart_controls", "high_speed_internet"]
                                    }).map(([category, amenities], categoryIndex) => (
                                        <div key={category}>
                                            <div className={`flex items-center mb-4 `}>
                                                <div className={`bg-gray-100 p-2 rounded-full text-gray-900 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                                                    {getCategoryIcon(category)}
                                                </div>
                                                <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t(category.toLowerCase())}</h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {amenities.map((amenity, index) => (
                                                    <div key={index} className={`flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 `}>
                                                        <Check className={`h-4 w-4 text-gray-900 ${isRTL ? 'ml-2' : 'mr-2'} flex-shrink-0`} />
                                                        <span className={`text-sm text-gray-700 capitalize ${isRTL ? 'text-right' : 'text-left'}`}>{t(amenity)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {categoryIndex < Object.entries(room.categorizedAmenities || {}).length - 1 && (
                                                <div className="my-6 h-px bg-gray-200" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Features Tab */}
                        {activeTab === "features" && (
                            <div className="pt-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className={`text-xl font-semibold text-gray-900 mb-4 `}>{t('room_features')}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {(room.roomFeatures || []).map((feature, index) => (
                                                <div key={index} className={`flex items-center`}>
                                                    <div className={`h-2 w-2 rounded-full bg-blue ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
                                                    <span className={`text-sm text-gray-700 capitalize ${isRTL ? 'text-right' : 'text-left'}`}>{t(feature)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="my-6 h-px bg-gray-200" />

                                    <div>
                                        <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('bathroom_amenities')}</h3>

                                        {(room.bathrooms).map((bathroom, index) => (
                                            <div key={index} className="mb-6">
                                                <div className={`flex items-center mb-3`}>
                                                    <ShowerHead className={`h-5 w-5 text-gray-900 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                                    <h4 className={`font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                        {t('bathroom')} {index + 1} - {t(bathroom.type.toLowerCase())}
                                                    </h4>
                                                </div>
                                                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ${isRTL ? 'pr-7' : 'pl-7'}`}>
                                                    {Object.entries(bathroom.amenities)
                                                        .filter(([_, value]) => value === true)
                                                        .slice(0, expandedBathrooms[index] ? undefined : 9)
                                                        .map(([key], idx) => (
                                                            <div key={idx} className={`flex items-center`}>
                                                                <Check className={`h-3.5 w-3.5 text-gray-900 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                                                                <span className={`text-sm text-gray-700 capitalize ${isRTL ? 'text-right' : 'text-left'}`}>{t(key)}</span>
                                                            </div>
                                                        ))}
                                                    {Object.entries(bathroom.amenities).filter(([_, value]) => value === true).length > 9 && (
                                                        <button
                                                            onClick={() => toggleBathroomExpansion(index)}
                                                            className={`text-sm text-blue font-medium hover:underline ${isRTL ? 'text-right' : 'text-left'}`}
                                                        >
                                                            {expandedBathrooms[index] ? t('show_less') : `+${Object.entries(bathroom.amenities).filter(([_, value]) => value === true).length - 9} ${t('more')}`}
                                                        </button>
                                                    )}
                                                </div>
                                                {index < (room.bathrooms || []).length - 1 && (
                                                    <div className="my-4 h-px bg-gray-200" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomDetail;