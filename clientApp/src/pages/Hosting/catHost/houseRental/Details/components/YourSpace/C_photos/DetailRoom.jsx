import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import {
    FaBed,
    FaBath,
    FaRulerCombined,
    FaBuilding,
    FaDog,
    FaSmoking,
    FaSmokingBan,
    FaPaw,
    FaWindowMaximize,
    FaUmbrellaBeach,
    FaMountain,
    FaTree,
    FaCity,
    FaSwimmingPool,
} from 'react-icons/fa';
import { IoBed } from 'react-icons/io5';
import { MdBalcony } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import useFetch from '../../../../../../../../hooks/useFetch';
import ImgHotel from '../../../../../../ComponentHost/imgHotel';
import axios from 'axios';

const ViewIcons = {
    'City View': <FaCity className="text-gray-600" />,
    'Sea View': <FaUmbrellaBeach className="text-orange-600" />,
    'Mountain View': <FaMountain className="text-amber-800" />,
    'Garden View': <FaTree className="text-green-600" />,
    'Pool View': <FaSwimmingPool className="text-orange-400" />,
};


export const ConfirmModal = ({ isOpen, onClose, onConfirm, message, img, id }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-xl w-80">
                {img && <img className="w-full h-40 object-cover rounded-sm mb-4" src={img} alt="property image" />}
                <h2 className="text-lg font-semibold mb-4">{message || 'Are you sure?'}</h2>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(img ? img : id);
                        }}
                        className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};


