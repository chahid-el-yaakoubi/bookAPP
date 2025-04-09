import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';

const Location = ({ propertyData, setPropertyData }) => {
    // Initialize state from propertyData or with empty values
    const [city, setCity] = useState(propertyData?.location?.city || '');
    const [region, setRegion] = useState(propertyData?.location?.region || '');
    const [postalCode, setPostalCode] = useState(propertyData?.location?.postal_code || '');
    const [neighborhood, setNeighborhood] = useState(propertyData?.location?.neighborhood || '');
    const [latitude, setLatitude] = useState(propertyData?.location?.latitude || null);
    const [longitude, setLongitude] = useState(propertyData?.location?.longitude || null);
    const [coordinateInput, setCoordinateInput] = useState('');

    // Set initial coordinate input value when component mounts
    useEffect(() => {
        if (latitude && longitude) {
            setCoordinateInput(`${latitude}, ${longitude}`);
        }
    }, []);

    // Update parent state whenever any location field changes
    useEffect(() => {
        updateParentData();
    }, [city, region, postalCode, neighborhood, latitude, longitude]);

    // Initialize parent data with default values on component mount
    useEffect(() => {
        // Only initialize if location doesn't exist in parent data
        if (!propertyData?.location || Object.keys(propertyData?.location || {}).length === 0) {
            updateParentData();
        }
    }, []);

    // Function to update parent state with current location data
    const updateParentData = () => {
        setPropertyData(prevData => ({
            ...prevData,
            location: {
                ...prevData.location,
                city: city,
                region: region,
                postal_code: postalCode,
                country: 'morocco', // Set default country as specified in the schema
                latitude: latitude,
                longitude: longitude,
                neighborhood: neighborhood
            }
        }));
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(6);
                    const lng = position.coords.longitude.toFixed(6);
                    setLatitude(lat);
                    setLongitude(lng);
                    setCoordinateInput(`${lat}, ${lng}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location. Please enter coordinates manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    // Properly handle coordinate input changes including deletion
    const handleCoordinateChange = (e) => {
        const value = e.target.value;
        setCoordinateInput(value);
        
        // Handle empty input - clear coordinates
        if (!value.trim()) {
            setLatitude(null);
            setLongitude(null);
            return;
        }
        
        // Parse coordinates if comma is present
        if (value.includes(',')) {
            const coords = value.split(',').map(coord => coord.trim());
            
            if (coords.length >= 2) {
                const lat = parseFloat(coords[0]);
                const lng = parseFloat(coords[1]);
                
                if (!isNaN(lat) && !isNaN(lng)) {
                    setLatitude(lat.toFixed(6));
                    setLongitude(lng.toFixed(6));
                }
            }
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        updateParentData();
    };

    return (
        <div className="p-6 mb-24 md:mb-0 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="text-blue text-2xl mr-3" />
                <h2 className="text-2xl font-semibold">Location Details</h2>
            </div>
            <p className="text-gray-600 mb-6">
                Enter the property location details. Accurate location information helps potential buyers or renters find your property.
            </p>

            <div className="space-y-6 mb-10">
                <form onChange={handleSubmit} className="space-y-6">
                     
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Region
                            </label>
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="e.g. Marrakech-Safi"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="e.g. Marrakech"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="e.g. 40000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Neighborhood
                            </label>
                            <input
                                type="text"
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="e.g. Gueliz"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Latitude, Longitude
                            </label>
                            <button 
                                type="button"
                                onClick={handleGetCurrentLocation}
                                className="text-sm text-blue flex items-center hover:text-blue"
                            >
                                <FaLocationArrow className="mr-1" /> Get current location
                            </button>
                        </div>
                        <input
                            type="text"
                            value={coordinateInput}
                            onChange={handleCoordinateChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="e.g. 31.6295, -7.9811"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter coordinates in decimal format (e.g. 31.6295, -7.9811) or clear the field to remove location
                        </p>
                    </div>

                    {/* Map Preview */}
                    <div className="mt-6 border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                            <h3 className="text-lg font-medium text-gray-700">Map Preview</h3>
                        </div>
                        <div className="aspect-video bg-gray-100 flex items-center justify-center max-h-[300px] h-full">
                            {latitude && longitude ? (
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-500 opacity-20 rounded-full animate-ping"></div>
                                        <FaMapMarkerAlt className="w-8 h-8 text-red-500 mx-auto relative z-10" />
                                    </div>
                                    <span className="block mt-2 font-medium">
                                        {latitude}, {longitude}
                                    </span>
                                    <span className="block mt-1 text-sm text-gray-600">
                                        {city && region ? `${city}, ${region}` : 'Location set'}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <FaMapMarkerAlt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <span className="block text-gray-500">Enter coordinates to see location</span>
                                    <button
                                        type="button"
                                        onClick={handleGetCurrentLocation}
                                        className="mt-4 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-600 flex items-center mx-auto"
                                    >
                                        <FaLocationArrow className="mr-2" /> Use my current location
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Location;