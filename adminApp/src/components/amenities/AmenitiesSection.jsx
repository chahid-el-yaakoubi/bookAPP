import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AmenitiesSection({ 
    amenityCategories, 
    formData, 
    handleAmenityChange, 
    amenityTranslations 
}) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
                Amenities
                <span className="block text-sm font-medium text-gray-600 mt-1" dir="rtl" lang="ar">
                    المرافق والخدمات
                </span>
            </h3>
            {Object.entries(amenityCategories).map(([category, { title, items }]) => (
                <div key={category} className="space-y-3">
                    <h4 className="font-semibold text-gray-700">
                        {title}
                        <span className="block text-sm text-gray-600" dir="rtl" lang="ar">
                            {amenityTranslations[category]?.ar || title}
                        </span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:border-blue-200 transition-colors">
                        {items.map(({ label, name: amenityName, icon }) => (
                            <div key={amenityName} className="flex items-center group relative">
                                <input
                                    id={`amenities.${category}.${amenityName}`}
                                    type="checkbox"
                                    name={`amenities.${category}.${amenityName}`}
                                    checked={formData.amenities[category][amenityName] || false}
                                    onChange={(e) => handleAmenityChange(category, amenityName, e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label 
                                    htmlFor={`amenities.${category}.${amenityName}`}
                                    className="ml-3 cursor-pointer hover:text-blue-600 transition-colors flex items-center text-gray-700"
                                >
                                    <FontAwesomeIcon icon={icon} className="mr-2 text-gray-500" />
                                    <span>{label}</span>
                                    <span 
                                        className="text-sm text-white z-50 hidden group-hover:block absolute -top-12 right-0 bg-blue-600 shadow-lg px-3 py-2 rounded-lg whitespace-nowrap"
                                        dir="rtl" 
                                        lang="ar"
                                    >
                                        {amenityTranslations[amenityName]?.ar}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AmenitiesSection; 