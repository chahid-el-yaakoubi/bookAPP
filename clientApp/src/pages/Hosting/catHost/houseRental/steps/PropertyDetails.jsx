const PropertyDetails = ({ propertyData, setPropertyData }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Tell us more about your property</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                    <input
                        type="number"
                        value={propertyData.property_details.rooms}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            property_details: { ...propertyData.property_details, rooms: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input
                        type="number"
                        value={propertyData.property_details.bathrooms}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            property_details: { ...propertyData.property_details, bathrooms: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                    <input
                        type="number"
                        value={propertyData.property_details.beds}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            property_details: { ...propertyData.property_details, beds: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                    <input
                        type="number"
                        value={propertyData.property_details.max_guests}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            property_details: { ...propertyData.property_details, max_guests: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                        min="1"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqm)</label>
                <input
                    type="number"
                    value={propertyData.property_details.size_sqm}
                    onChange={(e) => setPropertyData({
                        ...propertyData,
                        property_details: { ...propertyData.property_details, size_sqm: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                    min="1"
                />
            </div>
        </div>
    );
};

export default PropertyDetails; 