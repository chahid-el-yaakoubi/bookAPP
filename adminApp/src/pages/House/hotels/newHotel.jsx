import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faCity, faLocationDot, faMoneyBill, faBed, faStar, faPhone, faEnvelope, faGlobe, faCalendarDays, faCouch } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { City, Neighborhood, Region } from "../../../components/Location";
import AmenitiesSection from "../../../components/amenities/AmenitiesSection";
import { amenityCategories, amenityTranslations } from "../../../components/amenities/amenitiesConfig";
import { AuthContext } from "../../context/AuthContect";
import useFetch from "../../../hooks/useFetch";

function NewHotel() {
    const { user } = useContext(AuthContext);
    const isA = user._id;

    const navigate = useNavigate();
    const { id } = useParams();

    const {data} = useFetch(`/api/hotels/find/${id}`);


    useEffect(() => {
        const checkAdmin = async () => {
            // Ensure data is not empty or undefined
            if (!data || Object.keys(data).length === 0) return;

            if (user?.adminHotes && !user?.adminUsers) {
                const isAdminMismatch = isA !== data?.isA;
                if (isAdminMismatch) {
                    navigate("/hotels");
                }
            }
        };

        checkAdmin();
    }, [user, data, navigate]);


    const [error, setError] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [showEnvironment, setShowEnvironment] = useState(false);
    const [environmentSections, setEnvironmentSections] = useState([
        { title: "NearbyPlaces", items: [] },
        { title: "RestaurantsCoffee", items: [] },
        { title: "NearbyBeaches", items: [] },
        { title: "PublicTransport", items: [] },
        { title: "NearbyAirports", items: [] },
    ]);
    const [hotelId, setHotelId] = useState(id || null);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedNeighboorhd, setSelectedNeighboorhd] = useState("");

    const [formData, setFormData] = useState({
        isA: isA,
        name: "",
        title: "",
        type: "",
        location: {
            region: "",
            city: "",
            neighborhood: "",
            latitudeLongitude: "",
            distanceFromCityCenter: "",
        },
        contact: {
            phone: "",
            bookPhone: "",
            email: "",
            website: "",
        },
        description: "",
        rating: 0,
        featured: false,
        pricing: {
            basePrice: "",
        },
        rental: {
            durationType: "",
            customDays: "",
            hasFurniture: false,
        },
        policies: {
            pets: {
                allowed: false
            },
            smoking: {
                allowed: false
            },
            events: {
                allowed: false
            },
            quietHours: {
                enforced: false,
                from: "",
                to: ""
            },
            checkIn: {
                from: "",
                to: ""
            },
            checkOut: {
                from: "",
                to: ""
            }
        },
        languages: ["English", "Arabic", "French"],
        amenities: {
            BasicAmenities: {
                wifi: false,
                parking: false,
                pool: false,
                restaurant: false,
                gym: false,
            },
            RoomFeatures: {
                privateBathroom: false,
                airConditioning: false,
                kitchen: false,
                flatScreenTV: false,
                familyRooms: false,
                washingMachine: false,
                sofa: false,
                desk: false,
                wardrobe: false,
                alarmClock: false,
                socketNearBed: false,
                sofaBed: false,
                clothesRack: false,
                dryingRack: false,
                tileMarbleFloor: false,
                privateEntrance: false,
                fan: false,
                iron: false,
                extraLongBeds: false,
                linens: false,
            },
            Bathroom: {
                shower: false,
                bath: false,
                bidet: false,
                hairdryer: false,
            },
            ParkingOptions: {
                privateParking: false,
                parkingGarage: false,
            },
            KitchenDining: {
                coffeemaker: false,
                oven: false,
                microwave: false,
                refrigerator: false,
                highChair: false,
                diningTable: false,
                toaster: false,
                stovetop: false,
                kitchenware: false,
                electricKettle: false,
                dishwasher: false,
            },
            OutdoorRecreation: {
                picnicArea: false,
                beachfront: false,
                garden: false,
                outdoorPool: false,
                poolView: false,
                beachChairs: false,
                outdoorFurniture: false,
                sunTerrace: false,
                balcony: false,
                patio: false,
                beachAccess: false,
            },
            ActivitiesEntertainment: {
                gamesRoom: false,
                liveMusic: false,
                bikeTours: false,
                walkingTours: false,
                horseRiding: false,
                cycling: false,
                hiking: false,
                windsurfing: false,
                tennis: false,
                billiards: false,
            },
            HotelServices: {
                conciergeService: false,
                currencyExchange: false,
                frontDesk24h: false,
                ironingService: false,
                housekeeping: false,
                drycleaning: false,
                laundry: false,
                airportShuttle: false,
                invoiceProvided: false,
                expressCheckInOut: false,
            },
            BuildingFacilities: {
                elevator: false,
                minimarket: false,
                beautyShop: false,
                smokingArea: false,
                soundproofRooms: false,
                meetingFacilities: false,
                sharedLounge: false,
            },
            SafetySecurity: {
                fireExtinguishers: false,
                security24h: false,
                keyCardAccess: false,
                cctvOutside: false,
                cctvCommonAreas: false,
                securityAlarm: false,
                smokeFree: false,
            },
            Wellness: {
                spa: false,
                steamRoom: false,
                bodyTreatments: false,
                beautyServices: false,
                hammam: false,
            },
        }
    });

    const handleTimeChange = (e, type) => {
        const { name, value } = e.target;
        const [parent, child, timeType] = name.split('.');
        setFormData(prev => {
            const currentTimes = prev[parent][child];
            const newTimes = { ...currentTimes, [timeType]: value };
            if (type === 'checkIn') {
                if (timeType === 'from' && newTimes.to && value >= newTimes.to) {
                    setError('Check-in start time must be before end time');
                    return prev;
                }
            } else if (type === 'checkOut') {
                if (timeType === 'from' && newTimes.to && value >= newTimes.to) {
                    setError('Check-out start time must be before end time');
                    return prev;
                }
            }
            setError(null);
            return {
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: newTimes
                }
            };
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('checkIn') || name.includes('checkOut')) {
            const timeType = name.includes('checkIn') ? 'checkIn' : 'checkOut';
            handleTimeChange(e, timeType);
            return;
        }
        if (name.startsWith('policies.')) {
            const [_, policy, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                policies: {
                    ...prev.policies,
                    [policy]: {
                        ...prev.policies[policy],
                        [field]: type === 'checkbox' ? checked : value
                    }
                }
            }));
            return;
        }
        if (name.startsWith('amenities.')) {
            const [category, amenityName] = name.split('.')[1].split('.');
            setFormData(prev => ({
                ...prev,
                amenities: {
                    ...prev.amenities,
                    [category]: {
                        ...prev.amenities[category],
                        [amenityName]: checked
                    }
                }
            }))
            return
        }
        if (name.includes('.')) {
            const [parent, child] = name.split('.')
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }))
        }
        if (name === 'rental.customDays') {
            setFormData(prev => ({
                ...prev,
                rental: {
                    ...prev.rental,
                    customDays: value ? String(value) : ""
                }
            }));
            return;
        }
    }

    const handleAddLanguage = () => {
        if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, selectedLanguage]
            }))
            setSelectedLanguage("")
        }
    }

    const handleRemoveLanguage = (languageToRemove) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(lang => lang !== languageToRemove)
        }))
    }

    const handleQuietHoursToggle = (e) => {
        const { checked } = e.target;
        setFormData(prev => ({
            ...prev,
            policies: {
                ...prev.policies,
                quietHours: {
                    ...prev.policies.quietHours,
                    enforced: checked,
                    from: checked ? (prev.policies.quietHours.from || "22:00") : "",
                    to: checked ? (prev.policies.quietHours.to || "07:00") : ""
                }
            }
        }));
    };

    const availableLanguages = [
        "Arabic",
        "English",
        "French",
        "Spanish",
        "German",
        "Italian",
        "Chinese",
        "Japanese",
        "Russian",
        "Turkish",
        "Hindi",
        "Portuguese",
        "Korean",
        "Dutch"
    ];

    useEffect(() => {
        if (hotelId) {
            const fetchHotelData = async () => {
                try {
                    const response = await axios.get(`/api/hotels/find/${hotelId}`);
                    setSelectedRegion(response.data.location?.region || "")
                    setSelectedCity(response.data.location?.city || "")
                    setSelectedNeighboorhd(response.data.location?.neighborhood || "")
                    setFormData({
                        isA: isA,
                        name: response.data.name || "",
                        title: response.data.title || "",
                        type: response.data.type || "",
                        location: {
                            region: selectedRegion || "",
                            city: selectedCity || "",
                            neighborhood: selectedNeighboorhd || "",
                            latitudeLongitude: response.data.location?.latitudeLongitude || "",
                            distanceFromCityCenter: response.data.location?.distanceFromCityCenter || "",
                        },
                        contact: {
                            phone: response.data.contact?.phone || "",
                            bookPhone: response.data.contact?.bookPhone || "",
                            email: response.data.contact?.email || "",
                            website: response.data.contact?.website || "",
                        },
                        description: response.data.description || "",
                        rating: response.data.rating || 0,
                        featured: response.data.featured || false,
                        pricing: {
                            basePrice: response.data.basePrice || "",
                        },
                        rental: {
                            durationType: response.data.rental?.durationType || "",
                            customDays: response.data.rental?.customDays || "",
                            hasFurniture: response.data.rental?.hasFurniture || false,
                        },
                        policies: {
                            pets: {
                                allowed: response.data.policies?.pets?.allowed || false
                            },
                            smoking: {
                                allowed: response.data.policies?.smoking?.allowed || false
                            },
                            events: {
                                allowed: response.data.policies?.events?.allowed || false
                            },
                            quietHours: {
                                enforced: response.data.policies?.quietHours?.enforced || false,
                                from: response.data.policies?.quietHours?.from || "22:00",
                                to: response.data.policies?.quietHours?.to || "07:00"
                            },
                            checkIn: {
                                from: response.data.policies?.checkIn?.from || "",
                                to: response.data.policies?.checkIn?.to || ""
                            },
                            checkOut: {
                                from: response.data.policies?.checkOut?.from || "",
                                to: response.data.policies?.checkOut?.to || ""
                            }
                        },
                        languages: response.data.languages || [],
                        amenities: response.data.amenities || {
                            BasicAmenities: {
                                wifi: false,
                                parking: false,
                                pool: false,
                                restaurant: false,
                                gym: false,
                            },
                            RoomFeatures: {
                                privateBathroom: false,
                                airConditioning: false,
                                kitchen: false,
                                flatScreenTV: false,
                                familyRooms: false,
                                washingMachine: false,
                                sofa: false,
                                desk: false,
                                wardrobe: false,
                                alarmClock: false,
                                socketNearBed: false,
                                sofaBed: false,
                                clothesRack: false,
                                dryingRack: false,
                                tileMarbleFloor: false,
                                privateEntrance: false,
                                fan: false,
                                iron: false,
                                extraLongBeds: false,
                                linens: false,
                            },
                            Bathroom: {
                                shower: false,
                                bath: false,
                                bidet: false,
                                hairdryer: false,
                            },
                            ParkingOptions: {
                                privateParking: false,
                                parkingGarage: false,
                            },
                            KitchenDining: {
                                coffeemaker: false,
                                oven: false,
                                microwave: false,
                                refrigerator: false,
                                highChair: false,
                                diningTable: false,
                                toaster: false,
                                stovetop: false,
                                kitchenware: false,
                                electricKettle: false,
                                dishwasher: false,
                            },
                            OutdoorRecreation: {
                                picnicArea: false,
                                beachfront: false,
                                garden: false,
                                outdoorPool: false,
                                poolView: false,
                                beachChairs: false,
                                outdoorFurniture: false,
                                sunTerrace: false,
                                balcony: false,
                                patio: false,
                                beachAccess: false,
                            },
                            ActivitiesEntertainment: {
                                gamesRoom: false,
                                liveMusic: false,
                                bikeTours: false,
                                walkingTours: false,
                                horseRiding: false,
                                cycling: false,
                                hiking: false,
                                windsurfing: false,
                                tennis: false,
                                billiards: false,
                            },
                            HotelServices: {
                                conciergeService: false,
                                currencyExchange: false,
                                frontDesk24h: false,
                                ironingService: false,
                                housekeeping: false,
                                drycleaning: false,
                                laundry: false,
                                airportShuttle: false,
                                invoiceProvided: false,
                                expressCheckInOut: false,
                            },
                            BuildingFacilities: {
                                elevator: false,
                                minimarket: false,
                                beautyShop: false,
                                smokingArea: false,
                                soundproofRooms: false,
                                meetingFacilities: false,
                                sharedLounge: false,
                            },
                            SafetySecurity: {
                                fireExtinguishers: false,
                                security24h: false,
                                keyCardAccess: false,
                                cctvOutside: false,
                                cctvCommonAreas: false,
                                securityAlarm: false,
                                smokeFree: false,
                            },
                            Wellness: {
                                spa: false,
                                steamRoom: false,
                                bodyTreatments: false,
                                beautyServices: false,
                                hammam: false,
                            },
                        }
                    });
                    if (response.data.proximity) {
                        setEnvironmentSections([
                            { 
                                title: "NearbyPlaces", 
                                items: response.data.proximity.nearbyPlaces.map(place => ({
                                    name: place.name,
                                    distance: place.distance
                                })) || []
                            },
                            { 
                                title: "RestaurantsCoffee", 
                                items: response.data.proximity.restaurants.map(rest => ({
                                    name: rest.name,
                                    distance: rest.distance
                                })) || []
                            },
                            { 
                                title: "NearbyBeaches", 
                                items: response.data.proximity.beaches.map(beach => ({
                                    name: beach.name,
                                    distance: beach.distance
                                })) || []
                            },
                            { 
                                title: "PublicTransport", 
                                items: response.data.proximity.publicTransit.map(transit => ({
                                    name: transit.name,
                                    distance: transit.distance
                                })) || []
                            },
                            { 
                                title: "NearbyAirports", 
                                items: response.data.proximity.airports.map(airport => ({
                                    name: airport.name,
                                    distance: airport.distance
                                })) || []
                            },
                        ]);
                    }
                } catch (error) {
                    setError('Error fetching hotel data');
                }
            };
            fetchHotelData();
        }
    }, [hotelId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hotelData = {
                isA: isA,
                name: formData.name,
                title: formData.title,
                type: formData.type,
                location: {
                    region: selectedRegion,
                    city: selectedCity,
                    neighborhood: selectedNeighboorhd,
                    latitudeLongitude: formData.location.latitudeLongitude,
                    distanceFromCityCenter: Number(formData.location.distanceFromCityCenter),
                },
                contact: {
                    phone: formData.contact.phone,
                    bookPhone: formData.contact.bookPhone,
                    website: formData.contact.website,
                    email: formData.contact.email,
                },
                description: formData.description,
                rating: Number(formData.rating),
                basePrice: Number(formData.pricing.basePrice),
                rental: {
                    durationType: formData.rental.durationType,
                    customDays: formData.rental.durationType === 'custom' ? Number(formData.rental.customDays) : undefined,
                    hasFurniture: formData.rental.durationType === 'month' ? formData.rental.hasFurniture : undefined,
                },
                policies: {
                    pets: { allowed: formData.policies.pets.allowed },
                    smoking: { allowed: formData.policies.smoking.allowed },
                    events: { allowed: formData.policies.events.allowed },
                    quietHours: {
                        enforced: formData.policies.quietHours.enforced,
                        from: formData.policies.quietHours.enforced ? formData.policies.quietHours.from : undefined,
                        to: formData.policies.quietHours.enforced ? formData.policies.quietHours.to : undefined,
                    },
                    checkIn: {
                        from: formData.policies.checkIn.from,
                        to: formData.policies.checkIn.to,
                    },
                    checkOut: {
                        from: formData.policies.checkOut.from,
                        to: formData.policies.checkOut.to,
                    },
                },
                languages: formData.languages,
                featured: formData.featured,
                photos: [],
                rooms: [],
                amenities: formData.amenities,
                proximity: {
                    nearbyPlaces: environmentSections[0].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    restaurants: environmentSections[1].                    items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    publicTransit: environmentSections[3].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    beaches: environmentSections[2].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    airports: environmentSections[4].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                },
            };

            if (hotelId) {
                await axios.put(`/api/hotels/${hotelId}`, hotelData);
            } else {
                await axios.post('/api/hotels', hotelData);
            }

            navigate('/hotels');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error processing request');
            console.error('Error processing request:', err);
        }
    };

    const toggleEnvironment = () => {
        setShowEnvironment(prev => !prev);
    };

    const addEnvironmentItem = (index) => {
        const newSections = [...environmentSections];
        newSections[index].items.push({ name: '', distance: '' });
        setEnvironmentSections(newSections);
    };

    const removeEnvironmentItem = (sectionIndex, itemIndex) => {
        const newSections = [...environmentSections];
        newSections[sectionIndex].items.splice(itemIndex, 1);
        setEnvironmentSections(newSections);
    };

    const handleEnvironmentChange = (sectionIndex, itemIndex, field, value) => {
        const newSections = [...environmentSections];
        if (field === 'title') {
            newSections[sectionIndex].items[itemIndex].name = value;
        } else {
            newSections[sectionIndex].items[itemIndex][field] = value;
        }
        setEnvironmentSections(newSections);
    };

    const customDaysValue = String(formData.rental.customDays).trim();

    const handleAmenityChange = (category, name, checked) => {
        setFormData(prev => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [category]: {
                    ...prev.amenities[category],
                    [name]: checked
                }
            }
        }));
    };

    const inputBaseClass = "block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";

    const getInputStateClass = (value) => 
      value && value.toString().trim() !== "" 
        ? "bg-blue-50 border-blue-200" 
        : "bg-gray-50 border-gray-300";

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="py-10">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-cyan-500">
                            <FontAwesomeIcon icon={faHotel} className="mr-2" />
                            Add New Property
                        </h1>
                        <Link to="/hotels" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            View All Properties
                        </Link>
                    </div>

                    <div className="space-y-6 p-12 bg-white">
                        <div className="space-y-4 grid gap-6 mb-6 md:grid-cols-3">
                            <div className="bg-white rounded-lg p-4 mt-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faHotel} className="mr-2" />
                                    Property Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Hilton Garden Inn"
                                    className={`${inputBaseClass} ${getInputStateClass(formData.name)}`}
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faHotel} className="mr-2" />
                                    Hotel Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Luxury Beach Resort & Spa"
                                    className={`${inputBaseClass} ${getInputStateClass(formData.title)}`}
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                                    Starting Price per Night
                                </label>
                                <input
                                    type="number"
                                    name="pricing.basePrice"
                                    value={formData.pricing.basePrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 100"
                                    className={`${inputBaseClass} ${getInputStateClass(formData.pricing.basePrice)}`}
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faBed} className="mr-2" />
                                    Property Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className={`${inputBaseClass} ${getInputStateClass(formData.type)}`}
                                    required
                                >
                                    <option value="">Select Property Type</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="duplex">Duplex</option>
                                    <option value="villa">Villa</option>
                                    <option value="studio">Studio</option>
                                    <option value="penthouse">Penthouse</option>
                                </select>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faStar} className="mr-2" />
                                    Hotel Rating
                                </label>
                                <div className="flex items-center justify-between gap-2 mt-2">
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        className={`${inputBaseClass} ${getInputStateClass(formData.rating)}`}
                                        required
                                    />
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FontAwesomeIcon
                                                key={star}
                                                icon={faStar}
                                                className={`text-xl ${star <= Math.round(formData.rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        (0-5 stars)
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 flex items-center justify-between w-full">
                                <div className="bg-white rounded-lg p-4">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                                        Rental Duration Type
                                    </label>
                                    <select
                                        name="rental.durationType"
                                        value={formData.rental.durationType}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} ${getInputStateClass(formData.rental.durationType)}`}
                                        required
                                    >
                                        <option value="">Select Duration Type</option>
                                        <option value="night">Per Night</option>
                                        <option value="month">Per Month</option>
                                        <option value="custom">Custom Days</option>
                                    </select>
                                </div>

                                {formData.rental.durationType === 'month' && (
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faCouch} className="text-gray-500" />
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="rental.hasFurniture"
                                                checked={formData.rental.hasFurniture}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-md mb-3 font-medium text-gray-700">
                                                {formData.rental.hasFurniture ? 'Furnished' : 'Unfurnished'}
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {formData.rental.durationType === 'custom' && (
                                    <div className="bg-white rounded-lg p-4">
                                        <label className="block text-md mb-3 font-medium text-gray-700">
                                            <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                                            Number of Days
                                        </label>
                                        <input
                                            type="number"
                                            name="rental.customDays"
                                            value={formData.rental.customDays}
                                            onChange={handleChange}
                                            min="1"
                                            className={`${inputBaseClass} ${getInputStateClass(formData.rental.customDays)}`}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <h4 className="text-3xl text-center bg-yellow-500 rounded-t-lg">Location</h4>
                        <div className="space-y-4 grid gap-6 mb-6 md:grid-cols-5 border-b-2 border-yellow-500 rounded-lg">
                            <Region onRegionSelect={setSelectedRegion} regionValue={selectedRegion} onCitySelect={setSelectedCity} />
                            <City region={selectedRegion} onCitySelect={setSelectedCity} cityValue={selectedCity} onNeighborhoodSelect={setSelectedNeighboorhd} />
                            <Neighborhood city={selectedCity} onNeighborhoodSelect={setSelectedNeighboorhd} neighborhoodValue={selectedNeighboorhd} />

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    Dis from Center (km)
                                </label>
                                <input
                                    type="number"
                                    name="location.distanceFromCityCenter"
                                    value={formData.location.distanceFromCityCenter}
                                    onChange={handleChange}
                                    placeholder="e.g. 2.5"
                                    className="block w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                                    Latitude/Longitude
                                </label>
                                <input
                                    type="text"
                                    name="location.latitudeLongitude"
                                    value={formData.location.latitudeLongitude}
                                    onChange={handleChange}
                                    placeholder="e.g. 12.3456, 78.9012"
                                    className="block w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <h4 className="text-3xl text-center bg-orange-500 rounded-t-lg">Contact</h4>
                        <div className="space-y-4 grid gap-6 mb-6 md:grid-cols-4 border-b-2 border-orange-500 rounded-lg">
                            <div className="bg-white rounded-lg p-4 mt-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="contact.phone"
                                    value={formData.contact.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +1234567890"
                                    className="block w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                    Booking Phone
                                </label>
                                <input
                                    type="tel"
                                    name="contact.bookPhone"
                                    value={formData.contact.bookPhone}
                                    onChange={handleChange}
                                    placeholder="e.g. +1234567890"
                                    className="block w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="contact.email"
                                    value={formData.contact.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="block w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                                    Website
                                </label>
                                <input
                                    type="text"
                                    name="contact.website"
                                    value={formData.contact.website}
                                    onChange={handleChange}
                                    placeholder="www.example.com"
                                    className="block w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    <FontAwesomeIcon icon={faHotel} className="mr-2" />
                                    Description
                                </label>
                                <textarea 
                                    value={formData?.description} 
                                    id="message" 
                                    rows="4" 
                                    name="description" 
                                    onChange={handleChange} 
                                    className={`${inputBaseClass} ${getInputStateClass(formData.description)} min-h-[120px] resize-y`}
                                    placeholder="Write your thoughts here..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    Property Policies
                                    <span className="block text-sm text-gray-500 mt-1" dir="rtl" lang="ar">
                                        سياسات العقار
                                    </span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Check-in Time Range</label>
                                        <div className="flex gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500">From</label>
                                                <input
                                                    type="time"
                                                    name="policies.checkIn.from"
                                                    value={formData.policies.checkIn.from}
                                                    onChange={handleChange}
                                                    className={`${inputBaseClass} ${getInputStateClass(formData.policies.checkIn.from)}`}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">To</label>
                                                <input
                                                    type="time"
                                                    name="policies.checkIn.to"
                                                    value={formData.policies.checkIn.to}
                                                    onChange={handleChange}
                                                    className={`${inputBaseClass} ${getInputStateClass(formData.policies.checkIn.to)}`}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {error && error.includes('Check-in') && (
                                            <p className="text-red-500 text-xs mt-1">{error}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Check-out Time Range</label>
                                        <div className="flex gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500">From</label>
                                                <input
                                                    type="time"
                                                    name="policies.checkOut.from"
                                                    value={formData.policies.checkOut.from}
                                                    onChange={handleChange}
                                                    className={`${inputBaseClass} ${getInputStateClass(formData.policies.checkOut.from)}`}
                                                    required                                                 />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">To</label>
                                                        <input
                                                            type="time"
                                                            name="policies.checkOut.to"
                                                            value={formData.policies.checkOut.to}
                                                            onChange={handleChange}
                                                            className={`${inputBaseClass} ${getInputStateClass(formData.policies.checkOut.to)}`}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                {error && error.includes('Check-out') && (
                                                    <p className="text-red-500 text-xs mt-1">{error}</p>
                                                )}
                                            </div>
                                        </div>
        
                                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Pets Policy</span>
                                                    <span className="text-sm text-gray-500" dir="rtl" lang="ar">سياسة الحيوانات الأليفة</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="policies.pets.allowed"
                                                        checked={formData.policies.pets.allowed || false}
                                                        onChange={handleChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {formData.policies.pets.allowed ? 'Allowed' : 'Not Allowed'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
        
                                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Smoking Policy</span>
                                                    <span className="text-sm text-gray-500" dir="rtl" lang="ar">قواعد التدخين</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="policies.smoking.allowed"
                                                        checked={formData.policies.smoking.allowed || false}
                                                        onChange={handleChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {formData.policies.smoking.allowed ? 'Allowed' : 'Not Allowed'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
        
                                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Events & Parties</span>
                                                    <span className="text-sm text-gray-500" dir="rtl" lang="ar">سياسة الحفلات والفعاليات</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="policies.events.allowed"
                                                        checked={formData.policies.events.allowed || false}
                                                        onChange={handleChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {formData.policies.events.allowed ? 'Allowed' : 'Not Allowed'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
        
                                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Quiet Hours</span>
                                                    <span className="text-sm text-gray-500" dir="rtl" lang="ar">قواعد الضوضاء وساعات الهدوء</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="policies.quietHours.enforced"
                                                        checked={formData.policies.quietHours.enforced}
                                                        onChange={handleQuietHoursToggle}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {formData.policies.quietHours.enforced ? 'Enforced' : 'Not Enforced'}
                                                    </span>
                                                </label>
                                            </div>
        
                                            {formData.policies.quietHours.enforced && (
                                                <div className="mt-3 animate-fade-in">
                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <label className="text-xs text-gray-500">From</label>
                                                            <input
                                                                type="time"
                                                                name="policies.quietHours.from"
                                                                value={formData.policies.quietHours.from}
                                                                onChange={handleChange}
                                                                className={`${inputBaseClass} ${getInputStateClass(formData.policies.quietHours.from)}`}
                                                                required={formData.policies.quietHours.enforced}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="text-xs text-gray-500">To</label>
                                                            <input
                                                                type="time"
                                                                name="policies.quietHours.to"
                                                                value={formData.policies.quietHours.to}
                                                                onChange={handleChange}
                                                                className={`${inputBaseClass} ${getInputStateClass(formData.policies.quietHours.to)}`}
                                                                required={formData.policies.quietHours.enforced}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        <span className="block">Quiet hours will be enforced during this time period</span>
                                                        <span className="block" dir="rtl" lang="ar">سيتم تطبيق ساعات الهدوء خلال هذه الفترة</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
        
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Feature this Property
                                    </label>
                                </div>
        
                                <div className="space-y-4 mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-700">Languages Spoken</h3>
                                    <div className="flex">
                                        <div className="flex gap-4 items-center flex-[1] p-6">
                                            <select
                                                value={selectedLanguage}
                                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                                className={`${inputBaseClass} ${getInputStateClass(selectedLanguage)}`}
                                            >
                                                <option value="">Select a language</option>
                                                {availableLanguages
                                                    .filter(lang => !formData.languages.includes(lang))
                                                    .map(lang => (
                                                        <option key={lang} value={lang}>{lang}</option>
                                                    ))
                                                }
                                            </select>
                                            <button
                                                type="button"
                                                onClick={handleAddLanguage}
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            >
                                                Add Language
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 flex-[1] p-6">
                                            {formData.languages.map(language => (
                                                <span
                                                    key={language}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                                                >
                                                    {language}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveLanguage(language)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
        
                                            <AmenitiesSection
                                    amenityCategories={amenityCategories}
                                    formData={formData}
                                    handleAmenityChange={handleAmenityChange}
                                    amenityTranslations={amenityTranslations}
                                />

                                <div className="flex items-center mb-4">
                                    <h3 className="mt-4 text-orange-500 text-xl font-bold">Environment</h3>
                                    <button
                                        type="button"
                                        onClick={toggleEnvironment}
                                        className="btn btn-secondary ms-5 mt-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
                                    >
                                        {showEnvironment ? 'Hide Environment' : 'Show Environment'}
                                    </button>
                                </div>

                                {showEnvironment && (
                                    <div id="Environment" className="bg-gray-100 p-4 rounded-lg shadow-md">
                                        {environmentSections.map((section, sectionIndex) => (
                                            <div key={sectionIndex} className="mb-4">
                                                <h5 className="font-bold text-yellow-500 text-lg">{section.title}</h5>
                                                <ul className="list-group">
                                                    {section.items.map((item, itemIndex) => (
                                                        <li className="list-group-item flex items-center justify-between bg-white p-2 rounded shadow mb-2" key={itemIndex}>
                                                            <input
                                                                type="text"
                                                                className={`${inputBaseClass} ${getInputStateClass(item.name)}`}
                                                                placeholder="Name"
                                                                value={item.name || ''}
                                                                onChange={(e) => handleEnvironmentChange(sectionIndex, itemIndex, 'name', e.target.value)}
                                                            />
                                                            <input
                                                                type="number"
                                                                className={`${inputBaseClass} ${getInputStateClass(item.distance)}`}
                                                                placeholder="Distance (km)"
                                                                min="0"
                                                                step="0.1"
                                                                value={item.distance || ''}
                                                                onChange={(e) => handleEnvironmentChange(sectionIndex, itemIndex, 'distance', e.target.value)}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
                                                                onClick={() => removeEnvironmentItem(sectionIndex, itemIndex)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                                    onClick={() => addEnvironmentItem(sectionIndex)}
                                                >
                                                    Add Item
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Create Property
                                    </button>
                                    <button
                                        type="reset"
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Reset Form
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }

        export default NewHotel;

        

