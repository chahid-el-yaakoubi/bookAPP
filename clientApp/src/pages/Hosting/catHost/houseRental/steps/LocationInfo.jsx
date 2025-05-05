import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';
import { getRegions } from '../../../../../Lib/api';

const Location = ({ propertyData, setPropertyData }) => {
    // State for regions, cities, and neighborhoods data
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);

    // State for selected values
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [postalCode, setPostalCode] = useState(propertyData?.location?.postal_code || '');
    const [latitude, setLatitude] = useState(propertyData?.location?.latitude || null);
    const [longitude, setLongitude] = useState(propertyData?.location?.longitude || null);
    const [coordinateInput, setCoordinateInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch regions data
    useEffect(() => {
        const fetchRegionsData = async () => {
            try {
                setIsLoading(true);
                const res = await getRegions();
                setRegions(res.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching regions:", error);
                setIsLoading(false);
            }
        };

        fetchRegionsData();
    }, []);

    // Set initial coordinate input value when component mounts
    useEffect(() => {
        if (latitude && longitude) {
            setCoordinateInput(`${latitude}, ${longitude}`);
        }
    }, []);

    // Initialize selections based on propertyData once regions are loaded
    useEffect(() => {
        if (regions.length > 0 && propertyData?.location) {
            // Find region by name
            const regionObj = regions.find(r => r.regionNameEnglish === propertyData.location.region);

            if (regionObj) {
                setSelectedRegion(regionObj._id);
                setCities(regionObj.cities || []);

                // Use setTimeout to ensure cities state is updated
                setTimeout(() => {
                    // Find city by name
                    const cityObj = regionObj.cities.find(c => c.cityNameEnglish === propertyData.location.city);

                    if (cityObj) {
                        setSelectedCity(cityObj.id);
                        setNeighborhoods(cityObj.neighborhoods || []);

                        // Use setTimeout to ensure neighborhoods state is updated
                        setTimeout(() => {
                            // Find neighborhood by name
                            const neighborhoodObj = cityObj.neighborhoods.find(n => n.valueEnglish === propertyData.location.neighborhood);
                            if (neighborhoodObj) {
                                setSelectedNeighborhood(neighborhoodObj.id);
                            }
                        }, 0);
                    }
                }, 0);
            }
        }
    }, [regions, propertyData?.location]);

    // Update cities when region changes
    useEffect(() => {
        if (selectedRegion) {
            const selectedRegionObj = regions.find(r => r._id === selectedRegion);
            if (selectedRegionObj) {
                setCities(selectedRegionObj.cities || []);
                setSelectedCity('');
                setSelectedNeighborhood('');
                setNeighborhoods([]);
            }
        } else {
            setCities([]);
            setSelectedCity('');
            setSelectedNeighborhood('');
            setNeighborhoods([]);
        }
    }, [selectedRegion, regions]);

    // Update neighborhoods when city changes
    useEffect(() => {
        if (selectedCity && cities.length > 0) {
            const selectedCityObj = cities.find(c => c.id === selectedCity);
            if (selectedCityObj) {
                setNeighborhoods(selectedCityObj.neighborhoods || []);
                setSelectedNeighborhood('');
            }
        } else {
            setNeighborhoods([]);
            setSelectedNeighborhood('');
        }
    }, [selectedCity, cities]);

    // Update parent state whenever any location field changes
    useEffect(() => {
        // Get the actual names from the selected IDs
        let regionName = '';
        let cityName = '';
        let neighborhoodName = '';

        if (selectedRegion) {
            const regionObj = regions.find(r => r._id === selectedRegion);
            if (regionObj) {
                regionName = regionObj.regionNameEnglish;
            }
        }

        if (selectedCity) {
            const cityObj = cities.find(c => c.id === selectedCity);
            if (cityObj) {
                cityName = cityObj.cityNameEnglish;
            }
        }

        if (selectedNeighborhood) {
            const neighborhoodObj = neighborhoods.find(n => n.id === selectedNeighborhood);
            if (neighborhoodObj) {
                neighborhoodName = neighborhoodObj.valueEnglish;
            }
        }

        // Get region, city, and neighborhood names from selections
        const regionObj = regions.find(r => r._id === selectedRegion);
        const cityObj = cities.find(c => c.id === selectedCity);
        const neighborhoodObj = neighborhoods.find(n => n.id === selectedNeighborhood);

        setPropertyData(prevData => ({
            ...prevData,
            location: {
                ...prevData.location,
                city: cityName,
                region: regionName,
                postal_code: postalCode,
                country: 'morocco', // Set default country as specified in the schema
                latitude: latitude,
                longitude: longitude,
                neighborhood: neighborhoodName,
                addressEn: `${regionObj?.regionNameEnglish || ''}- ${cityObj?.cityNameEnglish || ''}- ${neighborhoodObj?.valueEnglish || ''}`,
                addressAr: `${regionObj?.regionNameArabic || ''}- ${cityObj?.cityNameArabic || ''}- ${neighborhoodObj?.valueArabic || ''}`,
            }
        }));
    }, [selectedRegion, selectedCity, selectedNeighborhood, postalCode, latitude, longitude]);

    // Initialize parent data with default values on component mount
    useEffect(() => {
        // Only initialize if location doesn't exist in parent data
        if (!propertyData?.location || Object.keys(propertyData?.location || {}).length === 0) {
            setPropertyData(prevData => ({
                ...prevData,
                location: {
                    city: '',
                    region: '',
                    postal_code: '',
                    country: 'morocco',
                    latitude: null,
                    longitude: null,
                    neighborhood: ''
                }
            }));
        }
    }, []);

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

            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue border-t-transparent rounded-full"></div>
                    <span className="ml-3">Loading location data...</span>
                </div>
            ) : (
                <div className="space-y-6 mb-10">
                    <form onChange={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region
                                </label>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(region => (
                                        <option key={region._id} value={region._id}>
                                            {region.regionNameEnglish}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                    disabled={!selectedRegion}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.cityNameEnglish}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Neighborhood
                                </label>
                                <select
                                    value={selectedNeighborhood}
                                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                    disabled={!selectedCity}
                                >
                                    <option value="">Select Neighborhood</option>
                                    {neighborhoods.map(neighborhood => (
                                        <option key={neighborhood.id} value={neighborhood.id}>
                                            {neighborhood.valueEnglish}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                            {selectedRegion && selectedCity ? (
                                                `${cities.find(c => c.id === selectedCity)?.cityNameEnglish || ''}, ${regions.find(r => r._id === selectedRegion)?.regionNameEnglish || ''}`
                                            ) : 'Location set'}
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
            )}
        </div>
    );
};

export default Location;