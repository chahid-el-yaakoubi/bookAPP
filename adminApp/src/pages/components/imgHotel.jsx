import React, { useState, useEffect } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { ImageGallery } from "./ImageGallery";

const ImgHotel = ({ hotelId , type}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

   


    let api = "house-rentals" ;

    if(type === "hotel"){
        api = "hotels"
    }else if(type === "shops"){
        api = "shops" ;
    }else if(type === "cars"){
        api = "cars"
    }


    const { data: hotel, reFetch } = useFetch(`/api/${api}/find/${hotelId}`);


  
    useEffect(() => {
        const fetchHotelImages = async () => {
            try {
                if (hotel && hotel.photos) {
                    setImages(hotel.photos);
                }
            } catch (error) {
                setError('Failed to fetch images');
                console.error('Error fetching hotel images:', error);
            }
        };

        fetchHotelImages();

        return () => {
            setImages([]);
            setError(null);
        };
    }, [hotel]);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            alert('Some files were rejected. Please ensure all files are images under 5MB.');
        }

        setSelectedFiles(validFiles);
    };

    const handleDeleteImage = async (imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.delete(`/api/${api}/${hotelId}/photos`, {
                data: { images: [imageUrl] }
            });

            if (response.data.success) {
                // setImages(response.data.hotel.photos);
                setShowSuccess(true);
                reFetch()

                setTimeout(() => setShowSuccess(false), 2000);
            } else {
                throw new Error(response.data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error deleting image:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('Failed to delete image: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0 || isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();

            console.log(1)

            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            console.log(2)


            const response = await axios.post(`/api/${api}/${hotelId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log(3)


            if (response.data.success) {
            console.log(4)

                // setImages(response.data.hotel.photos);
                setShowModal(false);
                setSelectedFiles([]);
                setShowSuccess(true);
                reFetch()

                setTimeout(() => setShowSuccess(false), 3000);
            console.log(5)

            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            alert('Failed to upload images: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                Add New Image
            </button>

            <div>
                <ImageGallery photos={images} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

                {images && images.length > 0 ? (
                    images.map((img, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={img}
                                alt={`Hotel ${index + 1}`}
                                className="w-full h-36 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleDeleteImage(img)}
                                    disabled={isLoading}
                                    className={`p-2 bg-red-500 text-white rounded-md hover:bg-red-600 
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No images available</p>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Images</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                id="fileInput"
                            />
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-gray-600 font-medium">Click to upload images</span>
                                <span className="text-gray-400 text-sm mt-1">Maximum file size: 5MB</span>
                            </label>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Selected files:</h3>
                                <div className="max-h-32 overflow-y-auto">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between py-2">
                                            <span className="text-sm text-gray-600 truncate">{file.name}</span>
                                            <span className="text-xs text-gray-400">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isLoading || selectedFiles.length === 0}
                                className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2
                                    ${isLoading || selectedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    'Upload Images'
                                )}
                            </button>
                        </div>
                    </div>


                </div>
            )}

            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold mb-2">Success</h2>
                        <p>Operation completed successfully!</p>
                    </div>
                </div>
            )}
        </div>


    );
};

export default ImgHotel;