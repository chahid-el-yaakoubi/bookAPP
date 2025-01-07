import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { use, useEffect, useState, useContext } from "react";
import axios from "axios";
import { FormSection, InputField, SelectField, CheckboxField } from "../../../components/ComponentInputs";
import { City, Neighborhood, Region } from "../../../components/Location";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContect";
import useFetch from "../../../hooks/useFetch";


const NewShop = () => {
    const { user} = useContext(AuthContext);
    const isA = user._id
    const navigate = useNavigate();

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedNeighboorhd, setSelectedNeighboorhd] = useState("");

    const { id } = useParams();

    const { data } = useFetch(`/api/shops/find/${id}`)

    const region = data.location?.region;
    const city = data.location?.city;
    const neighborhood = data.location?.neighborhood;

    const [formData, setFormData] = useState({
        isA: isA,

        shopName: "",
        ownerName: "",
        contactNumber: "",
        email: "",
        location: {
            region: selectedRegion,
            city: selectedCity,
            neighborhood: selectedNeighboorhd,
            coordonates: "",
        },
        type: "",
        price: "",
        rentalDuration: "",
        rentalDeposit: "",
        area: "",
        amenities: {
            hasElectricity: false,
            hasWater: false,
            hasParking: false,
            hasSecurity: false,
            hasAirConditioning: false,
            hasInternet: false,
            hasStorageSpace: false,
            hasBathroom: false,
        },
        proximity: {
            items: [],
        },
        description: "",
        photos: [],
        status: "Available",
    });


    useEffect(() => {







        if (data) {
            setFormData((prevFormData) => ({
                ...prevFormData, // Retain all existing data
                ...data         // Override with new data from 'data'
            }));


            setSelectedRegion(region);
            setSelectedCity(city);
            setSelectedNeighboorhd(neighborhood);



        }
    }, [data]);



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


    const [newProximityItem, setNewProximityItem] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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


    const handleAddProximityItem = () => {
        if (newProximityItem.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                proximity: {
                    ...prev.proximity,
                    items: [...prev.proximity.items, newProximityItem.trim()],
                },
            }));
            setNewProximityItem("");
        }
    };

    const handleRemoveProximityItem = (index) => {
        setFormData((prev) => ({
            ...prev,
            proximity: {
                ...prev.proximity,
                items: prev.proximity.items.filter((_, i) => i !== index),
            },
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setErrorMessage(""); // Reset error message

        const requiredFields = [
            "shopName",
            "ownerName",
            "contactNumber",
            "email",
            "type",
            "price",
            "area",
        ];

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
        const area = parseFloat(formData.area);
        if (price <= 0 || area <= 0) {
            setErrorMessage("Price and Area should be positive numbers.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (id) {
                const response = await axios.put(`/api/shops/${id}`, formData);
                alert("Shop updated successfully!");
                console.log(response.data);
                navigate("/shops");
            } else {
                const response = await axios.post("/api/shops", formData);
                alert("Shop added successfully!");
                console.log(response.data);
                navigate("/shops");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to add shop.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
            <form onSubmit={handleSubmit} className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg border border-gray-300">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Add New Shop</h2>
                {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
                {/* Shop Details Section */}
                <FormSection title="Shop Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} required />
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
                            neighborhoodValue={selectedNeighboorhd}
                        />

                        <InputField
                            label="coordonates"
                            name="location.coordonates"
                            value={formData.location.coordonates}
                            onChange={handleChange}
                            placeholder="e.g., 25.2867° N, 51.5333° E"
                            type="text"
                        />
                    </div>
                </FormSection>
                {/* Shop Type and Pricing Section */}
                <FormSection title="Shop Type & Pricing">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            options={[{ value: "Sale", label: "Sale" }, { value: "Rent", label: "Rent" }]}
                        />
                        <InputField label="Price" name="price" value={formData.price} onChange={handleChange} required type="number" />
                        {formData.type === "Rent" && (
                            <>
                                <SelectField
                                    label="Rental Duration"
                                    name="rentalDuration"
                                    value={formData.rentalDuration}
                                    onChange={handleChange}
                                    options={[{ value: "Monthly", label: "Monthly" }, { value: "Yearly", label: "Yearly" }]}
                                />
                                <InputField
                                    label="Rental Deposit"
                                    name="rentalDeposit"
                                    value={formData.rentalDeposit}
                                    onChange={handleChange}
                                    type="number"
                                />
                            </>
                        )}
                        <InputField label="Area (m²)" name="area" value={formData.area} onChange={handleChange} type="number" />
                    </div>
                </FormSection>
                {/* Amenities Section */}
                <FormSection title="Amenities">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {Object.keys(formData.amenities).map((key) => (
                            <CheckboxField
                                key={key}
                                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                name={`amenities.${key}`}
                                checked={formData.amenities[key]}
                                onChange={handleChange}
                            />
                        ))}
                    </div>
                </FormSection>
                {/* Proximity Section */}
                <FormSection title="Proximity">
                    <div className="flex flex-col mb-4">
                        <input
                            type="text"
                            value={newProximityItem}
                            onChange={(e) => setNewProximityItem(e.target.value)}
                            placeholder="Add new proximity item"
                            className="border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddProximityItem}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            Add Item
                        </button>
                    </div>
                    <ul className="list-disc pl-5">
                        {formData.proximity.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center text-gray-700">
                                {item}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProximityItem(index)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </FormSection>
                {/* Additional Information Section */}
                <FormSection title="Additional Information">
                    <InputField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        type="textarea"
                    />
                </FormSection>
                {/* Submit Button */}
                <div className="flex gap-4 ">
                    <button type="reset" className="bg-red-500 w-full  text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition duration-200 mt-6">Reset</button>
                    <button
                        type="submit"
                        className=" bg-blue-600 w-full text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200 mt-6"
                    >
                        {id ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewShop;