import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSave, FaSearch, FaLocationArrow } from 'react-icons/fa';
import { UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions';
import { useDispatch, useSelector } from 'react-redux';

const Location = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const initialLocation = selectedProperty?.location;

    // State for form fields
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Initialize form with data if provided
    useEffect(() => {
        if (initialLocation) {
            setCity(initialLocation.city || '');
            setRegion(initialLocation?.region || '');
            setLatitude(initialLocation?.latitude ? initialLocation?.latitude.toString() : '');
            setLongitude(initialLocation?.longitude ? initialLocation?.longitude.toString() : '');
            setNeighborhood(initialLocation?.neighborhood || '');
        }
    }, [initialLocation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        const updatedProperty = {
            ...selectedProperty,
            location: {
                ...selectedProperty.location,
                city: city,
                region: region,
                latitude: parseFloat(latitude) || 0,
                longitude: parseFloat(longitude) || 0,
                neighborhood: neighborhood
            }
        };

        dispatch({
            type: UPDATE_PROPERTY,
            payload: { updatedProperty }
        });

        // Simulate API call delay
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 2000);
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toFixed(6));
                    setLongitude(position.coords.longitude.toFixed(6));
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

    const handleCoordinateChange = (e) => {
        const value = e.target.value;
        const coords = value.split(',').map(coord => coord.trim());
        
        if (coords.length >= 2) {
            setLatitude(coords[0]);
            setLongitude(coords[1]);
        } else {
            setLatitude(value);
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
                {/* <div className="bg-blue p-4 rounded-lg border border-blue flex items-start">
                    <FaSearch className="text-blue mt-1 mr-3" />
                    <div>
                        <h3 className="font-medium text-blue">Search for Address</h3>
                        <p className="text-sm text-blue">
                            Use the search box below to automatically fill in address details or enter them manually.
                        </p>
                        <div className="mt-3 relative">
                            <input
                                type="text"
                                placeholder="Search for an address..."
                                className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            />
                            <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
                        </div>
                    </div>
                </div> */}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="e.g. California"
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
                                placeholder="e.g. San Francisco"
                            />
                        </div>
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
                            placeholder="e.g. Downtown"
                        />
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
                            value={latitude && longitude ? `${latitude}, ${longitude}` : ''}
                            onChange={handleCoordinateChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="e.g. 37.7749, -122.4194"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter coordinates in decimal format (e.g. 37.7749, -122.4194)
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