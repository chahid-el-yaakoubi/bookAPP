import { useState, useEffect, useMemo } from 'react';
import {
    FaPlus,
    FaMinus,
    FaCheckCircle,
    FaMapMarkerAlt,
} from 'react-icons/fa';

const PropertyTypeForm = ({ propertyData, setPropertyData }) => {
    // All property types in a flat array with category tags
    const allPropertyTypes = useMemo(() => [
        { id: 'studio', label: 'Studio', icon: '🏙️', category: 'apartment' },
        { id: 'apartment', label: 'Apartment', icon: '🏙️', category: 'apartment' },
        { id: 'villa', label: 'Villa', icon: '🏡', category: 'house' },
        { id: 'house', label: 'House', icon: '🏡', category: 'house' },
        { id: 'guesthouse', label: "Guesthouse (Maison d'hôtes)", icon: '🏠', category: 'hotel' },
        { id: 'hotel', label: 'Hotel', icon: '🏨', category: 'hotel' },
    ].sort((a, b) => a.label.localeCompare(b.label)), []);
    
    // Categories for filtering
    const categories = useMemo(() => [
        { id: 'all', label: 'All Property Types' },
        { id: 'apartment', label: 'Apartments' },
        { id: 'house', label: 'Houses' },
        { id: 'hotel', label: 'Hotels' },
    ], []);

    // Initialize form state
    const [formState, setFormState] = useState({
        activeFilter: 'all',
        floors: 2,
        floorNumber: 1,
        yearBuilt: '',
        propertySize: '',
        sizeUnit: 'sq m',
        showSuccess: false,
        successTimeout: null
    });

    // Destructure state
    const {
        activeFilter, floors, floorNumber, showSuccess, successTimeout
    } = formState;

    // Destructure propertyData
    const { type } = propertyData;
    const { type: propertyType, category: propertyCategory, listingType, viewType } = type || {};

    // Helper function to update form fields
    const updateFormField = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    // Helper function to update propertyData
    const updatePropertyData = (field, value) => {
        setPropertyData(prev => ({
            ...prev,
            type: {
                ...prev.type,
                [field]: value
            }
        }));
    };

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (successTimeout) clearTimeout(successTimeout);
        };
    }, [successTimeout]);

    // Update category when selecting property type
    const selectPropertyType = (type) => {
        setPropertyData(prev => ({
            ...prev,
            type: {
                ...prev.type,
                type: type.id,
                category: type.category
            }
        }));
    };

    // Filtered property types based on active filter
    const filteredPropertyTypes = useMemo(() => {
        if (activeFilter === 'all') {
            return allPropertyTypes;
        }
        return allPropertyTypes.filter(type => type.category === activeFilter);
    }, [activeFilter, allPropertyTypes]);

    // Get listing types based on property category
    const getFilteredListingTypes = useMemo(() => (category) => {
        const baseTypes = [
            { id: 'Entire place', label: 'Entire place' },
            { id: 'Private room', label: 'Private room' },
            { id: 'Shared room', label: 'Shared room' },
        ];

        if (category === 'hotel') {
            return [
                { id: 'Hotel room', label: 'Hotel room' },
                ...baseTypes.slice(0, 2)
            ];
        }
        return baseTypes;
    }, []);

    // Get view types based on property category
    const getFilteredViewTypes = useMemo(() => (category) => {
        const allViewTypes = [
            { id: 'cityView', label: 'City view' },
            { id: 'oceanView', label: 'Ocean view' },
            { id: 'mountainView', label: 'Mountain view' },
            { id: 'gardenView', label: 'Garden view' },
            { id: 'parkView', label: 'Park view' },
            { id: 'poolView', label: 'Pool view' },
            { id: 'valleyView', label: 'Valley view' },
            { id: 'noView', label: 'No special view' }
        ];

        return allViewTypes;
    }, []);

    // Check if property is hotel-like
    const isHotelLike = useMemo(() => {
        const hotelTypes = ['hotel', 'guesthouse', 'hostel', 'boutique-hotel'];
        return hotelTypes.includes(propertyType) || listingType === 'Hotel room';
    }, [propertyType, listingType]);

    // Show success message 
    const showSuccessMessage = () => {
        updateFormField('showSuccess', true);
        if (successTimeout) clearTimeout(successTimeout);
        const timeout = setTimeout(() => updateFormField('showSuccess', false), 3000);
        updateFormField('successTimeout', timeout);
    };

    // Save handler with validation
    const handleSave = (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = [];
        if (!propertyType) validationErrors.push("Property type");
        if (!propertyCategory) validationErrors.push("Property category");
        if (!listingType) validationErrors.push("Listing type");
        if (!isHotelLike && !viewType) validationErrors.push("View type");

        if (validationErrors.length > 0) {
            alert(`Please fill in the following required fields: ${validationErrors.join(", ")}.`);
            return;
        }

        // Update property data with additional fields for non-hotel properties
        if (!isHotelLike) {
            setPropertyData(prev => ({
                ...prev,
                type: {
                    ...prev.type,
                    yearBuilt: formState.yearBuilt,
                    propertySize: formState.propertySize,
                    sizeUnit: formState.sizeUnit
                }
            }));
        }

        showSuccessMessage();
    };

    return (
        <div className="mx-auto bg-white rounded-lg shadow-md mb-20">
            {/* Header */}
            <div className="bg-primary py-4 px-4">
                <h1 className="text-xl font-medium text-white">Property Details</h1>
            </div>

            {/* Success message */}
            {showSuccess && (
                <div className="fixed top-4 right-4 m-4 bg-green-500 border-l-4 border-green-700 text-white p-4 rounded-md shadow-lg z-50">
                    <div className="flex items-center">
                        <FaCheckCircle className="h-5 w-5 text-white mr-2" />
                        <p className="text-sm font-medium">Property details saved successfully.</p>
                    </div>
                </div>
            )}

            <div className="p-4 space-y-6">
                {/* Filter tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex flex-nowrap overflow-x-auto pb-1 gap-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => updateFormField('activeFilter', category.id)}
                                className={`px-4 py-2 whitespace-nowrap text-sm font-medium rounded-t-lg transition-colors duration-200 ${activeFilter === category.id
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Type Selection - Simple grid */}
                <div>
                    <label className={`block text-base font-medium mb-3 ${propertyType ? 'text-gray-700' : 'text-red-500'}`}>
                        Which is most like your place?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredPropertyTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => selectPropertyType(type)}
                                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${propertyType === type.id
                                    ? 'bg-blue text-white'
                                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl mr-3">{type.icon}</span>
                                <span>{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {propertyType && (
                    <>
                        {/* Listing Type */}
                        <div>
                            <label className={`block text-base font-medium mb-3 ${listingType ? 'text-gray-700' : 'text-red-500'}`}>
                                Listing Type
                            </label>
                            <div className="space-y-2">
                                {getFilteredListingTypes(propertyCategory).map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => updatePropertyData('listingType', option.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${listingType === option.id
                                            ? 'bg-blue text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {listingType === option.id && (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional fields for non-hotel properties */}
                        {!isHotelLike && (
                            <>
                                <div>
                                    <label className={`block text-base font-medium mb-3 flex items-center ${viewType ? 'text-gray-700' : 'text-red-500'}`}>
                                        <FaMapMarkerAlt className="mr-2 text-blue" /> View Type
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {getFilteredViewTypes(propertyCategory).map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => updatePropertyData('viewType', option.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${viewType === option.id
                                                    ? 'bg-blue text-white'
                                                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span>{option.label}</span>
                                                {viewType === option.id && (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
 
 
                            </>
                        )}
                    </>
                )}

               
            </div>
        </div>
    );
};

export default PropertyTypeForm;