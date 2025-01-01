import React, { useEffect, useState } from "react";
import axios from "axios";

// Custom Hook for Fetching Data
const useFetchCities = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/cities`);
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, error };
};

// Region Component
export const Region = ({ onRegionSelect, regionValue, onCitySelect }) => {
    const { data, loading, error } = useFetchCities();
    const regions = [...new Set(data.map(item => item.region))];

    if (loading) return <div className="bg-white rounded-lg p-4">Loading regions...</div>;
    if (error) return <div className="bg-white rounded-lg p-4 text-red-500">Error fetching regions: {error.message}</div>;

    return (
        <div className="bg-white rounded-lg p-4">
            <label className="block text-md mb-3 font-medium text-gray-700">
                Region
            </label>
            <select
                value={regionValue || ""}
                onChange={(e) => {
                    onRegionSelect(e.target.value);
                    onCitySelect("");
                }}
                className={`${regionValue ? "bg-blue-100 text-black" : "bg-gray-50"} block w-full px-4 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            >
                <option value="" disabled>Select a region</option>
                {regions.map((region, index) => (
                    <option key={index} value={region}>
                        {region}
                    </option>
                ))}
            </select>
        </div>
    );
};

// City Component
export const City = ({ region, onCitySelect, cityValue, onNeighborhoodSelect }) => {
    const { data, loading, error } = useFetchCities();
    const cities = data.filter(item => item.region === region);

    if (loading) return <div className="bg-white rounded-lg p-4">Loading cities...</div>;
    if (error) return <div className="bg-white rounded-lg p-4 text-red-500">Error fetching cities: {error.message}</div>;

    return (
        <div className="bg-white rounded-lg p-4">
            <label className="block text-md mb-3 font-medium text-gray-700">
                City
            </label>
            <select
                value={cityValue || ""}
                onChange={(e) => {
                    onCitySelect(e.target.value);
                    onNeighborhoodSelect("");
                }}
                className={`${cityValue ? "bg-blue-100 text-black" : "bg-gray-50"} block w-full px-4 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            >
                <option value="" disabled>Select a city</option>
                {cities.map(city => (
                    <option key={city._id} value={city.name}>
                        {city.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Neighborhood Component
export const Neighborhood = ({ city, neighborhoodValue, onNeighborhoodSelect }) => {
    const { data, loading, error } = useFetchCities();
    const neighborhoods = data.find(item => item.name === city)?.neighbors || [];

    if (loading) return <div className="bg-white rounded-lg p-4">Loading neighborhoods...</div>;
    if (error) return <div className="bg-white rounded-lg p-4 text-red-500">Error fetching neighborhoods: {error.message}</div>;

    return (
        <div className="bg-white rounded-lg p-4">
            <label className="block text-md mb-3 font-medium text-gray-700">
                Neighborhood
            </label>
            <select
                value={neighborhoodValue || ""}
                onChange={(e) => onNeighborhoodSelect(e.target.value)}
                className={`${neighborhoodValue ? "bg-blue-100 text-black" : "bg-gray-50"} block w-full px-4 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            >
                <option value="" disabled>Select a neighborhood</option>
                {neighborhoods.map((neighbor, index) => (
                    <option key={index} value={neighbor}>
                        {neighbor}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Example Usage
const App = () => {
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    return (
        <div>
            <Region onRegionSelect={setSelectedRegion} />
            {selectedRegion && <City region={selectedRegion} onCitySelect={setSelectedCity} />}
            {selectedCity && <Neighborhood city={selectedCity} />}
        </div>
    );
};

export default App;
