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
export const Region = ({ onRegionSelect, regionValue , onCitySelect}) => {
    const { data, loading, error } = useFetchCities();
    const regions = [...new Set(data.map(item => item.region))];

    if (loading) return <p>Loading regions...</p>;
    if (error) return <p>Error fetching regions: {error.message}</p>;

   

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Select a Region</h1>
            <select
                value={regionValue || ""}
                onChange={(e) => {onRegionSelect(e.target.value)
                    onCitySelect("")
                } }
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
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

    if (loading) return <p>Loading cities...</p>;
    if (error) return <p>Error fetching cities: {error.message}</p>;

    

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Select a City</h1>
            <select
                value={cityValue || ""}
                onChange={(e) => {onCitySelect(e.target.value)
                    onNeighborhoodSelect("")
                }}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
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

    if (loading) return <p>Loading neighborhoods...</p>;
    if (error) return <p>Error fetching neighborhoods: {error.message}</p>;



    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Select a Neighborhood</h1>
            <select
                value={neighborhoodValue || ""}
                onChange={(e) => onNeighborhoodSelect(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
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
