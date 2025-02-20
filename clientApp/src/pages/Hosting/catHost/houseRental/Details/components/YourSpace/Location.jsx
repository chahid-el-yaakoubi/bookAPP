import { useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const Location = () => {
    const [address, setAddress] = useState('');
    const [apt, setApt] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement address search functionality
        console.log('Searching for:', searchQuery);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <p className="text-gray-600 mb-6">
                Help guests find your property by providing your exact address.
            </p>

            <div className="space-y-6">
                {/* Address Search */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for your address"
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                    </form>
                </div>

                {/* Address Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="Enter your street address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apt/Suite (optional)
                        </label>
                        <input
                            type="text"
                            value={apt}
                            onChange={(e) => setApt(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="Apartment or suite number"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="City"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State/Province
                            </label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="State or province"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ZIP/Postal Code
                            </label>
                            <input
                                type="text"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="ZIP or postal code"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </div>

                {/* Map Preview */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Map Preview</h3>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="w-8 h-8 text-gray-400" />
                        <span className="ml-2 text-gray-500">Map will appear here</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Location; 