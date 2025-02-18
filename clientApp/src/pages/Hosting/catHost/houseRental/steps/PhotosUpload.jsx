import { useState } from 'react';
import imageCompression from 'browser-image-compression'; // You'll need to install this package

const PhotosUpload = ({ propertyData, setPropertyData }) => {
    const [uploadError, setUploadError] = useState('');
    const MIN_PHOTOS = 5;
    const MAX_PHOTOS = 15;
    const MAX_FILE_SIZE_MB = 5;
    
    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1, // Compress to 1MB
            maxWidthOrHeight: 1920, // Max dimension
            useWebWorker: true
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw new Error('Failed to compress image');
        }
    };

    const validateFile = (file) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            return 'Please upload only image files';
        }

        // Check file size (before compression)
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `File size should not exceed ${MAX_FILE_SIZE_MB}MB`;
        }

        return null;
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        const currentPhotosCount = propertyData.property_details.photos.length;
        setUploadError('');

        // Check total number of photos
        if (currentPhotosCount + files.length > MAX_PHOTOS) {
            setUploadError(`You can upload maximum ${MAX_PHOTOS} photos`);
            return;
        }

        // Validate each file
        for (const file of files) {
            const error = validateFile(file);
            if (error) {
                setUploadError(error);
                return;
            }
        }

        try {
            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    const compressed = await compressImage(file);
                    return URL.createObjectURL(compressed);
                })
            );

            setPropertyData({
                ...propertyData,
                property_details: {
                    ...propertyData.property_details,
                    photos: [...propertyData.property_details.photos, ...compressedFiles]
                }
            });
        } catch (error) {
            setUploadError('Error processing images. Please try again.');
        }
    };

    const removePhoto = (index) => {
        const updatedPhotos = propertyData.property_details.photos.filter((_, i) => i !== index);
        setPropertyData({
            ...propertyData,
            property_details: {
                ...propertyData.property_details,
                photos: updatedPhotos
            }
        });
    };

    const remainingPhotos = MIN_PHOTOS - propertyData.property_details.photos.length;
    const isMinPhotosUploaded = propertyData.property_details.photos.length >= MIN_PHOTOS;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Add photos of your property</h2>
            
            {/* Photo Requirements */}
            <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Photo Requirements:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Minimum {MIN_PHOTOS} photos required</li>
                    <li>Maximum {MAX_PHOTOS} photos allowed</li>
                    <li>Maximum file size: {MAX_FILE_SIZE_MB}MB per image</li>
                    <li>Accepted formats: JPG, PNG</li>
                </ul>
            </div>

            {/* Upload Progress */}
            <div className="bg-white p-4 rounded-md border">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Upload Progress</span>
                    <span className="text-sm text-gray-500">
                        {propertyData.property_details.photos.length} of {MAX_PHOTOS} photos
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className={`h-2.5 rounded-full transition-all ${
                            isMinPhotosUploaded ? 'bg-green-500' : 'bg-blue'
                        }`}
                        style={{ 
                            width: `${(propertyData.property_details.photos.length / MAX_PHOTOS) * 100}%` 
                        }}
                    ></div>
                </div>
                {!isMinPhotosUploaded && (
                    <p className="text-blue mt-2 text-sm font-medium">
                        {remainingPhotos} more {remainingPhotos === 1 ? 'photo' : 'photos'} needed to continue
                    </p>
                )}
            </div>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                />
                <label 
                    htmlFor="photo-upload"
                    className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-md
                        ${propertyData.property_details.photos.length >= MAX_PHOTOS 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue text-white hover:bg-blue/90'}`}
                    onClick={(e) => {
                        if (propertyData.property_details.photos.length >= MAX_PHOTOS) {
                            e.preventDefault();
                        }
                    }}
                >
                    Upload Photos
                </label>
                {uploadError && (
                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
            </div>
            
            {/* Photos Preview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {propertyData.property_details.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                        <img 
                            src={photo} 
                            alt={`Property ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-md"
                        />
                        <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove photo"
                        >
                            ×
                        </button>
                        {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-blue text-white text-xs px-2 py-1 rounded">
                                Cover Photo
                            </span>
                        )}
                        <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Photo {index + 1}
                        </span>
                    </div>
                ))}
                {/* Empty Photo Slots */}
                {remainingPhotos > 0 && Array.from({ length: remainingPhotos }).map((_, index) => (
                    <div 
                        key={`empty-${index}`} 
                        className="border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center"
                    >
                        <span className="text-gray-400 text-sm">
                            Photo {propertyData.property_details.photos.length + index + 1}
                        </span>
                    </div>
                ))}
            </div>

            {/* Status Message */}
            {isMinPhotosUploaded ? (
                <p className="text-green-500 text-sm">
                    ✓ Minimum photo requirement met
                </p>
            ) : (
                <p className="text-red-500 text-sm">
                    Please upload {remainingPhotos} more {remainingPhotos === 1 ? 'photo' : 'photos'} to continue
                </p>
            )}
        </div>
    );
};

export default PhotosUpload; 