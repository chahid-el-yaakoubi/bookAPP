import { useState, useEffect } from 'react';
import { UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions';
import { useDispatch, useSelector } from 'react-redux';

const Description = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    // State for form data
    const [formData, setFormData] = useState({
        listingDescription: selectedProperty?.description?.listingDescription || "",
    });

    // State for UI
    const [charCount, setCharCount] = useState(0);  // Only track the listingDescription length
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success' // 'success' or 'error'
    });

    // Calculate initial character count for listingDescription
    useEffect(() => {
        setCharCount(formData.listingDescription.length);
    }, [formData]);

    // Update form data
    const handleInputChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            listingDescription: value
        }));
        setCharCount(value.length);
        setIsFormChanged(true);
    };

    // Handle form submission
    const handleSubmit = () => {
        try {
            const updatedProperty = {
                ...selectedProperty,
                description: {
                    listingDescription: formData.listingDescription,
                },
            };

            dispatch({
                type: UPDATE_PROPERTY,
                payload: { updatedProperty }
            });

            setIsFormChanged(false);

            // Show success notification
            setNotification({
                show: true,
                message: 'Property description updated successfully!',
                type: 'success'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
        } catch (error) {
            // Show error notification
            setNotification({
                show: true,
                message: 'Something went wrong. Please try again.',
                type: 'error'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
        }
    };

    // Reset form
    const handleCancel = () => {
        if (confirm("Are you sure you want to discard your changes?")) {
            setFormData({
                listingDescription: selectedProperty?.description?.listingDescription || "",
            });
            setCharCount(selectedProperty?.description?.listingDescription.length || 0);
            setIsFormChanged(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[84vh] bg-white">
            {/* Notification */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-md ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {notification.message}
                </div>
            )}



            {/* Right Panel - Details */}
            <div className="w-full md:max-w-4xl mx-auto p-6">
                <div>
                    <h2 className="text-xl font-medium mb-4">Listing Description</h2>
                    <div className="mb-2">
                        <span className="text-sm text-gray-500">
                            {1000 - charCount} characters available
                        </span>
                    </div>
                    <textarea
                        value={formData.listingDescription}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-md min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={1000}
                        placeholder="Describe your property..."
                    />
                    <div className="mt-8 flex justify-between">
                        <button
                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                            onClick={handleCancel}
                            disabled={!isFormChanged}
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md ${isFormChanged ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            onClick={handleSubmit}
                            disabled={!isFormChanged}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Description;
