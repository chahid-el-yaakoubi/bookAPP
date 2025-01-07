import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContect";


function CityForm({ isOpen, onClose, onSubmitSuccess, cityData , refetch }) {
    const { user} = useContext(AuthContext);
    const isA = user._id
    const moroccanRegions = [
        "Tanger-Tétouan-Al Hoceïma",
        "L'Oriental",
        "Fès-Meknès",
        "Rabat-Salé-Kénitra",
        "Béni Mellal-Khénifra",
        "Casablanca-Settat",
        "Marrakech-Safi",
        "Drâa-Tafilalet",
        "Souss-Massa",
        "Guelmim-Oued Noun",
        "Laâyoune-Sakia El Hamra",
        "Dakhla-Oued Ed-Dahab"
    ];

    const [formData, setFormData] = useState({
        isA: isA,
        name: cityData?.name || "",
        region: cityData?.region || "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cityData) {
            setFormData({
                name: cityData.name || "",
                region: cityData.region || "",
            });
        }
    }, [cityData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (cityData?._id) {
                // Edit existing city
                response = await axios.put(`/api/cities/${cityData._id}`, formData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                onSubmitSuccess?.(response.data);
                onClose();
                alert("City updated successfully!");
                refetch();
            } else {
                // Check if city already exists
                const existingCities = await axios.get('/api/cities');
                const cityExists = existingCities.data.some(
                    city => city.name.toLowerCase() === formData.name.toLowerCase()
                );

                if (cityExists) {
                    alert("This city already exists!");
                    return;
                }

                // Add new city if it doesn't exist
                response = await axios.post("/api/cities", formData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                alert("City added successfully!");
                if (onSubmitSuccess) onSubmitSuccess(response.data);
                onClose();
                refetch();
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || `Error ${cityData ? 'updating' : 'adding'} city`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{cityData ? 'Edit City' : 'Add New City'}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="max-w-md">
                    <div className="mb-4">
                        <label className="block mb-2">
                            City Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            Region:
                            <select
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select a region</option>
                                {moroccanRegions.map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white px-4 py-2 rounded 
                            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                        {loading ? (cityData ? "Updating..." : "Adding...") : (cityData ? "Update City" : "Add City")}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CityForm;