import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCity, faLocationDot, faMoneyBill, faBed, faBath, faPhone, faEnvelope, faCalendarDays, faRulerCombined, faBuilding, faParking, faPaw, faWifi, faSnowflake, faFire, faElevator, faUtensils, faWater, faBolt, faFireBurner, faGlobe, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Add this new component for section headers
const SectionHeader = ({ icon, title }) => (
    <h3 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6 flex items-center">
        <FontAwesomeIcon icon={icon} className="mr-3" />
        {title}
    </h3>
);

function NewHouseRentals() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Initial form state
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        location: {
            city: "",
            address: "",
            latitude: "",
            longitude: "",
            distanceFromCityCenter: "",
        },
        contact: {
            phone: "",
            email: "",
            whatsapp: "",
        },
        description: "",
        sale: {
            price: "",
            propertyType: "", // residential, commercial, land
            saleType: "", // direct sale, auction, etc.
            negotiable: false,
            paymentTerms: "", // cash, mortgage, installments
            titleDeedStatus: "", // clean, disputed, etc.
            propertyAge: "",
            lastRenovated: "",
        },
        details: {
            size: "",
            bedrooms: "",
            bathrooms: "",
            floor: "",
            totalFloors: "",
            yearBuilt: "",
            parking: false,
            petsAllowed: false
        },
        features: {
            balcony: {
                exists: false,
                size: "",
                view: ""
            },
            terrace: {
                exists: false,
                size: "",
                view: ""
            },
            kitchen: {
                type: "",
                equipment: []
            },
            bathroom: {
                count: "",
                features: []
            },
            heating: {
                type: ""
            },
            airConditioning: {
                installed: false,
                units: ""
            },
            internet: {
                available: false,
                type: "",
                speed: ""
            },
            soundproofing: false,
            thermalInsulation: false
        },
        proximity: {
            restaurants: {
                closest: "",
                walkingTime: ""
            },
            cafes: {
                closest: "",
                walkingTime: ""
            }
        },
        amenities: {
            basic: {
                wifi: false,
                airConditioning: false,
                heating: false,
                elevator: false,
                parking: false
            },
            kitchen: {
                refrigerator: false,
                microwave: false,
                stove: false,
                dishwasher: false,
                washingMachine: false
            },
            outdoor: {
                balcony: false,
                garden: false,
                terrace: false
            },
            security: {
                securitySystem: false,
                cctv: false,
                doorman: false
            }
        },
        utilities: {
            electricity: false,
            water: false,
            internet: false,
            gas: false
        },
        status: "available",
        featured: false,
        locationDetails: {
            distanceToSchool: "",
            schoolTransportPrice: "",
            nearestSchools: [],
            distanceToBeach: "",
            nearestBeaches: [],
            parkingDetails: {
                type: "", // "private", "public", "street"
                distance: "",
                pricePerMonth: "",
            },
            transportation: {
                busStopDistance: "",
                busLines: [],
                taxiStandDistance: "",
                averageTaxiFare: "",
            },
            nearbyAmenities: {
                groceryStores: "",
                restaurants: "",
                cafes: "",
                mosques: "",
                hospitals: "",
                pharmacies: "",
            },
            neighborhood: "", // Popular neighborhoods in Nador
            landmarks: {
                distanceToMosque: "",
                distanceToSouq: "",
                distanceToCornicheNador: "", // Distance to Nador's Corniche
                distanceToMarcheCentral: "", // Distance to Central Market
            },
            publicTransport: {
                grandTaxiStation: "",
                busStation: "",
                distanceToSpanishBorder: "", // Distance to Melilla border
            },
            schools: {
                arabicSchools: [],
                frenchSchools: [],
                spanishSchools: [], // Given proximity to Spain
                languageInstitutes: []
            }
        },
        propertyDetails: {
            constructionType: "", // Traditional Moroccan, Modern, etc.
            facadeDirection: "", // Important for sun exposure
            waterSystem: {
                hasWaterTank: false,
                tankCapacity: "",
                waterPressure: ""
            },
            securityFeatures: {
                hasConcierge: false,
                hasSecurityDoors: false,
                hasSurveillanceSystem: false
            }
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/house-sales', formData);
            navigate('/houses-sales');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating property listing');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        <FontAwesomeIcon icon={faHouse} className="mr-2" />
                        New Property Listing
                    </h1>
                    <Link to="/houses-sales" className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200">
                        Back to Listings
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <SectionHeader icon={faHouse} title="Basic Property Information" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="house">House</option>
                                    <option value="studio">Studio</option>
                                    <option value="duplex">Duplex</option>
                                    <option value="penthouse">Penthouse</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sale Price
                                </label>
                                <input
                                    type="number"
                                    name="sale.price"
                                    value={formData.sale.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Terms
                                </label>
                                <select
                                    name="sale.paymentTerms"
                                    value={formData.sale.paymentTerms}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Payment Terms</option>
                                    <option value="cash">Cash</option>
                                    <option value="mortgage">Mortgage</option>
                                    <option value="installments">Installments</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Age (Years)
                                </label>
                                <input
                                    type="number"
                                    name="sale.propertyAge"
                                    value={formData.sale.propertyAge}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title Deed Status
                                </label>
                                <select
                                    name="sale.titleDeedStatus"
                                    value={formData.sale.titleDeedStatus}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="clean">Clean Title</option>
                                    <option value="pending">Pending</option>
                                    <option value="disputed">Disputed</option>
                                </select>
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name="sale.negotiable"
                                        checked={formData.sale.negotiable}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <span>Price Negotiable</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <SectionHeader icon={faLocationDot} title="Location Details" />
                        <div className="space-y-6">
                            {/* Neighborhood Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Neighborhood
                                    </label>
                                    <select
                                        name="locationDetails.neighborhood"
                                        value={formData.locationDetails.neighborhood}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Neighborhood</option>
                                        <option value="lari">Lari</option>
                                        <option value="ouladMimoun">Oulad Mimoun</option>
                                        <option value="laroui">Laroui</option>
                                        <option value="centerVille">Centre Ville</option>
                                        <option value="corniche">Corniche</option>
                                        <option value="alMatar">Al Matar</option>
                                        <option value="beniEnsar">Beni Ensar</option>
                                        <option value="ihaddaden">Ihaddaden</option>
                                    </select>
                                </div>
                            </div>

                            {/* Landmarks */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4">Key Landmarks</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <input
                                        type="text"
                                        name="locationDetails.landmarks.distanceToMosque"
                                        placeholder="Distance to Mosque"
                                        className="w-full p-2 border rounded"
                                        onChange={handleChange}
                                        value={formData.locationDetails.landmarks.distanceToMosque}
                                    />
                                    <input
                                        type="text"
                                        name="locationDetails.landmarks.distanceToSouq"
                                        placeholder="Distance to Souq"
                                        className="w-full p-2 border rounded"
                                        onChange={handleChange}
                                        value={formData.locationDetails.landmarks.distanceToSouq}
                                    />
                                    <input
                                        type="text"
                                        name="locationDetails.landmarks.distanceToCornicheNador"
                                        placeholder="Distance to Corniche"
                                        className="w-full p-2 border rounded"
                                        onChange={handleChange}
                                        value={formData.locationDetails.landmarks.distanceToCornicheNador}
                                    />
                                    <input
                                        type="text"
                                        name="locationDetails.landmarks.distanceToMarcheCentral"
                                        placeholder="Distance to Central Market"
                                        className="w-full p-2 border rounded"
                                        onChange={handleChange}
                                        value={formData.locationDetails.landmarks.distanceToMarcheCentral}
                                    />
                                </div>
                            </div>

                            {/* Transportation */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4">Transportation</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        name="locationDetails.publicTransport.distanceToSpanishBorder"
                                        placeholder="Distance to Melilla Border"
                                        className="w-full p-2 border rounded"
                                        onChange={handleChange}
                                        value={formData.locationDetails.publicTransport.distanceToSpanishBorder}
                                    />
                                    <input
                                        type="text"
                                        name="locationDetails.publicTransport.grandTaxiStation"
                                        placeholder="Distance to Grand Taxi Station"
                                        className="w-full p-2 border rounded"
                                        onChange={handleChange}
                                        value={formData.locationDetails.publicTransport.grandTaxiStation}
                                    />
                                    <input
                                        type="text"
                                        name="locationDetails.publicTransport.busStation"
                                        placeholder="Distance to Bus Station"
                                        className="w-full p-2 border rounded"
                                        onChange={handleChange}
                                        value={formData.locationDetails.publicTransport.busStation}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Features */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <SectionHeader icon={faBuilding} title="Property Features" />
                        <div className="space-y-6">
                            {/* Construction Details */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4">Construction Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        name="propertyDetails.constructionType"
                                        value={formData.propertyDetails.constructionType}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Construction Type</option>
                                        <option value="traditional">Traditional Moroccan</option>
                                        <option value="modern">Modern</option>
                                        <option value="contemporary">Contemporary</option>
                                    </select>
                                    <select
                                        name="propertyDetails.facadeDirection"
                                        value={formData.propertyDetails.facadeDirection}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Facade Direction</option>
                                        <option value="north">North</option>
                                        <option value="south">South</option>
                                        <option value="east">East</option>
                                        <option value="west">West</option>
                                    </select>
                                </div>
                            </div>

                            {/* Water System */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4">Water System</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="propertyDetails.waterSystem.hasWaterTank"
                                            checked={formData.propertyDetails.waterSystem.hasWaterTank}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span>Water Tank</span>
                                    </label>
                                    {formData.propertyDetails.waterSystem.hasWaterTank && (
                                        <>
                                            <input
                                                type="text"
                                                name="propertyDetails.waterSystem.tankCapacity"
                                                placeholder="Tank Capacity (L)"
                                                className="w-full p-2 border rounded"
                                                onChange={handleChange}
                                                value={formData.propertyDetails.waterSystem.tankCapacity}
                                            />
                                            <input
                                                type="text"
                                                name="propertyDetails.waterSystem.waterPressure"
                                                placeholder="Water Pressure"
                                                className="w-full p-2 border rounded"
                                                onChange={handleChange}
                                                value={formData.propertyDetails.waterSystem.waterPressure}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Security Features */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4">Security Features</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="propertyDetails.securityFeatures.hasConcierge"
                                            checked={formData.propertyDetails.securityFeatures.hasConcierge}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span>Concierge</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="propertyDetails.securityFeatures.hasSecurityDoors"
                                            checked={formData.propertyDetails.securityFeatures.hasSecurityDoors}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span>Security Doors</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="propertyDetails.securityFeatures.hasSurveillanceSystem"
                                            checked={formData.propertyDetails.securityFeatures.hasSurveillanceSystem}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span>Surveillance System</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/houseRentals')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            List Property for Rent
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewHouseRentals;
