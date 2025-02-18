const BasicInformation = ({ propertyData, setPropertyData }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Tell us about your place</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title
                </label>
                <input
                    type="text"
                    value={propertyData.title}
                    onChange={(e) => setPropertyData({...propertyData, title: e.target.value})}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                    placeholder="Give your property a catchy title"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                </label>
                <select
                    value={propertyData.type}
                    onChange={(e) => setPropertyData({...propertyData, type: e.target.value})}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                >
                    <option value="">Select type</option>
                    <option value="Riad">Riad</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    value={propertyData.description}
                    onChange={(e) => setPropertyData({...propertyData, description: e.target.value})}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                    rows="4"
                    placeholder="Describe your property"
                />
            </div>
        </div>
    );
};

export default BasicInformation; 