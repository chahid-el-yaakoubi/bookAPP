import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddNeighbors from './AddNeighbors';

const CityDetails = () => {
    const { cityId } = useParams();
    const navigate = useNavigate();
    const [city, setCity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddNeighborOpen, setIsAddNeighborOpen] = useState(false);

    const fetchCityDetails = async () => {
        try {
            const response = await axios.get(`/api/cities/${cityId}`);
            setCity(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching city details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCityDetails();
    }, [cityId]);

    const handleRemoveNeighbor = async (neighborName) => {
        try {
            await axios.delete(`/api/cities/${city._id}/neighbors`, {
                data: { neighborName }
            });
            fetchCityDetails();
        } catch (error) {
            alert(`Failed to remove neighbor: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!city) return <div className="p-4">City not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/cities')}
                    className="text-blue-500 hover:text-blue-700 mb-4"
                >
                    ← Back to Cities
                </button>
                <h1 className="text-3xl font-bold mb-2">{city.name}</h1>
                <p className="text-gray-600">Region: {city.region}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">City Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Population:</p>
                            <p className="font-medium">{city.population?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Area:</p>
                            <p className="font-medium">{city.area ? `${city.area} km²` : 'N/A'}</p>
                        </div>
                        {/* Add more city details as needed */}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Neighboring Cities</h2>
                        <button
                            onClick={() => setIsAddNeighborOpen(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Neighbor
                        </button>
                    </div>
                    
                    {city.neighbors && city.neighbors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {city.neighbors.map((neighbor) => (
                                <div
                                    key={neighbor._id}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                                >
                                    <div>
                                        <p className="font-medium">{neighbor}</p>
                                        <p className="text-sm text-gray-600">{neighbor.region}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to remove it?')) {
                                                handleRemoveNeighbor(neighbor);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No neighboring cities yet</p>
                    )}
                </div>
            </div>
            {isAddNeighborOpen && (
                <AddNeighbors
                    isOpen={isAddNeighborOpen}
                    onClose={() => setIsAddNeighborOpen(false)}
                    cityID={city._id?.$oid || city._id}
                    city={city}
                    onNeighborsUpdated={fetchCityDetails}
                />
            )}
        </div>
    );
};

export default CityDetails; 