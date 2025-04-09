const TitleProperty = ({ propertyData, setPropertyData }) => {
    return (
        <div className="space-y-4 h-full min-h-[70vh]">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short titles are more effective. Don't worry, you can always change them later.
                </label>
                <input
                    type="text"
                    value={propertyData.title || ''}
                    onChange={(e) => {
                        const newTitle = e.target.value.slice(0, 60); // Limit input to 40 characters
                        setPropertyData({
                            ...propertyData,
                            title: newTitle
                        });
                    }}
                    className="w-full  border rounded-md focus:ring-blue focus:border-blue text-2xl p-4"
                    placeholder="Enter property title"
                    maxLength={60} // Also ensures max length at the input level
                />

                <span>{propertyData.title.length }/60 </span>
            </div>
        </div>
    );
};

export default TitleProperty;
