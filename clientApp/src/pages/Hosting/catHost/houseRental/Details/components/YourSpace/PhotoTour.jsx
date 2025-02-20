import { useState } from 'react';
import { FaCamera, FaUpload, FaTrash } from 'react-icons/fa';

const PhotoTour = () => {
    const [photos, setPhotos] = useState([]);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        // Convert files to URLs
        const newPhotos = imageFiles.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        
        setPhotos([...photos, ...newPhotos]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        const newPhotos = imageFiles.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        
        setPhotos([...photos, ...newPhotos]);
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Photo Tour</h2>
            <p className="text-gray-600 mb-6">
                Add photos of your space to attract guests. High-quality photos help
                showcase your property's best features.
            </p>

            {/* Upload area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 
                    ${dragging ? 'border-blue bg-blue/10' : 'border-gray-300'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <FaCamera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                    Drag and drop your photos here, or click to select files
                </p>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={handleFileSelect}
                />
                <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue text-white rounded-md cursor-pointer"
                >
                    <FaUpload className="mr-2" />
                    Upload Photos
                </label>
            </div>

            {/* Photo grid */}
            {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={photo.url}
                                alt={`Property photo ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                                onClick={() => removePhoto(index)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full 
                                         opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoTour; 