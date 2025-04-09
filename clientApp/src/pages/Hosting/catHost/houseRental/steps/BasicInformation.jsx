import { useState, useMemo } from 'react';
import { 
    FaHome, 
    FaBuilding, 
    FaHotel, 
    FaCrown,
    FaCheckCircle,
    FaMapMarkerAlt
} from 'react-icons/fa';

const PropertyTypeForm = ({ propertyData, setPropertyData }) => {
    // Enhanced property categories and types with improved organization
    const propertyTypes = useMemo(() => ({
        apartment: [
          { id: 'rental-unit', label: 'Daily Rental Apartment', icon: '🏢' },
          { id: 'studio', label: 'Daily Rental Studio', icon: '🏠' },
          { id: 'penthouse', label: 'Daily Rental Penthouse', icon: '🏙️' },
          { id: 'apartment', label: 'Apartment', icon: '🏢' }
        ],
        house: [
          { id: 'villa', label: 'Daily Rental Villa', icon: '🏡' },
          { id: 'riad', label: 'Daily Rental Traditional Riad', icon: '🏯' },
        ],
        hospitality: [
          { id: 'hotel', label: 'Hotel', icon: '🏨' },
          { id: 'guesthouse', label: 'Guesthouse', icon: '🏠' },
          { id: 'hostel', label: 'Hostel', icon: '🛏️' }
        ],
        luxury: [
          { id: 'luxury-villa', label: 'Luxury Villa for Daily Rental', icon: '✨' },
          { id: 'boutique-hotel', label: 'Boutique Hotel', icon: '🏰' },
          { id: 'boutique', label: 'Boutique', icon: '💎' }
        ]
    }), []);

    // Group property types by category for dropdown organization with icons
    const groupedPropertyTypes = useMemo(() => [
        { label: 'Apartments', id: 'apartment', icon: <FaBuilding /> },
        { label: 'Houses', id: 'house', icon: <FaHome /> },
        { label: 'Hospitality', id: 'hospitality', icon: <FaHotel /> },
        { label: 'Luxury', id: 'luxury', icon: <FaCrown /> }
    ], []);

    // Initialize local form state from propertyData
    const [formState, setFormState] = useState({
        selectedCategory: 'apartment',
        propertyType: propertyData?.type?.type || '',
        propertyCategory: propertyData?.type?.category || '',
        listingType: propertyData?.type?.listingType || 'Entire place',
        viewType: propertyData?.type?.viewType || 'oceanView',
        showSuccess: false
    });

    // Destructure state for easier access
    const {
        selectedCategory, 
        propertyType, 
        propertyCategory, 
        listingType,
        viewType,
        showSuccess
    } = formState;

    // Helper function to update specific form fields and parent state
    const updateFormField = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
        
        // Update parent state using setPropertyData based on which field was changed
        if (field === 'propertyType') {
            setPropertyData(prevData => ({
                ...prevData,
                type: {
                    ...prevData.type,
                    type: value
                }
            }));
        } else if (field === 'propertyCategory' || field === 'selectedCategory') {
            setPropertyData(prevData => ({
                ...prevData,
                type: {
                    ...prevData.type,
                    category: value
                }
            }));
        } else if (field === 'listingType') {
            setPropertyData(prevData => ({
                ...prevData,
                type: {
                    ...prevData.type,
                    listingType: value
                }
            }));
        } else if (field === 'viewType') {
            setPropertyData(prevData => ({
                ...prevData,
                type: {
                    ...prevData.type,
                    viewType: value
                }
            }));
        }
    };

    // Advanced algorithms for filtering listing types based on property category
    const getFilteredListingTypes = useMemo(() => (category) => {
        const baseTypes = [
            { id: 'Entire place', label: 'Entire place' },
            { id: 'Private room', label: 'Private room' },
            { id: 'Shared room', label: 'Shared room' },
        ];
        
        if (category === 'hospitality') {
            return [
                { id: 'Hotel room', label: 'Hotel room' },
                ...baseTypes.slice(0, 2) // Only use first two options from base types
            ];
        }
        return baseTypes;
    }, []);

    // Intelligent view type algorithm based on property category
    const getFilteredViewTypes = useMemo(() => (category) => {
        const allViewTypes = {
            'cityView': { id: 'cityView', label: 'City view', score: { apartment: 5, house: 3, luxury: 3 } },
            'oceanView': { id: 'oceanView', label: 'Ocean view', score: { apartment: 4, house: 4, luxury: 5 } },
            'mountainView': { id: 'mountainView', label: 'Mountain view', score: { apartment: 3, house: 4, luxury: 4 } },
            'gardenView': { id: 'gardenView', label: 'Garden view', score: { apartment: 2, house: 5, luxury: 3 } }
        };
        
        // Filter and sort views based on relevance score for the property category
        const relevantViews = Object.values(allViewTypes)
            .filter(view => view.score[category] > 0)
            .sort((a, b) => b.score[category] - a.score[category]);
            
        return relevantViews;
    }, []);

    // Check if property is hotel-like
    const isHotelLike = useMemo(() => {
        const hotelTypes = ['hotel', 'guesthouse', 'hostel', 'boutique-hotel'];
        return hotelTypes.includes(propertyType) || listingType === 'Hotel room';
    }, [propertyType, listingType]);

    // Simplified save handler with validation
    const handleSave = (e) => {
        e.preventDefault();
        
        // Comprehensive validation
        const validationErrors = [];
        if (!propertyType) validationErrors.push("Property type");
        if (!propertyCategory) validationErrors.push("Property category");
        if (!listingType) validationErrors.push("Listing type");
        if (!isHotelLike && !viewType) validationErrors.push("View type");
        
        if (validationErrors.length > 0) {
            alert(`Please fill in the following required fields: ${validationErrors.join(", ")}.`);
            return;
        }
        
        // Update parent state with all form data at once
        setPropertyData(prevData => ({
            ...prevData,
            type: {
                type: propertyType,
                category: selectedCategory,
                listingType: listingType,
                viewType: !isHotelLike ? viewType : ''
            }
        }));
        
        // Show success message
        setFormState(prev => ({ ...prev, showSuccess: true }));
        setTimeout(() => setFormState(prev => ({ ...prev, showSuccess: false })), 3000);
        
       
    };

    return (
        <div className="mx-auto bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-2xl overflow-hidden mb-20  h-full">
            {/* Hero header */}
            <div className="bg-gradient-to-r from-blue to-indigo-700 py-8 px-6">
                <h1 className="text-3xl font-bold text-white flex items-center">
                    <FaHome className="mr-3" /> Property Details
                </h1>
                <p className="text-black mt-2">Define the perfect space for your guests</p>
            </div>

            {/* Success message */}
            {showSuccess && (
                <div className="m-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-pulse">
                    <div className="flex items-center">
                        <FaCheckCircle className="h-6 w-6 text-green-500 mr-4" />
                        <div>
                            <p className="font-bold">Success!</p>
                            <p className="text-sm">Property details have been updated successfully.</p>
                        </div>
                    </div>
                </div>
            )}

            <form onChange={handleSave} className="p-8 space-y-8">
                {/* Property Category Selection */}
                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">Property Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {groupedPropertyTypes.map(group => (
                            <button
                                type="button"
                                key={group.id}
                                onClick={() => {
                                    updateFormField('selectedCategory', group.id);
                                    updateFormField('propertyCategory', group.id);
                                }}
                                className={`flex items-center justify-center p-4 rounded-lg transition-all ${
                                    selectedCategory === group.id 
                                    ? 'bg-blue text-white shadow-lg transform scale-105' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl mb-2">{group.icon}</span>
                                    <span className="font-medium">{group.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Type Selection */}
                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                    <label className={`block text-lg font-semibold mb-4 ${propertyType ? 'text-gray-800' : 'text-red-500'}`}>
                        Which is most like your place?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(propertyTypes[selectedCategory] || []).map(type => (
                            <button
                                type="button"
                                key={type.id}
                                onClick={() => updateFormField('propertyType', type.id)}
                                className={`flex items-center p-4 rounded-lg transition-all ${
                                    propertyType === type.id 
                                    ? 'bg-blue text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="text-2xl mr-3">{type.icon}</span>
                                <span className="font-medium">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listing Type */}
                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                    <label className={`block text-lg font-semibold mb-4 ${listingType ? 'text-gray-800' : 'text-red-500'}`}>
                        Listing Type
                    </label>
                    <div className="space-y-3">
                        {getFilteredListingTypes(selectedCategory).map(option => (
                            <button
                                type="button"
                                key={option.id}
                                onClick={() => updateFormField('listingType', option.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                                    listingType === option.id 
                                    ? 'bg-blue text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="font-medium">{option.label}</span>
                                {listingType === option.id && (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">Specify how guests will use your property.</p>
                </div>
                
                {/* Only display view type fields if not a hotel-type property */}
                {!isHotelLike && (
                    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                        <label className={`block text-lg font-semibold mb-4 flex items-center ${viewType ? 'text-gray-800' : 'text-red-500'}`}>
                            <FaMapMarkerAlt className="mr-2 text-blue" /> View Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {getFilteredViewTypes(selectedCategory).map(option => (
                                <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => updateFormField('viewType', option.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                                        viewType === option.id 
                                        ? 'bg-blue text-white shadow-md' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="font-medium">{option.label}</span>
                                    {viewType === option.id && (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-3">Select the type of view available from your property.</p>
                    </div>
                )}

                
            </form>
        </div>
    );
};

export default PropertyTypeForm;