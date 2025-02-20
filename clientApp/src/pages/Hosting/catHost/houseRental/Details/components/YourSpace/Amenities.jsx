import { useState } from 'react';
import { FaWifi, FaTv, FaParking, FaSwimmingPool, FaSnowflake, 
         FaHotTub, FaUmbrellaBeach, FaDumbbell, 
         FaUtensils, FaWater, FaPlus } from 'react-icons/fa';
        //  FaFireplace

const Amenities = () => {
    const [selectedAmenities, setSelectedAmenities] = useState(new Set());
    const [customAmenity, setCustomAmenity] = useState('');
    const [customAmenities, setCustomAmenities] = useState([]);

    const amenitiesCategories = [
        {
            title: 'Essential Amenities',
            items: [
                { id: 'wifi', label: 'WiFi', icon: FaWifi },
                { id: 'tv', label: 'TV', icon: FaTv },
                { id: 'parking', label: 'Free parking', icon: FaParking },
                { id: 'kitchen', label: 'Kitchen', icon: FaUtensils },
            ]
        },
        {
            title: 'Featured Amenities',
            items: [
                { id: 'pool', label: 'Pool', icon: FaSwimmingPool },
                { id: 'ac', label: 'Air conditioning', icon: FaSnowflake },
                { id: 'hot_tub', label: 'Hot tub', icon: FaHotTub },
                { id: 'beach_access', label: 'Beach access', icon: FaUmbrellaBeach },
            ]
        },
        {
            title: 'Additional Amenities',
            items: [
                { id: 'fireplace', label: 'Fireplace', icon: FaUmbrellaBeach },
                { id: 'gym', label: 'Gym', icon: FaDumbbell },
                { id: 'waterfront', label: 'Waterfront', icon: FaWater },
            ]
        }
    ];

    const toggleAmenity = (id) => {
        const newSelected = new Set(selectedAmenities);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedAmenities(newSelected);
    };

    const addCustomAmenity = () => {
        if (customAmenity.trim()) {
            setCustomAmenities([...customAmenities, customAmenity.trim()]);
            setCustomAmenity('');
        }
    };

    const removeCustomAmenity = (index) => {
        setCustomAmenities(customAmenities.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <p className="text-gray-600 mb-6">
                Select the amenities available at your property.
            </p>

            <div className="space-y-8">
                {amenitiesCategories.map((category) => (
                    <div key={category.title} className="space-y-4">
                        <h3 className="text-lg font-medium">{category.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.items.map((amenity) => (
                                <button
                                    key={amenity.id}
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`flex items-center gap-3 p-4 border rounded-lg transition-colors
                                        ${selectedAmenities.has(amenity.id)
                                            ? 'border-blue bg-blue/5'
                                            : 'border-gray-200 hover:border-blue'}`}
                                >
                                    <amenity.icon className="w-5 h-5 text-gray-600" />
                                    <span>{amenity.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Custom amenities */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Custom Amenities</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customAmenity}
                            onChange={(e) => setCustomAmenity(e.target.value)}
                            placeholder="Add custom amenity"
                            className="flex-1 p-2 border rounded-lg"
                        />
                        <button
                            onClick={addCustomAmenity}
                            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90"
                        >
                            <FaPlus />
                        </button>
                    </div>
                    {customAmenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {customAmenities.map((amenity, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                                >
                                    {amenity}
                                    <button
                                        onClick={() => removeCustomAmenity(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Amenities; 