export const RoomDetail = ({ onBack, onEdit }) => {
    const [showImageModalAdd, setShowImageModalAdd] = useState(false);

    const handleImageModalOpen = () => {
        setShowImageModalAdd(!showImageModalAdd);
    };

    const { roomId } = useParams();
    const { data, reFetch } = useFetch(`/api/rooms/${roomId}`)
    const room = data ? data : {};

    const handleDeleteImg = async (imageToDelete) => {
        const res = await axios.delete(`/api/rooms/${roomId}/photos/remove`, {
            data: { imgUrl: imageToDelete }
        })

        if (res.data.success) {
            reFetch();
            onClose();
        } else {
            console.log('Failed to delete image');
        }
    };


    const formatSize = (size) => {
        if (!size) return 'Not specified';
        return `${size.value} ${size.unit === 'sq_m' ? 'm²' : 'ft²'}`;
    };

    // Safe access to array length
    const bathroomsCount = room?.bathrooms?.length || 0;

    // Function to get the first photo or a placeholder
    const getMainPhoto = () => {
        return room?.photos && room.photos.length > 0
            ? room.photos[0].url
            : '/api/placeholder/800/500';
    };

    const [mainPhoto, setMainPhoto] = useState(getMainPhoto());
    const [showConfirm, setShowConfirm] = useState(false);

    const onClose = () => {
        setShowConfirm(false);
    }
    const handleRemoveMainPhoto = () => {
        setShowConfirm(true);
    };

    // Optional: Update main photo when room changes
    useEffect(() => {
        setMainPhoto(getMainPhoto());
    }, [room]);
    // Check for categorized amenities
    const categorizedAmenities = room?.categorizedAmenities
        ? Object.entries(room.categorizedAmenities)
        : [];


    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <button
                onClick={onBack}
                className="group mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-lg">Back to Dashboard</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                    <div className="space-y-6">
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={mainPhoto}
                                alt="Main Room"
                                className="w-full h-full object-cover"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            {/* Remove Icon (Top Right) */}
                            <button
                                onClick={handleRemoveMainPhoto}
                                className="absolute top-3 right-3 bg-black text-white rounded-md p-2 hover:bg-black/80 hover:scale-105 transition"
                            >
                                <Trash2 size={20} className='text-red-500' />
                            </button>

                            {/* Bottom Info */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <h1 className="text-4xl font-bold text-white mb-2">{room?.type || 'Room'}</h1>
                                <div className="flex items-baseline text-white">
                                    <span className="text-3xl font-bold">MAD {room?.price || '0'}</span>
                                    <span className="ml-1 text-sm opacity-90">/night</span>
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-3 gap-4">
                            {room?.photos?.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative h-24 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => setMainPhoto(image.url)}
                                >
                                    <img
                                        src={image.url}
                                        alt={`${room?.type || 'Room'} ${index + 2}`}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>


                        {/* Add Images Button */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-200 flex items-center gap-1"
                            onClick={handleImageModalOpen}
                            aria-label="Add images"
                        >
                            <Plus className="h-5 w-5" />
                            <span className="text-sm hidden md:inline">Add images</span>
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Room details grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                                <FaRulerCombined className="text-orange-600 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Room Size</p>
                                    <p className="font-semibold">{formatSize(room?.size)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                                <FaBath className="text-orange-600 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Bathrooms</p>
                                    <p className="font-semibold">{bathroomsCount} {bathroomsCount === 1 ? 'Bathroom' : 'Bathrooms'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                                <IoBed className="text-orange-600 text-xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Capacity</p>
                                    <p className="font-semibold">Sleeps {room?.capacity || '0'}</p>
                                </div>
                            </div>
                            {room?.floor !== undefined && room?.floor !== null && (
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                                    <FaBuilding className="text-orange-600 text-xl" />
                                    <div>
                                        <p className="text-sm text-gray-500">Floor</p>
                                        <p className="font-semibold">Level {room.floor}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Room Features section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Room Features</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {room?.roomFeatures?.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full">
                                            <Check size={16} className="text-orange-600" />
                                        </div>
                                        <span className="font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* View section - only show if views exist */}
                        {room?.view && room.view.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">View</h2>
                                <div className="flex flex-wrap gap-3">
                                    {room.view.map((view) => (
                                        <div
                                            key={view}
                                            className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200"
                                        >
                                            {ViewIcons[view] || <FaWindowMaximize className="text-orange-500" />}
                                            <span className="font-medium">{view}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sleeping Arrangements - only show if beds exist */}
                        {room?.beds && room.beds.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">Sleeping Arrangements</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {room.beds.map((bed, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100"
                                        >
                                            <FaBed className="text-orange-600 text-xl" />
                                            <div>
                                                <p className="font-medium">{bed.type}</p>
                                                <p className="text-sm text-gray-500">{bed.count} {bed.count > 1 ? 'beds' : 'bed'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Amenities section */}
                        {room?.amenities && room.amenities.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {room.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full">
                                                <Check size={16} className="text-orange-600" />
                                            </div>
                                            <span className="font-medium">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                        {showImageModalAdd && <ImgHotel setShowModal={setShowImageModalAdd} showModal={showImageModalAdd} type={'property'} hotelId={room._id} path={'rooms'} reFetch={reFetch} />}


                        
                    </div>
                    <>
                        {/* Categorized Amenities section */}

                        {categorizedAmenities && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">Special Amenities</h2>
                                {categorizedAmenities.map(([category, amenities], index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="font-semibold text-lg text-gray-700">{category}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {amenities.map((amenity, idx) => (
                                                <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full">
                                                        <Check size={16} className="text-orange-600" />
                                                    </div>
                                                    <span className="font-medium">{amenity.replace(/_/g, ' ')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* Bathroom Details - if there are bathroom objects with amenities */}
                        {room?.bathrooms && room.bathrooms.length > 0 && room.bathrooms.some(bath => bath.amenities?.size > 0) && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">Bathroom Details</h2>
                                <div className="space-y-4">
                                    {room.bathrooms.map((bathroom, index) => {
                                        const bathroomAmenities = bathroom.amenities ? Array.from(bathroom.amenities.entries()) : [];
                                        if (bathroomAmenities.length === 0) return null;

                                        return (
                                            <div key={index} className="p-4 bg-gray-50 rounded-xl">
                                                <h3 className="font-semibold mb-3">Bathroom #{bathroom.id || index + 1}</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {bathroomAmenities.map(([amenity, hasIt], i) => (
                                                        hasIt ? (
                                                            <div key={i} className="flex items-center space-x-2">
                                                                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 rounded-full">
                                                                    <Check size={12} className="text-green-600" />
                                                                </div>
                                                                <span className="text-sm">{amenity}</span>
                                                            </div>
                                                        ) : null
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Description if available */}
                        {room?.description && (
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                                <p className="text-gray-600">{room.description}</p>
                            </div>
                        )}
                        <button
                            className="w-full py-4 bg-orange-600 text-white text-lg font-semibold rounded-xl hover:bg-orange-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={() => {
                                onEdit(room, false)
                            }}
                        >
                            Edit Room
                        </button>
                        </>
                        
                </div>
            </div>

            {
                showConfirm && <ConfirmModal onConfirm={handleDeleteImg} isOpen={showConfirm} img={mainPhoto} onClose={onClose} message={"Are you sure you want to delete this image?"} />
            }
        </div>
    );
};


