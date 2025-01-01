import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCity, faLocationDot, faMoneyBill, faBed, faBath, faPhone, faEnvelope, faCalendarDays, faRulerCombined, faBuilding, faParking, faPaw, faWifi, faSnowflake, faFire, faElevator, faUtensils, faWater, faBolt, faFireBurner, faGlobe, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { FormSection, InputField, SelectField, CheckboxField } from '../../../components/HouseRentals/FormSection';

// Add this new component for section headers
const SectionHeader = ({ icon, title }) => (
    <h3 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6 flex items-center">
        <FontAwesomeIcon icon={icon} className="mr-3" />
        {title}
    </h3>
);


export const FormSection = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6 flex items-center">
            <FontAwesomeIcon icon={icon} className="mr-3" />
            {title}
        </h3>
        {children}
    </div>
);

export const InputField = ({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export const SelectField = ({ label, name, value, onChange, options, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Select {label}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export const CheckboxField = ({ label, name, checked, onChange }) => (
    <label className="flex items-center space-x-3">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-blue-600"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
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
                    <FormSection icon={faHouse} title="Basic Property Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Property Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <SelectField
                                label="Property Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                options={[
                                    { value: "apartment", label: "Apartment" },
                                    { value: "villa", label: "Villa" },
                                    { value: "house", label: "House" },
                                    { value: "studio", label: "Studio" },
                                    { value: "duplex", label: "Duplex" },
                                    { value: "penthouse", label: "Penthouse" }
                                ]}
                                required
                            />
                            <InputField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                type="textarea"
                            />
                        </div>
                    </FormSection>

                    {/* Location Information */}
                    <FormSection icon={faLocationDot} title="Location Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="City"
                                name="location.city"
                                value={formData.location.city}
                                onChange={handleChange}
                                required
                            />
                            <InputField
                                label="Address"
                                name="location.address"
                                value={formData.location.address}
                                onChange={handleChange}
                                required
                            />
                            <InputField
                                label="Distance to Nearest School (km)"
                                name="locationDetails.distanceToSchool"
                                value={formData.locationDetails.distanceToSchool}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Supermarket (km)"
                                name="locationDetails.nearbyAmenities.groceryStores"
                                value={formData.locationDetails.nearbyAmenities.groceryStores}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Beach (km)"
                                name="locationDetails.distanceToBeach"
                                value={formData.locationDetails.distanceToBeach}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Cafes/Restaurants (km)"
                                name="locationDetails.nearbyAmenities.restaurants"
                                value={formData.locationDetails.nearbyAmenities.restaurants}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Mosque (km)"
                                name="locationDetails.landmarks.distanceToMosque"
                                value={formData.locationDetails.landmarks.distanceToMosque}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Souq (km)"
                                name="locationDetails.landmarks.distanceToSouq"
                                value={formData.locationDetails.landmarks.distanceToSouq}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Latitude"
                                name="location.latitude"
                                value={formData.location.latitude}
                                onChange={handleChange}
                                type="number"
                                step="0.000001"
                            />
                            <InputField
                                label="Longitude"
                                name="location.longitude"
                                value={formData.location.longitude}
                                onChange={handleChange}
                                type="number"
                                step="0.000001"
                            />
                            <InputField
                                label="Distance from City Center (km)"
                                name="location.distanceFromCityCenter"
                                value={formData.location.distanceFromCityCenter}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                        </div>
                    </FormSection>

                    {/* Contact Information */}
                    <FormSection icon={faPhone} title="Contact Information">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField
                                label="Phone Number"
                                name="contact.phone"
                                value={formData.contact.phone}
                                onChange={handleChange}
                                type="tel"
                                required
                            />
                            <InputField
                                label="Email"
                                name="contact.email"
                                value={formData.contact.email}
                                onChange={handleChange}
                                type="email"
                                required
                            />
                            <InputField
                                label="WhatsApp"
                                name="contact.whatsapp"
                                value={formData.contact.whatsapp}
                                onChange={handleChange}
                                type="tel"
                            />
                        </div>
                    </FormSection>

                    {/* Sale Information */}
                    <FormSection icon={faMoneyBill} title="Sale Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Price"
                                name="sale.price"
                                value={formData.sale.price}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <SelectField
                                label="Property Type"
                                name="sale.propertyType"
                                value={formData.sale.propertyType}
                                onChange={handleChange}
                                options={[
                                    { value: "residential", label: "Residential" },
                                    { value: "commercial", label: "Commercial" },
                                    { value: "land", label: "Land" }
                                ]}
                                required
                            />
                            <SelectField
                                label="Sale Type"
                                name="sale.saleType"
                                value={formData.sale.saleType}
                                onChange={handleChange}
                                options={[
                                    { value: "direct", label: "Direct Sale" },
                                    { value: "auction", label: "Auction" }
                                ]}
                            />
                            <SelectField
                                label="Payment Terms"
                                name="sale.paymentTerms"
                                value={formData.sale.paymentTerms}
                                onChange={handleChange}
                                options={[
                                    { value: "cash", label: "Cash" },
                                    { value: "mortgage", label: "Mortgage" },
                                    { value: "installments", label: "Installments" }
                                ]}
                            />
                            <InputField
                                label="Property Age (years)"
                                name="sale.propertyAge"
                                value={formData.sale.propertyAge}
                                onChange={handleChange}
                                type="number"
                            />
                            <InputField
                                label="Last Renovated"
                                name="sale.lastRenovated"
                                value={formData.sale.lastRenovated}
                                onChange={handleChange}
                                type="date"
                            />
                            <CheckboxField
                                label="Price Negotiable"
                                name="sale.negotiable"
                                checked={formData.sale.negotiable}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

                    {/* Property Details */}
                    <FormSection icon={faBuilding} title="Property Details">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField
                                label="Size (m²)"
                                name="details.size"
                                value={formData.details.size}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <InputField
                                label="Bedrooms"
                                name="details.bedrooms"
                                value={formData.details.bedrooms}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <InputField
                                label="Bathrooms"
                                name="details.bathrooms"
                                value={formData.details.bathrooms}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <InputField
                                label="Floor Number"
                                name="details.floor"
                                value={formData.details.floor}
                                onChange={handleChange}
                                type="number"
                            />
                            <InputField
                                label="Total Floors"
                                name="details.totalFloors"
                                value={formData.details.totalFloors}
                                onChange={handleChange}
                                type="number"
                            />
                            <InputField
                                label="Year Built"
                                name="details.yearBuilt"
                                value={formData.details.yearBuilt}
                                onChange={handleChange}
                                type="number"
                            />
                            <CheckboxField
                                label="Parking Available"
                                name="details.parking"
                                checked={formData.details.parking}
                                onChange={handleChange}
                            />
                            <CheckboxField
                                label="Pets Allowed"
                                name="details.petsAllowed"
                                checked={formData.details.petsAllowed}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

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
