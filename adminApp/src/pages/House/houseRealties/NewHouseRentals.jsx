import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCity, faLocationDot, faMoneyBill, faBed, faBath, faPhone, faEnvelope, faCalendarDays, faRulerCombined, faBuilding, faParking, faPaw, faWifi, faSnowflake, faFire, faElevator, faUtensils, faWater, faBolt, faFireBurner, faGlobe, faCheck, faTimes, faKitchenSet } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormSection, InputField, SelectField, CheckboxField } from '../../../components/ComponentInputs';
import { City, Neighborhood, Region } from "../../../components/Location";




function NewHouseRentals() {
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedNeighboorhd, setSelectedNeighboorhd] = useState("");


    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Fixed formData initialization with all nested objects
    const [formData, setFormData] = useState({
        propertyInfo: {
            name: "",
            type: "", // enum: ['apartment', 'villa', 'house', 'studio', 'duplex', 'penthouse']
            description: "",
            status: "available",
            featured: false
        },
        location: {
            region: "",
            city: "",
            neighborhood: "",
            coordinates: "",
            distanceFromCityCenter: "",
            nearbyPlaces: {  // Added this nested object
                school: "",
                supermarket: "",
                beach: "",
                restaurants: "",
                mosques: "",
                souq: ""
            }
        },
        contact: {
            phone: "",
            email: "",
            whatsapp: ""
        },
        rental: {
            price: "",
            propertyType: "",
            negotiable: false,
            propertyAge: "",
            lastRenovated: ""
        },
        specifications: {
            size: "",
            bedrooms: "",
            bathrooms: "",
            floor: "",
            totalFloors: "",
            yearBuilt: "",
            parking: false,
            petsAllowed: false
        },
        amenities: {
            balcony: false,
            terrace: false,
            elevator: false,
            view: "",
            kitchen: [],
            heating: "",
            airConditioning: {
                installed: false,
                units: ""
            },
            internet: false,
            soundproofing: false,
            thermalInsulation: false
        },
        security: {
            concierge: false,
            securityDoors: false,
            surveillanceSystem: false
        }
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested properties
        const updateNestedState = (path, value) => {
            const keys = path.split('.');
            setFormData(prev => {
                let newState = { ...prev };
                let current = newState;

                for (let i = 0; i < keys.length - 1; i++) {
                    current[keys[i]] = { ...current[keys[i]] };
                    current = current[keys[i]];
                }

                current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
                return newState;
            });
        };

        updateNestedState(name, value);
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                region: region
            }
        }));
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                city: city
            }
        }));
    };

    const handleNeighborhoodSelect = (neighborhood) => {
        setSelectedNeighboorhd(neighborhood);
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                neighborhood: neighborhood
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission started');
        console.log('Form data:', formData);
        
        try {
            console.log('Sending POST request to /api/house-sales');
            const response = await axios.post('/api/house-rentals', formData);
            console.log('Server response:', response.data);
            navigate('/houses-sales');
        } catch (err) {
            console.error('Error submitting form:', err);
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
                                name="propertyInfo.name"
                                value={formData.propertyInfo.name}
                                onChange={handleChange}
                                required
                            />
                            <SelectField
                                label="Property Type"
                                name="propertyInfo.type"
                                value={formData.propertyInfo.type}
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
                                name="propertyInfo.description"
                                value={formData.propertyInfo.description}
                                onChange={handleChange}
                                type="textarea"
                            />
                        </div>
                    </FormSection>

                    {/* Location Information */}
                    <FormSection icon={faLocationDot} title="Location Information">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Region 
                                onRegionSelect={handleRegionSelect} 
                                regionValue={selectedRegion} 
                                onCitySelect={handleCitySelect} 
                            />
                            <City 
                                region={selectedRegion} 
                                onCitySelect={handleCitySelect} 
                                cityValue={selectedCity} 
                                onNeighborhoodSelect={handleNeighborhoodSelect} 
                            />
                            <Neighborhood 
                                city={selectedCity} 
                                onNeighborhoodSelect={handleNeighborhoodSelect} 
                                neighborhoodValue={selectedNeighboorhd} 
                            />
                            
                            <InputField
                                label="Coordinates"
                                name="location.coordinates"
                                value={formData.location.coordinates}
                                onChange={handleChange}
                                placeholder="e.g., 25.2867° N, 51.5333° E"
                                type="text"
                            />
                            <InputField
                                label="Distance from City Center (km)"
                                name="location.distanceFromCityCenter"
                                value={formData.location.distanceFromCityCenter}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to School (km)"
                                name="location.nearbyPlaces.school"
                                value={formData.location.nearbyPlaces.school}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Supermarket (km)"
                                name="location.nearbyPlaces.supermarket"
                                value={formData.location.nearbyPlaces.supermarket}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Beach (km)"
                                name="location.nearbyPlaces.beach"
                                value={formData.location.nearbyPlaces.beach}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Restaurants (km)"
                                name="location.nearbyPlaces.restaurants"
                                value={formData.location.nearbyPlaces.restaurants}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Mosque (km)"
                                name="location.nearbyPlaces.mosques"
                                value={formData.location.nearbyPlaces.mosques}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                            <InputField
                                label="Distance to Souq (km)"
                                name="location.nearbyPlaces.souq"
                                value={formData.location.nearbyPlaces.souq}
                                onChange={handleChange}
                                type="number"
                                step="0.1"
                            />
                        </div>
                    </FormSection>

                    {/* Rental Information (previously Sale Information) */}
                    <FormSection icon={faMoneyBill} title="Rental Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Monthly Rent"
                                name="rental.price"
                                value={formData.rental.price}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <SelectField
                                label="Property Type"
                                name="rental.propertyType"
                                value={formData.rental.propertyType}
                                onChange={handleChange}
                                options={[
                                    { value: "residential", label: "Residential" },
                                    { value: "commercial", label: "Commercial" },
                                    { value: "land", label: "Land" }
                                ]}
                                required
                            />
                            <InputField
                                label="Property Age (years)"
                                name="rental.propertyAge"
                                value={formData.rental.propertyAge}
                                onChange={handleChange}
                                type="number"
                            />
                            <InputField
                                label="Last Renovated"
                                name="rental.lastRenovated"
                                value={formData.rental.lastRenovated}
                                onChange={handleChange}
                                type="date"
                            />
                            <CheckboxField
                                label="Price Negotiable"
                                name="rental.negotiable"
                                checked={formData.rental.negotiable}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

                    {/* Property Specifications (previously Property Details) */}
                    <FormSection icon={faBuilding} title="Property Specifications">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField
                                label="Size (m²)"
                                name="specifications.size"
                                value={formData.specifications.size}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <InputField
                                label="Bedrooms"
                                name="specifications.bedrooms"
                                value={formData.specifications.bedrooms}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <InputField
                                label="Bathrooms"
                                name="specifications.bathrooms"
                                value={formData.specifications.bathrooms}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                            <InputField
                                label="Floor Number"
                                name="specifications.floor"
                                value={formData.specifications.floor}
                                onChange={handleChange}
                                type="number"
                            />
                            <InputField
                                label="Total Floors"
                                name="specifications.totalFloors"
                                value={formData.specifications.totalFloors}
                                onChange={handleChange}
                                type="number"
                            />
                            <InputField
                                label="Year Built"
                                name="specifications.yearBuilt"
                                value={formData.specifications.yearBuilt}
                                onChange={handleChange}
                                type="number"
                            />
                            <CheckboxField
                                label="Parking Available"
                                name="specifications.parking"
                                checked={formData.specifications.parking}
                                onChange={handleChange}
                            />
                            <CheckboxField
                                label="Pets Allowed"
                                name="specifications.petsAllowed"
                                checked={formData.specifications.petsAllowed}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

                    {/* Amenities (previously Property Features) */}
                    <FormSection icon={faHouse} title="Amenities">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <CheckboxField
                                    label="Balcony"
                                    name="amenities.balcony"
                                    checked={formData.amenities.balcony}
                                    onChange={handleChange}
                                />
                                <CheckboxField
                                    label="Terrace"
                                    name="amenities.terrace"
                                    checked={formData.amenities.terrace}
                                    onChange={handleChange}
                                />
                                <CheckboxField
                                    label="Elevator"
                                    name="amenities.elevator"
                                    checked={formData.amenities.elevator}
                                    onChange={handleChange}
                                />
                            </div>

                            <SelectField
                                label="View"
                                name="amenities.view"
                                value={formData.amenities.view}
                                onChange={handleChange}
                                options={[
                                    { value: "", label: "Select View Type" },
                                    { value: "city", label: "City View" },
                                    { value: "sea", label: "Sea View" },
                                    { value: "garden", label: "Garden View" },
                                    { value: "mountain", label: "Mountain View" },
                                    { value: "street", label: "Street View" },
                                    { value: "park", label: "Park View" }
                                ]}
                            />

                            <SelectField
                                label="Heating Type"
                                name="amenities.heating"
                                value={formData.amenities.heating}
                                onChange={handleChange}
                                options={[
                                    { value: "", label: "Select Heating Type" },
                                    { value: "central", label: "Central Heating" },
                                    { value: "electric", label: "Electric Heating" },
                                    { value: "gas", label: "Gas Heating" },
                                    { value: "none", label: "No Heating" }
                                ]}
                            />

                            <div className="space-y-4">
                                <CheckboxField
                                    label="Internet Available"
                                    name="amenities.internet"
                                    checked={formData.amenities.internet}
                                    onChange={handleChange}
                                />
                                <CheckboxField
                                    label="Soundproofing"
                                    name="amenities.soundproofing"
                                    checked={formData.amenities.soundproofing}
                                    onChange={handleChange}
                                />
                                <CheckboxField
                                    label="Thermal Insulation"
                                    name="amenities.thermalInsulation"
                                    checked={formData.amenities.thermalInsulation}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Kitchen Amenities */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-6 flex items-center">
                                    <FontAwesomeIcon icon={faKitchenSet} className="mr-3" />
                                    Kitchen
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Refrigerator', 'Oven', 'Microwave', 'Dishwasher', 'Stove', 'Hood'].map((item) => (
                                        <CheckboxField
                                            key={item}
                                            label={item}
                                            name={`amenities.kitchen`}
                                            checked={formData.amenities.kitchen.includes(item)}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    amenities: {
                                                        ...prev.amenities,
                                                        kitchen: e.target.checked
                                                            ? [...prev.amenities.kitchen, item]
                                                            : prev.amenities.kitchen.filter(equip => equip !== item)
                                                    }
                                                }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Air Conditioning</h3>
                                <div className="flex flex-col gap-3">
                                    <CheckboxField
                                        label="Air Conditioning Installed"
                                        name="amenities.airConditioning.installed"
                                        checked={formData.amenities.airConditioning.installed}
                                        onChange={handleChange}
                                    />
                                    {formData.amenities.airConditioning.installed && (
                                        <InputField
                                            label="Number of AC Units"
                                            name="amenities.airConditioning.units"
                                            value={formData.amenities.airConditioning.units}
                                            onChange={handleChange}
                                            type="number"
                                            min="0"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Security Features */}
                    <FormSection icon={faBuilding} title="Security Features">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CheckboxField
                                label="Concierge Service"
                                name="security.concierge"
                                checked={formData.security.concierge}
                                onChange={handleChange}
                            />
                            <CheckboxField
                                label="Security Doors"
                                name="security.securityDoors"
                                checked={formData.security.securityDoors}
                                onChange={handleChange}
                            />
                            <CheckboxField
                                label="Surveillance System"
                                name="security.surveillanceSystem"
                                checked={formData.security.surveillanceSystem}
                                onChange={handleChange}
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
                            onClick={handleSubmit}
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

