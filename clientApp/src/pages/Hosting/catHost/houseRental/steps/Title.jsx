const TitleProperty = ({ propertyData, setPropertyData }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short titles are more effective. Don't worry, you can always change them later.
                </label>
                <input
                    type="text"
                    value={propertyData.title || ''}
                    onChange={(e) => {
                        const newTitle = e.target.value.slice(0, 40); // Limit input to 40 characters
                        setPropertyData({
                            ...propertyData,
                            title: newTitle
                        });
                    }}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter property title"
                    maxLength={40} // Also ensures max length at the input level
                />

                <span>{propertyData.title.length }/40 </span>
            </div>
        </div>
    );
};

export default TitleProperty;
