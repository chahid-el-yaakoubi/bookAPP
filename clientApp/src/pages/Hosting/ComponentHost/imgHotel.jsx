import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { selectProperty } from "../../../redux/actions/propertyActions";
import { useDispatch } from "react-redux";

const ImgHotel = ({ hotelId, type, showModal, setShowModal, path, refrech, reFetch }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesPreviews, setSelectedFilesPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

 
    let api = "hotels";

    if(path === "rooms"){
        api = "rooms"
    }else if(path === "shops"){
        api = "shops";
    }else if(path === "cars"){
        api = "cars"
    }

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

        // Create image previews
        const previews = validFiles.map(file => URL.createObjectURL(file));

        setSelectedFiles(validFiles);
        setSelectedFilesPreviews(previews);
    };

    const handleRemoveImage = (indexToRemove) => {
        // Remove image from selected files and previews
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        const updatedPreviews = selectedFilesPreviews.filter((_, index) => index !== indexToRemove);

        setSelectedFiles(updatedFiles);
        setSelectedFilesPreviews(updatedPreviews);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0 || isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();

            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            formData.append('type', type);

            const response = await axios.post(`/api/${api}/${hotelId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                reFetch?.();
                setShowModal(false);
                setSelectedFiles([]);
                setSelectedFilesPreviews([]);
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

    // Clean up preview URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            selectedFilesPreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [selectedFilesPreviews]);

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg animate-slide-scale">
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

                        {selectedFilesPreviews.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Selected images:</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {selectedFilesPreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
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
                                className={`px-6 py-2.5 bg-blue text-white rounded-lg flex items-center gap-2
                                    ${isLoading || selectedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue'}`}
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


        </>
    );
};

export default ImgHotel;