import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormSection, InputField, SelectField, CheckboxField } from "../../../components/ComponentInputs";
import { City, Neighborhood, Region } from "../../../components/Location";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContect";
import useFetch from "../../../hooks/useFetch";

const NewCar = () => {

    const { user} = React.useContext(AuthContext);
    const isA = user._id
    const navigate = useNavigate();

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedNeighborhood, setSelectedNeighborhood] = useState("");

    const { id } = useParams();

    const { data } = useFetch(`/api/cars/find/${id}`);

    const region = data.location?.region;
    const city = data.location?.city;
    const neighborhood = data.location?.neighborhood;

    const [formData, setFormData] = useState({
        isA: isA,

        carMake: "", // e.g., Toyota
        carModel: "", // e.g., Corolla
        ownerName: "", // Name of the car owner
        contactNumber: "", // Owner's contact number
        email: "", // Owner's email address
        location: {
            region: "", // Selected region
            city: "", // Selected city
            neighborhood: "", // Selected neighborhood
            coordinates: "", // GPS coordinates, optional
        },
        type: "", // e.g., Sedan, SUV, Hatchback
        price: "", // Rental price (e.g., per day)
        mileage: "", // Car's mileage (e.g., 20,000 km)
        year: "", // Year of manufacture
        fuel: {
            type: "", // e.g., Petrol, Diesel, Electric
            policy: "", // e.g., Full-to-Full, Prepaid
        },
        amenities: {
            hasAirConditioning: false,
            hasParkingSensors: false,
            hasBluetooth: false,
            hasNavigation: false,
            hasHeatedSeats: false,
            hasSunroof: false,
            hasChildSeats: false,
        },
        // insurance: {
        //     policyNumber: "", // Insurance policy number
        //     coverageType: "", // e.g., Full Coverage, Liability Only
        //     expiryDate: "", // Insurance expiry date
        // },
        rentalTerms: {
            minimumPeriod: "", // Minimum rental period in days
            maximumMileage: "", // Maximum mileage allowed
            lateReturnFee: "", // Fee for late returns
        },
        status: "Available", // e.g., Available, Rented, Under Maintenance


        registration: {
            plateNumber: "", // Vehicle registration number
            registrationState: "", // Registration state
        },
        description: "", // Additional details about the car
    });

    useEffect(() => {
        if (data) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...data,
            }));

            setSelectedRegion(region);
            setSelectedCity(city);
            setSelectedNeighborhood(neighborhood);
        }
    }, [data]);

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                region: region,
            },
        }));
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                city: city,
            },
        }));
    };

    const handleNeighborhoodSelect = (neighborhood) => {
        setSelectedNeighborhood(neighborhood);
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                neighborhood: neighborhood,
            },
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            const [section, key] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: checked,
                },
            }));
        } else if (name.includes(".")) {
            const keys = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (isSubmitting) return;
        setIsSubmitting(true);
        setErrorMessage(""); // Reset error message

        const requiredFields = ["carMake", "carModel", "ownerName", "contactNumber", "email", "type", "price", "mileage", "year"];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setErrorMessage(`Please fill out the required field: ${field}`);
                setIsSubmitting(false);
                return;
            }
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            setIsSubmitting(false);
            return;
        }

        const price = parseFloat(formData.price);
        if (price <= 0) {
            setErrorMessage("Price should be a positive number.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (id) {
                const response = await axios.put(`/api/cars/${id}`, formData);
                alert("Car updated successfully!");
                console.log(response.data);
                navigate("/cars");
            } else {
                const response = await axios.post("/api/cars", formData);
                alert("Car added successfully!");
                console.log(response.data);
                navigate("/cars");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to add/update car.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
            <form onSubmit={handleSubmit} className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg border border-gray-300">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{id ? "Update" : "Add New"} Car</h2>
                {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

                {/* Car Details Section */}
                <FormSection title="Car Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField
                            label="Car Make"
                            name="carMake"
                            value={formData.carMake}
                            onChange={handleChange}
                            required
                            options={[
                                { value: "Audi", label: "Audi" },
                                { value: "BMW", label: "BMW" },
                                { value: "Chevrolet", label: "Chevrolet" },
                                { value: "Citroën", label: "Citroën" },
                                { value: "Dacia", label: "Dacia" },
                                { value: "Fiat", label: "Fiat" },
                                { value: "Ford", label: "Ford" },
                                { value: "Honda", label: "Honda" },
                                { value: "Hyundai", label: "Hyundai" },
                                { value: "Jeep", label: "Jeep" },
                                { value: "Kia", label: "Kia" },
                                { value: "Land Rover", label: "Land Rover" },
                                { value: "Mazda", label: "Mazda" },
                                { value: "Mercedes-Benz", label: "Mercedes-Benz" },
                                { value: "Mitsubishi", label: "Mitsubishi" },
                                { value: "Nissan", label: "Nissan" },
                                { value: "Opel", label: "Opel" },
                                { value: "Peugeot", label: "Peugeot" },
                                { value: "Renault", label: "Renault" },
                                { value: "Subaru", label: "Subaru" },
                                { value: "Suzuki", label: "Suzuki" },
                                { value: "Toyota", label: "Toyota" },
                                { value: "Volkswagen", label: "Volkswagen" },
                                { value: "Volvo", label: "Volvo" }
                            ]}

                        />
                        <InputField label="Car Model" name="carModel" value={formData.carModel} onChange={handleChange} required />
                        <SelectField
                            label="Fuel Type"
                            name="fuel.type"
                            value={formData.fuel.type}
                            onChange={handleChange}
                            required
                            options={[
                                { value: "petrol", label: "Petrol" },
                                { value: "diesel", label: "Diesel" },
                                { value: "electric", label: "Electric" },
                                { value: "hybrid", label: "Hybrid" },
                            ]}
                        />
                        <SelectField
                            label="Fuel Policy"
                            name="fuel.policy"
                            value={formData.fuel.policy}
                            onChange={handleChange}
                            required
                            options={[
                                { value: "full-to-full", label: "Full-to-Full" },
                                { value: "prepaid", label: "Prepaid" },
                                { value: "empty-to-empty", label: "Empty-to-Empty" },
                            ]}
                        />
                        <InputField label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
                        <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required type="tel" />
                        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
                    </div>
                </FormSection>

                {/* Address Section */}
                <FormSection title="Address">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            neighborhoodValue={selectedNeighborhood}
                        />

                        <InputField
                            label="Coordinates"
                            name="location.coordinates"
                            value={formData.location.coordinates}
                            onChange={handleChange}
                            placeholder="e.g., 25.2867° N, 51.5333° E"
                            type="text"
                        />
                    </div>
                </FormSection>

                {/* Car Type and Pricing Section */}
                <FormSection title="Car Type & Pricing">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            options={[
                                { value: "SUV", label: "SUV (الرياضة متعددة الاستخدامات)" },
                                { value: "Sedan", label: "Sedan (سيارة عائلية بأربعة أبواب)" },
                                { value: "Hatchback", label: "Hatchback (سيارة مدمجة مع باب خلفي)" },
                                { value: "Crossover", label: "Crossover (مزيج بين SUV وسيدان)" },
                                { value: "Coupe", label: "Coupe (سيارة رياضية بأبواب قليلة)" },
                                { value: "Convertible", label: "Convertible (سيارة مكشوفة مع سقف قابل للتحريك)" },
                                { value: "Wagon", label: "Wagon (سيارة مع صندوق خلفي طويل)" },
                                { value: "Minivan", label: "Minivan (ميكروباص عائلي)" },
                                { value: "Pickup", label: "Pickup (بيك أب لنقل البضائع)" },
                                { value: "Electric", label: "Electric (سيارة كهربائية)" },
                                { value: "Hybrid", label: "Hybrid (سيارة هجينة)" },
                                { value: "Luxury", label: "Luxury (سيارة فاخرة)" },
                                { value: "Sports", label: "Sports (سيارة رياضية)" },
                                { value: "Van", label: "Van (فان لنقل الأشخاص أو البضائع)" },
                                { value: "Truck", label: "Truck (شاحنة لنقل البضائع الثقيلة)" },
                                { value: "Microcar", label: "Microcar (سيارة صغيرة للمدينة)" }

                            ]}
                        />
                        <InputField label="Price" name="price" value={formData.price} onChange={handleChange} required type="number" />
                        <InputField label="Mileage" name="mileage" value={formData.mileage} onChange={handleChange} required type="number" />
                        <InputField label="Year" name="year" value={formData.year} onChange={handleChange} required type="number" />
                    </div>
                </FormSection>

                {/* Amenities Section */}
                <FormSection title="Amenities">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CheckboxField
                            label="Air Conditioning"
                            name="amenities.hasAirConditioning"
                            checked={formData.amenities.hasAirConditioning}
                            onChange={handleChange}
                        />
                        <CheckboxField
                            label="Parking Sensors"
                            name="amenities.hasParkingSensors"
                            checked={formData.amenities.hasParkingSensors}
                            onChange={handleChange}
                        />
                        <CheckboxField
                            label="Bluetooth"
                            name="amenities.hasBluetooth"
                            checked={formData.amenities.hasBluetooth}
                            onChange={handleChange}
                        />
                        <CheckboxField
                            label="Navigation"
                            name="amenities.hasNavigation"
                            checked={formData.amenities.hasNavigation}
                            onChange={handleChange}
                        />
                        <CheckboxField
                            label="Heated Seats"
                            name="amenities.hasHeatedSeats"
                            checked={formData.amenities.hasHeatedSeats}
                            onChange={handleChange}
                        />
                        <CheckboxField
                            label="Sunroof"
                            name="amenities.hasSunroof"
                            checked={formData.amenities.hasSunroof}
                            onChange={handleChange}
                        />
                        <CheckboxField
                            label="Child Seats"
                            name="amenities.hasChildSeats"
                            checked={formData.amenities.hasChildSeats}
                            onChange={handleChange}
                        />
                    </div>
                </FormSection>

                {/* Insurance Section */}
                {/* <FormSection title="Insurance">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Insurance Policy Number"
                            name="insurance.policyNumber"
                            value={formData.insurance.policyNumber}
                            onChange={handleChange}
                            type="text"
                        />
                        <InputField
                            label="Coverage Type"
                            name="insurance.coverageType"
                            value={formData.insurance.coverageType}
                            onChange={handleChange}
                            type="text"
                        />
                        <InputField
                            label="Insurance Expiry Date"
                            name="insurance.expiryDate"
                            value={formData.insurance.expiryDate}
                            onChange={handleChange}
                            type="date"
                        />
                    </div>
                </FormSection> */}

                {/* Rental Terms Section */}
                <FormSection title="Rental Terms">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Minimum Rental Period (days)"
                            name="rentalTerms.minimumPeriod"
                            value={formData.rentalTerms.minimumPeriod}
                            onChange={handleChange}
                            type="number"
                        />
                        <InputField
                            label="Maximum Mileage Allowed"
                            name="rentalTerms.maximumMileage"
                            value={formData.rentalTerms.maximumMileage}
                            onChange={handleChange}
                            type="number"
                        />
                        <InputField
                            label="Late Return Fee"
                            name="rentalTerms.lateReturnFee"
                            value={formData.rentalTerms.lateReturnFee}
                            onChange={handleChange}
                            type="number"
                        />
                    </div>
                </FormSection>




                {/* Registration Section */}
                <FormSection title="Registration Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Registration Plate Number"
                            name="registration.plateNumber"
                            value={formData.registration.plateNumber}
                            onChange={handleChange}
                            required
                            type="text"
                        />
                        <SelectField
                            label="Registration registrationState"
                            name="registration.registrationState"
                            value={formData.registration.registrationState}
                            onChange={handleChange}
                            required
                            options={[
                                { label: "Rabat", value: "RAB" },
                                { label: "Casablanca", value: "CAS" },
                                { label: "Marrakech", value: "MRC" },
                                { label: "Fes", value: "FEZ" },
                                { label: "Tangier", value: "TNG" },
                                { label: "Agadir", value: "AGD" },
                                { label: "Meknes", value: "MEK" },
                                { label: "Oujda", value: "OUD" },
                                { label: "Kenitra", value: "KEN" },
                                { label: "Sale", value: "SAL" },
                                { label: "Tetouan", value: "TET" },
                                { label: "Beni Mellal", value: "BEN" },
                                { label: "El Jadida", value: "EJA" },
                                { label: "Nador", value: "NAD" },
                                { label: "Khenifra", value: "KHE" },
                                { label: "Ifrane", value: "IFR" },
                                { label: "Dakhla", value: "DAK" },
                                { label: "Taza", value: "TAZ" },
                                { label: "Essaouira", value: "ESS" },
                                { label: "Safi", value: "SAF" },
                                { label: "Larache", value: "LAR" },
                                { label: "Tiznit", value: "TIZ" },
                                { label: "Tata", value: "TAT" },
                                { label: "Berkane", value: "BER" },
                                { label: "Military", value: "MIL" },
                                { label: "Diplomatic", value: "CD" }
                            ]}

                        />
                    </div>
                </FormSection>

                {/* Car Description Section */}
                <FormSection title="Car Description">
                    <div className="grid grid-cols-1 gap-6">

                        <InputField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            type="textarea"
                            placeholder="Enter any additional details about the car"

                        />
                    </div>
                </FormSection>

                <div className="text-center mt-8">
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : id ? "Update Car" : "Add Car"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewCar;
