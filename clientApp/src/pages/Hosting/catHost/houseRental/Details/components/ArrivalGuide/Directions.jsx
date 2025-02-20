import { useState } from 'react';
import { FaMapMarkerAlt, FaCar, FaPlane, FaTrain, FaBus, 
         FaParking, FaImage, FaUpload } from 'react-icons/fa';

const Directions = () => {
    const [address, setAddress] = useState('');
    const [parkingInstructions, setParkingInstructions] = useState('');
    const [transportationDetails, setTransportationDetails] = useState({
        car: '',
        publicTransport: '',
        airport: ''
    });
    const [photos, setPhotos] = useState([]);

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        setPhotos([...photos, ...newPhotos]);
    };

    const removePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Directions</h2>
            <p className="text-gray-600 mb-6">
                Help guests find your property easily with detailed directions.
            </p>

            <div className="space-y-6">
                {/* Property Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Address
                    </label>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="Full property address"
                        />
                    </div>
                </div>

                {/* Transportation Options */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Transportation Details</h3>
                    
                    {/* By Car */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaCar className="inline-block mr-2" />
                            Driving Directions
                        </label>
                        <textarea
                            value={transportationDetails.car}
                            onChange={(e) => setTransportationDetails({
                                ...transportationDetails,
                                car: e.target.value
                            })}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                            placeholder="Provide detailed driving directions..."
                        />
                    </div>

                    {/* Public Transportation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaBus className="inline-block mr-2" />
                            Public Transportation
                        </label>
                        <textarea
                            value={transportationDetails.publicTransport}
                            onChange={(e) => setTransportationDetails({
                                ...transportationDetails,
                                publicTransport: e.target.value
                            })}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                            placeholder="Describe public transportation options..."
                        />
                    </div>

                    {/* From Airport */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaPlane className="inline-block mr-2" />
                            From Airport
                        </label>
                        <textarea
                            value={transportationDetails.airport}
                            onChange={(e) => setTransportationDetails({
                                ...transportationDetails,
                                airport: e.target.value
                            })}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                            placeholder="Directions from nearest airport..."
                        />
                    </div>
                </div>

                {/* Parking Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaParking className="inline-block mr-2" />
                        Parking Instructions
                    </label>
                    <textarea
                        value={parkingInstructions}
                        onChange={(e) => setParkingInstructions(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                        placeholder="Provide parking details and instructions..."
                    />
                </div>

                {/* Photo Upload */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Location Photos</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                            <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide uppercase border border-dashed border-gray-400 cursor-pointer hover:bg-blue/5">
                                <FaUpload className="w-8 h-8" />
                                <span className="mt-2 text-base leading-normal">Upload photos</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                            </label>
                        </div>

                        {photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={photo.url}
                                            alt={`Location photo ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Directions; 