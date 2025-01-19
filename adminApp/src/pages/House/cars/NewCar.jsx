import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FormSection, InputField, SelectField, CheckboxField } from "../../../components/ComponentInputs";
import { City, Neighborhood, Region } from "../../../components/Location";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContect";
import useFetch from "../../../hooks/useFetch";

const NewCar = () => {

    const { user } = useContext(AuthContext);
    const isA = user.username
    const navigate = useNavigate();

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedNeighborhood, setSelectedNeighborhood] = useState("");

    const { id } = useParams();

    const { data } = useFetch(`/api/cars/find/${id}`);

    useEffect(() => {
        const checkAdmin = async () => {
            // Ensure data is not empty or undefined
            if (!data || Object.keys(data).length === 0) return;

            if (user?.adminCars && !user?.adminUsers) {
                const isAdminMismatch = user.username !== data?.isA;
                if (isAdminMismatch) {
                    navigate("/cars");
                }
            }
        };

        checkAdmin();
    }, [user, data, navigate]);

    const region = data.location?.region;
    const city = data.location?.city;
    const neighborhood = data.location?.neighborhood;

    const [formData, setFormData] = useState({
        isA: isA,
        carDetails: {
            carMake: "", // e.g., Toyota
            carModel: "", // e.g., Corolla
        },
        numberplaces: null,
        autoManual: "", // e.g., Automatic, Manual
        location: {
            region: "", // Selected region
            city: "", // Selected city
            neighborhood: "", // Selected neighborhood
            coordinates: "", // GPS coordinates, optional
        },
        type: "", // e.g., Sedan, SUV, Hatchback
        price: "", // Rental price (e.g., per day)
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
        plateNumber: "", // Vehicle registration number
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

        const requiredFields = ["price", "numberplaces", "autoManual", "type"];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setErrorMessage(`Please fill out the required field: ${field}`);
                setIsSubmitting(false);
                return;
            }
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
                            name="carDetails.carMake"
                            value={formData.carDetails.carMake}
                            onChange={handleChange}
                            required
                            options={[
                                { value: "Acura", label: "Acura" },
                                { value: "Alfa Romeo", label: "Alfa Romeo" },
                                { value: "Aston Martin", label: "Aston Martin" },
                                { value: "Audi", label: "Audi" },
                                { value: "Bentley", label: "Bentley" },
                                { value: "BMW", label: "BMW" },
                                { value: "Bugatti", label: "Bugatti" },
                                { value: "Buick", label: "Buick" },
                                { value: "Cadillac", label: "Cadillac" },
                                { value: "Chevrolet", label: "Chevrolet" },
                                { value: "Chrysler", label: "Chrysler" },
                                { value: "Citroën", label: "Citroën" },
                                { value: "Dacia", label: "Dacia" },
                                { value: "Daewoo", label: "Daewoo" },
                                { value: "Daihatsu", label: "Daihatsu" },
                                { value: "Dodge", label: "Dodge" },
                                { value: "Ferrari", label: "Ferrari" },
                                { value: "Fiat", label: "Fiat" },
                                { value: "Ford", label: "Ford" },
                                { value: "Genesis", label: "Genesis" },
                                { value: "GMC", label: "GMC" },
                                { value: "Honda", label: "Honda" },
                                { value: "Hyundai", label: "Hyundai" },
                                { value: "Infiniti", label: "Infiniti" },
                                { value: "Isuzu", label: "Isuzu" },
                                { value: "Jaguar", label: "Jaguar" },
                                { value: "Jeep", label: "Jeep" },
                                { value: "Kia", label: "Kia" },
                                { value: "Koenigsegg", label: "Koenigsegg" },
                                { value: "Lamborghini", label: "Lamborghini" },
                                { value: "Land Rover", label: "Land Rover" },
                                { value: "Lexus", label: "Lexus" },
                                { value: "Lincoln", label: "Lincoln" },
                                { value: "Lotus", label: "Lotus" },
                                { value: "Maserati", label: "Maserati" },
                                { value: "Mazda", label: "Mazda" },
                                { value: "McLaren", label: "McLaren" },
                                { value: "Mercedes-Benz", label: "Mercedes-Benz" },
                                { value: "Mini", label: "Mini" },
                                { value: "Mitsubishi", label: "Mitsubishi" },
                                { value: "Nissan", label: "Nissan" },
                                { value: "Opel", label: "Opel" },
                                { value: "Pagani", label: "Pagani" },
                                { value: "Peugeot", label: "Peugeot" },
                                { value: "Porsche", label: "Porsche" },
                                { value: "Ram", label: "Ram" },
                                { value: "Renault", label: "Renault" },
                                { value: "Rolls-Royce", label: "Rolls-Royce" },
                                { value: "Saab", label: "Saab" },
                                { value: "Seat", label: "Seat" },
                                { value: "Skoda", label: "Skoda" },
                                { value: "Smart", label: "Smart" },
                                { value: "Subaru", label: "Subaru" },
                                { value: "Suzuki", label: "Suzuki" },
                                { value: "Tata", label: "Tata" },
                                { value: "Tesla", label: "Tesla" },
                                { value: "Toyota", label: "Toyota" },
                                { value: "Volkswagen", label: "Volkswagen" },
                                { value: "Volvo", label: "Volvo" },
                                { value: "Zotye", label: "Zotye" }
                            ]}
                        />

                        <InputField label="Car Model" name="carDetails.carModel" value={formData.carDetails.carModel} onChange={handleChange} required />
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

                        <SelectField

                            label="Auto Manual"
                            name="autoManual"
                            value={formData.autoManual}
                            onChange={handleChange}
                            required
                            options={[
                                { value: "auto", label: "Automatic" },
                                { value: "manual", label: "Manual" },
                            ]}

                        />

                        <InputField
                            label="Registration Plate Number"
                            name="plateNumber"
                            value={formData.plateNumber}
                            onChange={handleChange}
                            type="text"
                            placeholder="NADOR - A50 "
                        />

                        <InputField label="Number Places" name="numberplaces" value={formData.numberplaces} onChange={handleChange} required type="number" placeholder="Enter number of places like 5" />





                    </div>
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
                                label="Navigation"
                                name="amenities.hasNavigation"
                                checked={formData.amenities.hasNavigation}
                                onChange={handleChange}
                            />
                            <CheckboxField
                                label="Sunroof"
                                name="amenities.hasSunroof"
                                checked={formData.amenities.hasSunroof}
                                onChange={handleChange}
                            />
                            <CheckboxField
                                label="Bluetooth"
                                name="amenities.hasBluetooth"
                                checked={formData.amenities.hasBluetooth}
                                onChange={handleChange}
                            />
                            <CheckboxField
                                label="HeatedSeats"
                                name="amenities.hasHeatedSeats"
                                checked={formData.amenities.hasHeatedSeats}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

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
                                { value: "Pickup", label: "Pickup (بيك أب لنقل البضائع)" },
                                { value: "Electric", label: "Electric (سيارة كهربائية)" },
                                { value: "Hybrid", label: "Hybrid (سيارة هجينة)" },
                                { value: "Van", label: "Van (فان لنقل الأشخاص أو البضائع)" }
                            ]}
                        />

                        <InputField label="Price" name="price" value={formData.price} onChange={handleChange} required type="number" />
                        <InputField
                            label="Minimum Rental Period (days)"
                            name="rentalTerms.minimumPeriod"
                            value={formData.rentalTerms.minimumPeriod}
                            onChange={handleChange}
                            type="number"
                        />
                        <InputField
                            label="Late Return Fee(days)"
                            name="rentalTerms.lateReturnFee"
                            value={formData.rentalTerms.lateReturnFee}
                            onChange={handleChange}
                            type="number"
                        />
                        <InputField label="Distance allowed"
                            name="rentalTerms.maximumMileage"
                            value={formData.rentalTerms.maximumMileage}
                            onChange={handleChange}
                            required type="number"
                            placeholder="999 KM or 0"
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
