import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHotel,
    faCity,
    faLocationDot,
    faMoneyBill,
    faBed,
    faStar,
    faUsers,
    faDoorOpen,
    faInfoCircle,
    faPlus,
    faImage,
    faTable,
    faTimes,
    faLanguage,
    faCheck,
    faClock,
    faPaw,
    faCalendarAlt,
    faCouch,
    faList,
    faPhone,
    faEdit,
    faChevronDown,
    faChevronUp,
    faConciergeBell,
    faRulerCombined,
    faChair,
} from "@fortawesome/free-solid-svg-icons";
import DataRoom from './DataRoom';
import ImgHotel from '../../components/imgHotel';
import { ImTelegram } from 'react-icons/im';
import { AuthContext } from '../../context/AuthContect';

const SingleHotel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);


    const roomAmenities = [
        "Free toiletries",
        "Shower",
        "Toilet",
        "Towels",
        "TV",
        "Satellite channels",
        "Shared toilet",
        "Wake-up service/Alarm clock",
        "Carpeted",
        "Wake-up service",
        "Wardrobe or closet",
        "Toilet paper"
    ]




    const { data: hotel , loading: hotelLoading, error: hotelError, reFetch } = useFetch(`/api/hotels/find/${id}`);
    const data = hotel;

    useEffect(() => {
        const checkAdmin = async () => {
            // Ensure data is not empty or undefined
            if (!data || Object.keys(data).length === 0) return;

            if (user?.adminHotes && !user?.adminUsers) {
                const isAdminMismatch = user._id !== data?.isA;
                if (isAdminMismatch) {
                    navigate("/hotels");
                }
            }
        };

        checkAdmin();
    }, [user, data, navigate]);

    const hotelId = hotel?._id;
    const [roomFormData, setRoomFormData] = useState({
        title: '',
        price: '',
        maxPeople: '',
        desc: '',
        area: '',
        roomNumber: '', // Will be split into array of numbers
        amenities: [],

    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800';

    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isGeneralInfoOpen, setIsGeneralInfoOpen] = useState(true);
    const [isPoliciesOpen, setIsPoliciesOpen] = useState(true);
    const [isLanguagesOpen, setIsLanguagesOpen] = useState(true);
    const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(true);
    const [isImagesOpen, setIsImagesOpen] = useState(false);
    const [isRoomsOpen, setIsRoomsOpen] = useState(true);
    const [isContactInfoOpen, setIsContactInfoOpen] = useState(true);
    const [isLocationInfoOpen, setIsLocationInfoOpen] = useState(true);
    const [isProximityInfoOpen, setIsProximityInfoOpen] = useState(true);



    useEffect(() => {
        if (hotel?.images) {
            setImages(hotel.images);
        }
    }, [hotel]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleCheckboxChange = (e) => {
    //     const { value, checked } = e.target;
    //     setRoomFormData((prev) => {
    //         const newAmenities = checked
    //             ? [...prev.amenities, value]
    //             : prev.amenities.filter((amenity) => amenity !== value);
    //         return {
    //             ...prev,
    //             amenities: newAmenities,
    //         };
    //     });
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const roomNumberArray = roomFormData.roomNumber
                .split(',')
                .map(num => num.trim())
                .filter(num => num) // Remove empty strings
                .map(num => ({
                    number: parseInt(num),
                    unavailableDates: [] // Fixed typo in unavailableDates
                }));

            if (roomNumberArray.some(room => isNaN(room.number))) {
                throw new Error('Invalid room numbers format');
            }

            const roomData = {
                title: roomFormData.title.trim(),
                price: parseInt(roomFormData.price),
                maxPeople: parseInt(roomFormData.maxPeople),
                desc: roomFormData.desc.trim(),
                area: roomFormData.area,
                roomNumber: roomNumberArray,
                amenities: roomFormData.amenities
            };
            console.log(roomData);

            let url = `/api/rooms/${hotelId}`;
            let method = 'POST';

            if (isEditMode && editingRoom) {
                url = `/api/rooms/${editingRoom._id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create/update room');
            }

            const data = await response.json();
            if (isEditMode) {
                setRooms(prev => prev.map(room => room._id === editingRoom._id ? data : room));
            } else {
                setRooms(prev => [...prev, data]);
            }
            setIsModalOpen(false);
            resetForm();
            reFetch();
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        handleSubmit(e);
    }





    const updateRooms = () => {
        reFetch();
    };

    const handleEditRoom = (room) => {
        setIsEditMode(true);
        setEditingRoom(room);
        setRoomFormData({
            title: room.title,
            price: room.price,
            maxPeople: room.maxPeople,
            desc: room.desc,
            area: room.area,
            roomNumber: room.roomNumber.map(r => r.number).join(', '),
            amenities: room.amenities
        });
        setIsModalOpen(true);

    };

    const resetForm = () => {
        setRoomFormData({
            title: '',
            price: '',
            maxPeople: '',
            desc: '',
            area: '',
            roomNumber: '',
            amenities: []
        });
        setIsEditMode(false);
        setEditingRoom(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleEditHotel = () => {
        navigate(`/hotels/update/${id}`);
    };

    useEffect(() => {
        let isSubscribed = true;

        const fetchData = async () => {
            try {
                // ... any async operations
                if (isSubscribed) {
                    // update state here
                }
            } catch (error) {
                if (isSubscribed) {
                    setError(error.message);
                }
            }
        };

        fetchData();

        return () => {
            isSubscribed = false;
        };
    }, [id]); // Add appropriate dependencies

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        setRoomFormData((prevData) => ({
            ...prevData,
            amenities: checked
                ? [...prevData.amenities, value] // Add the new amenity if checked
                : prevData.amenities.filter((amenity) => amenity !== value), // Remove the unchecked amenity
        }));
    };



    const toggleAmenity = (amenity) => {
        return roomFormData.amenities.includes(amenity);
    };



    if (hotelLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (hotelError) return <div className="text-red-500 text-center">Error: {hotelError}</div>;
    return (
        <div className="p-8 bg-slate-50 max-w-7xl mx-auto overflow-y-auto bg-blue-500">
            {/* Basic Information Section */}
            <div className="mb-8 flex justify-between items-center bg-transparent p-6 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">
                    {hotel?.name || 'Hotel Details'}
                </h1>
                <button
                    onClick={handleEditHotel}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center shadow-sm"
                >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit Hotel
                </button>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-gray-500">
                <div
                    className="flex justify-between items-center cursor-pointer bg-gray-400 hover:bg-gray-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsContactInfoOpen(!isContactInfoOpen)}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        Contact Information
                    </h2>
                    <FontAwesomeIcon
                        icon={isContactInfoOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                    ${isContactInfoOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isContactInfoOpen && (
                    <div className="mt-4">
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Phone: </span>
                            <span className="text-gray-600">{hotel?.contact?.phone || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Booking Phone: </span>
                            <span className="text-gray-600">{hotel?.contact?.bookPhone || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Email: </span>
                            <span className="text-gray-600">
                                {hotel?.contact?.email ? (
                                    <a href={`mailto:${hotel.contact.email}`} className="text-blue-500 hover:underline">
                                        {hotel.contact.email}
                                    </a>
                                ) : (
                                    'Not available'
                                )}
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Website: </span>
                            <span className="text-gray-600">
                                {hotel?.contact?.website ? (
                                    <a href={hotel.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {hotel.contact.website}
                                    </a>
                                ) : (
                                    'Not available'
                                )}
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Address: </span>
                            <span className="text-gray-600">{hotel?.contact?.address || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Fax: </span>
                            <span className="text-gray-600">{hotel?.contact?.fax || 'Not available'}</span>
                        </div>
                    </div>
                )}
            </div>


            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-gray-500">
                <div
                    className="flex justify-between items-center cursor-pointer bg-gray-400 hover:bg-gray-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsLocationInfoOpen(!isLocationInfoOpen)}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        Location Information
                    </h2>
                    <FontAwesomeIcon
                        icon={isLocationInfoOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                    ${isLocationInfoOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isLocationInfoOpen && (
                    <div className="mt-4">
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">City: </span>
                            <span className="text-gray-600">{hotel?.location?.city || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Address: </span>
                            <span className="text-gray-600">{hotel?.location?.address || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Loaction on map: </span>
                            <span className="text-gray-600">
                                {hotel?.location?.latitudeLongitude ? (
                                    <a 
                                        href={`https://www.google.com/maps/search/${hotel.location.latitudeLongitude}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-500 hover:underline"
                                    >
                                        click me
                                    </a>
                                ) : 'Not available'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Distance from City Center (m): </span>
                            <span className="text-gray-600">{hotel?.location?.distanceFromCityCenter || 'Not available'}</span>
                        </div>
                    </div>
                )}
            </div>

             {/* General Information Section */}
             <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-gray-500">
                <div
                    className="flex justify-between items-center cursor-pointer bg-gray-400 hover:bg-gray-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsGeneralInfoOpen(!isGeneralInfoOpen)}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        General Information
                    </h2>
                    <FontAwesomeIcon
                        icon={isGeneralInfoOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                    ${isGeneralInfoOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isGeneralInfoOpen && (
                    <div className="mt-4">
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Name: </span>
                            <span className="text-gray-600">{hotel?.name || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Title: </span>
                            <span className="text-gray-600">{hotel?.title || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Type: </span>
                            <span className="text-gray-600">{hotel?.type || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Description: </span>
                            <span className="text-gray-600">{hotel?.description || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Rating: </span>
                            <span className="text-gray-600">{hotel?.rating || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Base Price: </span>
                            <span className="text-gray-600">{hotel?.basePrice || 'Not available'}</span>
                        </div>
                        <div className="flex items-center space-x-3 p-2 transition-colors">
                            <span className="font-medium text-gray-700">Rental Duration Type: </span>
                            <span className="text-gray-600">{hotel?.rental?.durationType || 'Not specified'}</span>
                        </div>
                    </div>
                )}
            </div>


            {/* Policies Section */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-yellow-500">
                <div
                    className="flex justify-between items-center cursor-pointer bg-gray-400 hover:bg-gray-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsPoliciesOpen(!isPoliciesOpen)}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        Policies
                    </h2>
                    <FontAwesomeIcon
                        icon={isPoliciesOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                    ${isPoliciesOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isPoliciesOpen && (
                    <div className="mt-4">
                        <div className="flex items-center">
                            <span className="font-semibold">Pets: </span>
                            <span className="ml-2">{hotel?.policies?.pets?.allowed ? 'Allowed' : 'Not Allowed'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold">Smoking: </span>
                            <span className="ml-2">{hotel?.policies?.smoking?.allowed ? 'Allowed' : 'Not Allowed'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold">Events: </span>
                            <span className="ml-2">{hotel?.policies?.events?.allowed ? 'Allowed' : 'Not Allowed'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold">Quiet Hours: </span>
                            <span className="ml-2">{hotel?.policies?.quietHours?.enforced ? `${hotel.policies.quietHours.from} - ${hotel.policies.quietHours.to}` : 'Not enforced'}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold">Chek In: </span>
                            <span className="ml-2">{hotel?.policies?.checkIn?.from } To {hotel?.policies?.checkIn?.to } </span>
                        </div>

                        <div className="flex items-center">
                            <span className="font-semibold">Chek Out: </span>
                            <span className="ml-2">{hotel?.policies?.checkOut?.from } To {hotel?.policies?.checkOut?.to } </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Proximity Information Section */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-gray-500">
                <div
                    className="flex justify-between items-center cursor-pointer bg-gray-400 hover:bg-gray-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsProximityInfoOpen(!isProximityInfoOpen)}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        Proximity Information
                    </h2>
                    <FontAwesomeIcon
                        icon={isProximityInfoOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                    ${isProximityInfoOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isProximityInfoOpen && (
                    <div className="mt-4">
                        {/* Nearby Places */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Nearby Places:</h3>
                            {hotel?.proximity?.nearbyPlaces?.length > 0 ? (
                                hotel.proximity.nearbyPlaces.map((place) => (
                                    <div key={place._id.$oid} className="flex items-center space-x-3 p-2 transition-colors">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-blue-900 w-5" />
                                        <span className="font-medium text-gray-700">{place.name}</span>
                                        <span className="text-gray-600">({place.distance}m away)</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600">No nearby places available.</div>
                            )}
                        </div>

                        {/* Restaurants */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Restaurants:</h3>
                            {hotel?.proximity?.restaurants?.length > 0 ? (
                                hotel.proximity.restaurants.map((restaurant, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-2 transition-colors">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-blue-900 w-5" />
                                        <span className="font-medium text-gray-700">{restaurant.name}</span>
                                        <span className="text-gray-600">({restaurant.distance}m away)</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600">No restaurants available.</div>
                            )}
                        </div>

                        {/* Public Transit */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Public Transit:</h3>
                            {hotel?.proximity?.publicTransit?.length > 0 ? (
                                hotel.proximity.publicTransit.map((transit, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-2 transition-colors">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-blue-900 w-5" />
                                        <span className="font-medium text-gray-700">{transit.name}</span>
                                        <span className="text-gray-600">({transit.distance}m away)</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600">No public transit available.</div>
                            )}
                        </div>

                        {/* Beaches */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Beaches:</h3>
                            {hotel?.proximity?.beaches?.length > 0 ? (
                                hotel.proximity.beaches.map((beach, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-2 transition-colors">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-blue-900 w-5" />
                                        <span className="font-medium text-gray-700">{beach.name}</span>
                                        <span className="text-gray-600">({beach.distance}m away)</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600">No beaches available.</div>
                            )}
                        </div>

                        {/* Airports */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Airports:</h3>
                            {hotel?.proximity?.airports?.length > 0 ? (
                                hotel.proximity.airports.map((airport, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-2 transition-colors">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-blue-900 w-5" />
                                        <span className="font-medium text-gray-700">{airport.name}</span>
                                        <span className="text-gray-600">({airport.distance}m away)</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600">No airports available.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

          

            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-lime-500">
                <div
                    className="flex justify-between items-center cursor-pointer bg-lime-400 hover:bg-lime-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsLanguagesOpen(!isLanguagesOpen)}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        Languages
                    </h2>
                    <FontAwesomeIcon
                        icon={isLanguagesOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                    ${isLanguagesOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isLanguagesOpen && (
                    <div className="flex flex-wrap gap-4 mt-6">
                        {hotel?.languages?.map((language, index) => (
                            <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                {language}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-lime-500">
                <div
                    className="flex justify-between items-center cursor-pointer bg-lime-400 hover:bg-lime-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsImagesOpen(!isImagesOpen)}
                >
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faImage} className="mr-3 text-black" />
                        Hotel Images
                    </h3>
                    <FontAwesomeIcon
                        icon={isImagesOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                  ${isImagesOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isImagesOpen && (
                    <div>
                        <ImgHotel hotelId={id} type={"hotel"} />
                    </div>
                )}
            </div>

            <div className="mb-6 bg-white p-6 rounded-xl shadow-xl border-y-2 border-indigo-500">
                <div
                    className="flex justify-between items-center cursor-pointer hover:bg-indigo-400 bg-indigo-400 p-2 rounded-lg transition-colors"
                    onClick={() => setIsRoomsOpen(!isRoomsOpen)}
                >
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faTable} className="mr-3 text-black" />
                        Rooms
                    </h2>
                    <FontAwesomeIcon
                        icon={isRoomsOpen ? faChevronUp : faChevronDown}
                        className={`text-black transform transition-transform duration-200 
                                  ${isRoomsOpen ? 'rotate-45' : 'rotate-90'}`}
                    />
                </div>
                {isRoomsOpen && (
                    <div className="mt-6">
                        <DataRoom
                            setRoomFormData={setRoomFormData}
                            setIsModalOpen={setIsModalOpen}
                            updateRooms={updateRooms}
                            hotelId={hotelId}
                            onEditRoom={handleEditRoom}
                        />
                    </div>
                )}
            </div>

            {/* Amenities Section */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-y-2 border-purple-300">
                <div className="flex justify-between items-center cursor-pointer bg-purple-500 hover:bg-purple-600 p-2 rounded-lg transition-colors" onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}>
                    <h2 className="text-xl font-semibold text-gray-800">Amenities</h2>
                    <FontAwesomeIcon icon={isAmenitiesOpen ? faChevronUp : faChevronDown} className="text-black transform transition-transform duration-200" />
                </div>
                {isAmenitiesOpen && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {Object.entries(hotel?.amenities || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                                {value ? 
                                    <FontAwesomeIcon icon={faCheck} className="mr-2 text-green-500" /> : 
                                    <FontAwesomeIcon icon={faTimes} className="mr-2 text-red-500" />
                                }
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    {isEditMode ? 'Edit Room' : 'Add New Room'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full 
                                             hover:bg-gray-100 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={isEditMode ? handleUpdate : handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-500" />
                                        Room Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={roomFormData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-green-500" />
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={roomFormData.price}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
                                        Max People
                                    </label>
                                    <input
                                        type="number"
                                        name="maxPeople"
                                        value={roomFormData.maxPeople}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <FontAwesomeIcon icon={faDoorOpen} className="mr-2 text-blue-500" />
                                        Room Numbers
                                    </label>
                                    <input
                                        type="text"
                                        name="roomNumber"
                                        value={roomFormData.roomNumber}
                                        onChange={handleInputChange}
                                        placeholder="101, 102, 103"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-orange-500" />
                                        Area (sqm)
                                    </label>
                                    <input
                                        type="number"
                                        name="area"
                                        value={roomFormData.area}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
                                        Description
                                    </label>
                                    <textarea
                                        name="desc"
                                        value={roomFormData.desc}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        rows="3"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Amenities Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    {roomAmenities.map((amenity) => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="amenities"
                                                value={amenity}
                                                checked={roomFormData.amenities.includes(amenity)}
                                                onChange={handleCheckboxChange}
                                                className="h-4 w-4 text-blue-900 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="text-sm text-gray-700">{amenity}</label>
                                        </div>
                                    ))}
                                </div>





                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg 
                     hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                     transition-colors duration-200 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    {isEditMode ? "Update Room" : "Add Room"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleHotel;