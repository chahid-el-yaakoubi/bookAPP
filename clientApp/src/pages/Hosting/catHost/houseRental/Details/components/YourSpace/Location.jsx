import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSave, FaSearch, FaLocationArrow } from 'react-icons/fa';
import { selectProperty } from '../../../../../../../redux/actions/propertyActions';
import { useDispatch, useSelector } from 'react-redux';
import { getRegions, updateProperty } from '../../../../../../../Lib/api';

const Location = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const initialLocation = selectedProperty?.location;
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);

    // State for form fields
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [postal_code, setPostal_code] = useState('');
    const [coordinateInput, setCoordinateInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch regions with async/await
    useEffect(() => {
        const fetchRegionsData = async () => {
            try {
                const res = await getRegions();
                setRegions(res.data);
            } catch (error) {
                console.error("Error fetching regions:", error);
            }
        };

        fetchRegionsData();
    }, []);

    // Initialize form with data once regions are loaded
    useEffect(() => {
        if (initialLocation && regions.length > 0) {
            // Find region by name
            const regionObj = regions.find(r => r.regionNameEnglish === initialLocation.region);

            if (regionObj) {
                setSelectedRegion(regionObj._id);

                // Immediately set cities from the found region
                setCities(regionObj.cities || []);

                // Wait for the next render cycle with cities
                setTimeout(() => {
                    // Find city by name
                    const cityObj = regionObj.cities.find(c => c.cityNameEnglish === initialLocation.city);

                    if (cityObj) {
                        setSelectedCity(cityObj.id);

                        // Immediately set neighborhoods
                        setNeighborhoods(cityObj.neighborhoods || []);

                        // Wait for the next render cycle with neighborhoods
                        setTimeout(() => {
                            // Find neighborhood by name
                            const neighborhoodObj = cityObj.neighborhoods.find(n => n.valueEnglish === initialLocation.neighborhood);
                            if (neighborhoodObj) {
                                setSelectedNeighborhood(neighborhoodObj.id);
                            }
                        }, 0);
                    }
                }, 0);
            }

            // Set coordinate data
            const lat = initialLocation?.latitude ? initialLocation.latitude.toString() : '';
            const lng = initialLocation?.longitude ? initialLocation.longitude.toString() : '';
            const pscode = initialLocation?.postal_code ? initialLocation.postal_code.toString() : '';

            setLatitude(lat);
            setLongitude(lng);

            setPostal_code(pscode)

            // Set coordinate input display format
            if (lat && lng) {
                setCoordinateInput(`${lat}, ${lng}`);
            } else {
                setCoordinateInput('');
            }
        }
    }, [initialLocation, regions]);

    // Update cities when region changes
    useEffect(() => {
        if (selectedRegion) {
            const selectedRegionObj = regions.find(r => r._id === selectedRegion);
            if (selectedRegionObj) {
                setCities(selectedRegionObj.cities);
                setSelectedCity('');
                setNeighborhoods([]);
                setSelectedNeighborhood('');
            }
        } else {
            setCities([]);
            setSelectedCity('');
            setNeighborhoods([]);
            setSelectedNeighborhood('');
        }
    }, [selectedRegion, regions]);

    // Update neighborhoods when city changes
    useEffect(() => {
        if (selectedCity && cities.length > 0) {
            const selectedCityObj = cities.find(c => c.id === selectedCity);
            if (selectedCityObj) {
                setNeighborhoods(selectedCityObj.neighborhoods);
                setSelectedNeighborhood('');
            }
        } else {
            setNeighborhoods([]);
            setSelectedNeighborhood('');
        }
    }, [selectedCity, cities]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Get region, city, and neighborhood names from selections
        const regionObj = regions.find(r => r._id === selectedRegion);
        const cityObj = cities.find(c => c.id === selectedCity);
        const neighborhoodObj = neighborhoods.find(n => n.id === selectedNeighborhood);

        const updatedProperty = {
            location: {
                ...selectedProperty.location,
                region: regionObj?.regionNameEnglish || '',
                city: cityObj?.cityNameEnglish || '',
                neighborhood: neighborhoodObj?.valueEnglish || '',
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                postal_code : postal_code || ''
            }
        };

        try {
            const res = await updateProperty(selectedProperty?._id, updatedProperty);

            if (res.status === 200) {
                dispatch(selectProperty(res.data));
                setIsSaving(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Error updating property:", error);
            setIsSaving(false);
            alert("Failed to save location details.");
        }
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

    // Improved coordinate handling
    const handleCoordinateChange = (e) => {
        const value = e.target.value;
        setCoordinateInput(value);

        // If input is empty, clear both coordinates
        if (!value.trim()) {
            setLatitude('');
            setLongitude('');
            return;
        }

        // If input contains a comma, try to parse as lat,lng pair
        if (value.includes(',')) {
            const coords = value.split(',').map(coord => coord.trim());

            if (coords.length >= 2) {
                // Set values even if they're not perfectly formatted numbers
                // (validation will happen during form submission)
                setLatitude(coords[0]);
                setLongitude(coords[1]);
            }
        } else {
            // If no comma, just update latitude field
            setLatitude(value);
            setLongitude('');
        }
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

            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <div className='w-full'>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                value={postal_code}
                                onChange={(e) => setPostal_code(e.target.value)}
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
                            placeholder="e.g. 37.7749, -122.4194"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter coordinates in decimal format (e.g. 37.7749, -122.4194) or clear to remove location
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
                                        {selectedRegion && selectedCity ?
                                            `${cities.find(c => c.id === selectedCity)?.cityNameEnglish || ''}, ${regions.find(r => r._id === selectedRegion)?.regionNameEnglish || ''}`
                                            : 'Location set'}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <FaMapMarkerAlt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <span className="block text-gray-500">Enter coordinates to see location</span>
                                    <button
                                        type="button"
                                        onClick={handleGetCurrentLocation}
                                        className="mt-4 px-4 py-2 bg-blue text-blue rounded-lg hover:bg-blue flex items-center mx-auto"
                                    >
                                        <FaLocationArrow className="mr-2" /> Use my current location
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fixed Action Button */}
                    <div className={`fixed bottom-10 right-[10%] transition-all ${showSuccess ? 'translate-y-0' : ''}`}>
                        {showSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center animate-fade-in">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Location saved successfully!
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue flex items-center gap-2 shadow-lg transition-all hover:shadow-xl"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave size={16} />
                                    Save Location
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Location;