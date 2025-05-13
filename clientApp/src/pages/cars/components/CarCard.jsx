import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaGasPump, FaCog, FaUsers } from 'react-icons/fa';

const CarCard = ({ car }) => {
    const mainPhoto = car.photos?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
    const model = car.carDetails?.carModel || 'Unknown Model';
    const make = car.carDetails?.carMake || '';
    const city = car.location?.city || 'Unknown City';
    const price = car.price || 'N/A';
    const transmission = car.autoManual || 'N/A';
    const fuelPolicy = car.fuel?.policy || 'N/A';
    const type = car.type || 'N/A';

    // Get active amenities
    const activeAmenities = Object.entries(car.amenities || {})
        .filter(([key, value]) => value === true)
        .map(([key]) => key.replace('has', ''));

    return (
        <Link to={`/cars/${car._id}`} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                    <img 
                        src={mainPhoto} 
                        alt={model}
                        className="w-full h-full object-cover"
                    />
                    {car.type && (
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
                            {car.type}
                        </div>
                    )}
                    {car.status === "maintenance" && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                            Under Maintenance
                        </div>
                    )}
                </div>
                
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{make} {model}</h3>
                        <div className="flex items-center">
                            <FaUsers className="mr-1" />
                            <span className="text-sm text-gray-600">{car.numberplaces} seats</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{city}, {car.location?.region}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
                        <div className="flex items-center">
                            <FaGasPump className="mr-1" />
                            <span>{fuelPolicy}</span>
                        </div>
                        <div className="flex items-center">
                            <FaCog className="mr-1" />
                            <span>{transmission}</span>
                        </div>
                        <div className="flex items-center">
                            <span>{car.fuel?.type}</span>
                        </div>
                    </div>

                    {activeAmenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {activeAmenities.slice(0, 3).map((amenity, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    {amenity}
                                </span>
                            ))}
                            {activeAmenities.length > 3 && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    +{activeAmenities.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold text-primary">{price} MAD/day</p>
                        <span className="text-sm text-gray-600">
                            Min. {car.rentalTerms?.minimumPeriod} days
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard; 