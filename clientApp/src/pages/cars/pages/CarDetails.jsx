import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/Navbar';
import Footer from '../../../components/footer';
import { FaStar, FaMapMarkerAlt, FaGasPump, FaCog, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaUsers, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(0);

    useEffect(() => {
        const fetchCar = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/cars/find/${id}`);
                if (res.data) {
                    setCar(res.data);
                } else {
                    setError('Car not found');
                }
            } catch (err) {
                console.error('Error fetching car:', err);
                setError(err.response?.data?.message || 'Error loading car details');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="text-center py-20 text-primary font-semibold">Loading car details...</div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="text-center py-20">
                    <div className="text-red-500 font-semibold mb-4">{error}</div>
                    <button 
                        onClick={() => navigate('/cars')}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                    >
                        Back to Cars
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    if (!car) {
        return (
            <>
                <Navbar />
                <div className="text-center py-20">
                    <div className="text-red-500 font-semibold mb-4">Car not found</div>
                    <button 
                        onClick={() => navigate('/cars')}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                    >
                        Back to Cars
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    const photos = car.media?.photos || [];
    const model = car.carDetails?.carModel || 'Unknown Model';
    const make = car.carDetails?.carMake || '';
    const city = car.location?.city || 'Unknown City';
    const price = car.pricing?.dailyRate || 'N/A';

    // Get active features
    const activeFeatures = Object.entries(car.features || {})
        .filter(([key, value]) => value === true && key !== 'additionalFeatures')
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentPhoto((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };
    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentPhoto((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/cars')}
                    className="flex items-center text-primary hover:text-primary/80 mb-6"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Cars
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Photo Gallery */}
                    <div className="lg:col-span-2 relative">
                        {photos.length > 0 ? (
                            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                                <img
                                    src={photos[currentPhoto]}
                                    alt={model}
                                    className="w-full h-full object-cover"
                                />
                                {photos.length > 1 && (
                                    <>
                                        <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 z-10">
                                            <FaChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 z-10">
                                            <FaChevronRight size={20} />
                                        </button>
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full z-10">
                                            {currentPhoto + 1}/{photos.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-[400px] rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No photos available</span>
                            </div>
                        )}
                    </div>

                    {/* Main Information */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold">{make} {model}</h1>
                            {car.status === "Maintenance" && (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                    Under Maintenance
                                </span>
                            )}
                        </div>
                        <div className="flex items-center mb-4">
                            <FaUsers className="mr-2" />
                            <span className="text-gray-600">{car.specifications?.seats} seats</span>
                            <span className="mx-2">•</span>
                            <span className="text-gray-600">{car.category}</span>
                        </div>
                        <p className="text-2xl font-bold text-primary mb-4">{price} MAD/day</p>
                        
                        {/* Location */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="flex items-center text-gray-600 mb-2">
                                <FaMapMarkerAlt className="mr-2" />
                                <span>{city}, {car.location?.region}</span>
                            </div>
                            {car.location?.exactAddress && (
                                <div className="text-gray-600">
                                    <span>Address: {car.location.exactAddress}</span>
                                </div>
                            )}
                            {car.location?.coordinates && (
                                <div className="text-gray-600">
                                    <span>Coordinates: {car.location.coordinates.latitude}, {car.location.coordinates.longitude}</span>
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Specifications</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-600">
                                    <FaCog className="mr-2" />
                                    <span>{car.specifications?.transmission}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaGasPump className="mr-2" />
                                    <span>{car.specifications?.fuel?.type}</span>
                                </div>
                                <div className="text-gray-600">
                                    <span>Fuel Policy: {car.specifications?.fuel?.policy}</span>
                                </div>
                                <div className="text-gray-600">
                                    <span>Plate: {car.carDetails?.plateNumber}</span>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        {activeFeatures.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">Features</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {activeFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-center text-gray-600">
                                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rental Terms */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-3">Rental Terms</h2>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Minimum age: {car.rentalTerms?.minimumAge} years</li>
                                <li>• Minimum rental: {car.rentalTerms?.minimumRentalDays} days</li>
                                <li>• Mileage limit: {car.rentalTerms?.mileageLimit} km/day</li>
                                <li>• Cancellation: {car.rentalTerms?.cancellationPolicy}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CarDetails; 