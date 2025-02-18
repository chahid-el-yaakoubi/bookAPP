const LocationInfo = ({ propertyData, setPropertyData }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Where's your place located?</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                    type="text"
                    value={propertyData.location.country}
                    onChange={(e) => setPropertyData({
                        ...propertyData,
                        location: { ...propertyData.location, country: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                    type="text"
                    value={propertyData.location.city}
                    onChange={(e) => setPropertyData({
                        ...propertyData,
                        location: { ...propertyData.location, city: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                    type="text"
                    value={propertyData.location.address}
                    onChange={(e) => setPropertyData({
                        ...propertyData,
                        location: { ...propertyData.location, address: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                        type="text"
                        value={propertyData.location.latitude}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            location: { ...propertyData.location, latitude: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                        type="text"
                        value={propertyData.location.longitude}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            location: { ...propertyData.location, longitude: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationInfo; 