import { FiWifi, FiCoffee } from 'react-icons/fi';
import { 
    MdPool, 
    MdOutlineBalcony, 
    MdLocalParking, 
    MdKitchen, 
    MdTv,
    MdLocalLaundryService,
    MdHeatPump,
    MdElevator,
    MdHotTub,
    MdAcUnit
} from 'react-icons/md';

const AmenitiesSection = ({ propertyData, setPropertyData }) => {
    const amenitiesList = [
        { id: 'wifi', label: "WiFi", icon: <FiWifi className="w-5 h-5" /> },
        { id: 'ac', label: "Air Conditioning", icon: <MdAcUnit className="w-5 h-5" /> },
        { id: 'pool', label: "Private Pool", icon: <MdPool className="w-5 h-5" /> },
        { id: 'terrace', label: "Terrace", icon: <MdOutlineBalcony className="w-5 h-5" /> },
        { id: 'breakfast', label: "Breakfast Included", icon: <FiCoffee className="w-5 h-5" /> },
        { id: 'parking', label: "Free Parking", icon: <MdLocalParking className="w-5 h-5" /> },
        { id: 'kitchen', label: "Kitchen", icon: <MdKitchen className="w-5 h-5" /> },
        { id: 'tv', label: "TV", icon: <MdTv className="w-5 h-5" /> },
        { id: 'washing', label: "Washing Machine", icon: <MdLocalLaundryService className="w-5 h-5" /> },
        { id: 'heating', label: "Heating", icon: <MdHeatPump className="w-5 h-5" /> },
        { id: 'elevator', label: "Elevator", icon: <MdElevator className="w-5 h-5" /> },
        { id: 'hottub', label: "Hot Tub", icon: <MdHotTub className="w-5 h-5" /> }
    ];

    const handleAmenityToggle = (amenityLabel) => {
        const updatedAmenities = propertyData.property_details.amenities.includes(amenityLabel)
            ? propertyData.property_details.amenities.filter(a => a !== amenityLabel)
            : [...propertyData.property_details.amenities, amenityLabel];

        setPropertyData({
            ...propertyData,
            property_details: {
                ...propertyData.property_details,
                amenities: updatedAmenities
            }
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">What amenities do you offer?</h2>
            
            {/* Selected Amenities Count */}
            <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-sm font-medium">
                    Selected amenities: {propertyData.property_details.amenities.length}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Select all the amenities available at your property
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map((amenity) => (
                    <div 
                        key={amenity.id}
                        onClick={() => handleAmenityToggle(amenity.label)}
                        className={`
                            flex items-center p-3 rounded-lg border-2 cursor-pointer
                            transition-all duration-200 hover:border-blue
                            ${propertyData.property_details.amenities.includes(amenity.label)
                                ? 'border-blue bg-blue/5'
                                : 'border-gray-200'
                            }
                        `}
                    >
                        <div className={`
                            mr-3 transition-colors
                            ${propertyData.property_details.amenities.includes(amenity.label)
                                ? 'text-blue'
                                : 'text-gray-500'
                            }
                        `}>
                            {amenity.icon}
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium cursor-pointer">
                                {amenity.label}
                            </label>
                        </div>
                        <input
                            type="checkbox"
                            checked={propertyData.property_details.amenities.includes(amenity.label)}
                            onChange={() => handleAmenityToggle(amenity.label)}
                            className="h-4 w-4 text-blue border-gray-300 rounded focus:ring-blue"
                        />
                    </div>
                ))}
            </div>

            {/* Helper Text */}
            {propertyData.property_details.amenities.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                    Please select at least one amenity
                </p>
            )}
        </div>
    );
};

export default AmenitiesSection; 