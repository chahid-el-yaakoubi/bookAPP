import { useState, useEffect, useMemo } from 'react';
import { 
    FaPlus, 
    FaMinus, 
    FaHome, 
    FaBuilding, 
    FaHotel, 
    FaCrown,
    FaCheckCircle,  // Added for success icon
    FaMapMarkerAlt, // For view type
    FaCalendar,     // For year built
    FaRulerCombined // For property size
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions';

const PropertyTypeForm = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    // Enhanced property categories and types with improved organization and more icon variety
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
          { id: 'cabin', label: 'Cabin', icon: '🌲' }
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

    // Optimized state initialization with custom hook pattern
    const [formState, setFormState] = useState({
        selectedCategory: Object.keys(propertyTypes).find(key =>
            propertyTypes[key]?.some(type => type.id === selectedProperty?.type?.type)
        ) || 'apartment',
        propertyType: selectedProperty?.type?.type || 'rental-unit',
        propertyCategory: selectedProperty?.type?.category || 'apartment',
        listingType: selectedProperty?.type?.listingType || 'Entire place',
        floors: selectedProperty?.type?.floors || 1,
        floorNumber: selectedProperty?.type?.floorNumber || 1,
        yearBuilt: selectedProperty?.type?.yearBuilt || '',
        propertySize: selectedProperty?.type?.size || '',
        sizeUnit: selectedProperty?.type?.sizeUnit || 'sq m',
        viewType: selectedProperty?.type?.viewType || 'oceanView',
        showSuccess: false,
        successTimeout: null
    });

    // Destructure state for easier access
    const {
        selectedCategory, propertyType, propertyCategory, listingType,
        floors, floorNumber, yearBuilt, propertySize, sizeUnit, viewType,
        showSuccess, successTimeout
    } = formState;

    // Helper function to update specific form fields
    const updateFormField = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (successTimeout) clearTimeout(successTimeout);
        };
    }, [successTimeout]);

    // Smart update algorithm: Update property type based on category selection with optimized logic
    useEffect(() => {
        const typesForCategory = propertyTypes[selectedCategory] || [];
        if (typesForCategory.length > 0 && !typesForCategory.some(type => type.id === propertyType)) {
            const newType = typesForCategory[0].id;
            updateFormField('propertyType', newType);
            
            // Intelligently update propertyCategory based on selected propertyType
            if (['apartment', 'luxury', 'hospitality', 'house'].includes(selectedCategory)) {
                updateFormField('propertyCategory', selectedCategory);
            }
        }
    }, [selectedCategory, propertyType, propertyTypes]);

    // Advanced algorithms for filtering listing types based on property category
    const getFilteredListingTypes = useMemo(() => (category) => {
        // Enhanced algorithm with optimized filtering logic
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

    // Intelligent view type algorithm based on property category with optimized caching
    const getFilteredViewTypes = useMemo(() => (category) => {
        // Enhanced algorithm with view ranking based on property type
        const allViewTypes = {
            'cityView': { id: 'cityView', label: 'City view', score: { apartment: 5, house: 3, luxury: 3 } },
            'oceanView': { id: 'oceanView', label: 'Ocean view', score: { apartment: 4, house: 4, luxury: 5 } },
            'mountainView': { id: 'mountainView', label: 'Mountain view', score: { apartment: 3, house: 4, luxury: 4 } },
            'gardenView': { id: 'gardenView', label: 'Garden view', score: { apartment: 2, house: 5, luxury: 3 } },
            'parkView': { id: 'parkView', label: 'Park view', score: { apartment: 4, house: 2, luxury: 2 } },
            'poolView': { id: 'poolView', label: 'Pool view', score: { apartment: 3, house: 3, luxury: 5 } },
            'valleyView': { id: 'valleyView', label: 'Valley view', score: { apartment: 1, house: 5, luxury: 4 } },
            'noView': { id: 'noView', label: 'No special view', score: { apartment: 1, house: 1, luxury: 0 } }
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

    // Optimized success message handler with debouncing
    const showSuccessMessage = () => {
        updateFormField('showSuccess', true);
        if (successTimeout) clearTimeout(successTimeout);
        const timeout = setTimeout(() => updateFormField('showSuccess', false), 3000);
        updateFormField('successTimeout', timeout);
    };

    // Enhanced save handler with validation
    const handleSave = (e) => {
        e.preventDefault();
        
        // Comprehensive validation
        const validationErrors = [];
        if (!propertyType) validationErrors.push("Property type");
        if (!propertyCategory) validationErrors.push("Property category");
        if (!listingType) validationErrors.push("Listing type");
        
        if (validationErrors.length > 0) {
            alert(`Please fill in the following required fields: ${validationErrors.join(", ")}.`);
            return;
        }
        
        // Build updated property object, skipping hotel-specific fields for hotel properties
        const updatedProperty = {
            ...selectedProperty,
            type: {
                type: propertyType,
                category: selectedCategory,
                listingType: listingType,
                ...(isHotelLike ? {} : {
                    floors,
                    floorNumber,
                    yearBuilt,
                    size: propertySize,
                    sizeUnit,
                    viewType
                })
            }
        };

        dispatch({
            type: UPDATE_PROPERTY,
            payload: { updatedProperty }
        });

        showSuccessMessage();
    };

    // Helper function to get property type label
    const getPropertyTypeLabel = (id) => {
        const type = propertyTypes[selectedCategory]?.find(type => type.id === id);
        return type ? type.label : id;
    };

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-2xl overflow-hidden">
            {/* Hero header */}
            <div className="bg-gradient-to-r from-blue to-indigo-700 py-8 px-6">
                <h1 className="text-3xl font-bold text-white flex items-center">
                    <FaHome className="mr-3" /> Property Details
                </h1>
                <p className="text-blue mt-2">Define the perfect space for your guests</p>
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

            <div className="p-8 space-y-8">
                {/* Property Category Selection - Hero Design */}
                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">Property Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {groupedPropertyTypes.map(group => (
                            <button
                                key={group.id}
                                onClick={() => updateFormField('selectedCategory', group.id)}
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

                {/* Property Type Selection - Hero Design */}
                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Which is most like your place?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(propertyTypes[selectedCategory] || []).map(type => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    updateFormField('propertyType', type.id);
                                    updateFormField('propertyCategory', selectedCategory);
                                }}
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

                {/* Listing Type - Hero Design */}
                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">Listing Type</label>
                    <div className="space-y-3">
                        {getFilteredListingTypes(selectedCategory).map(option => (
                            <button
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
                
                {/* Only display additional fields if not a hotel-type property */}
                {!isHotelLike && (
                    <>
                        <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                            <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-blue" /> View Type
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {getFilteredViewTypes(selectedCategory).map(option => (
                                    <button
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

                        {['apartment', 'house', 'hospitality'].includes(selectedCategory) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Floors in Building */}
                                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                                    <label className="block text-lg font-semibold text-gray-800 mb-4">Building Floors</label>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (floors > 1) {
                                                    const newFloors = floors - 1;
                                                    updateFormField('floors', newFloors);
                                                    // If the current floor number is now greater than the building floors, adjust it
                                                    if (floorNumber > newFloors) {
                                                        updateFormField('floorNumber', newFloors);
                                                    }
                                                }
                                            }}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue transition-all"
                                        >
                                            <FaMinus className="text-xl" />
                                        </button>
                                        <span className="text-3xl font-bold text-gray-700">{floors}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateFormField('floors', floors + 1)}
                                            className="bg-blue hover:bg-blue text-white rounded-full w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue transition-all"
                                        >
                                            <FaPlus className="text-xl" />
                                        </button>
                                    </div>
                                </div>

                                {/* Floor Number */}
                                <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                                    <label className="block text-lg font-semibold text-gray-800 mb-4">Listing Floor</label>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => floorNumber > 1 && updateFormField('floorNumber', floorNumber - 1)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue transition-all"
                                        >
                                            <FaMinus className="text-xl" />
                                        </button>
                                        <span className="text-3xl font-bold text-gray-700">{floorNumber}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Ensure floor number doesn't exceed total floors
                                                if (floorNumber < floors) {
                                                    updateFormField('floorNumber', floorNumber + 1);
                                                }
                                            }}
                                            className={`${floorNumber < floors ? 'bg-blue hover:bg-blue text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-full w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue transition-all`}
                                        >
                                            <FaPlus className="text-xl" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Year Built */}
                            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                                <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaCalendar className="mr-2 text-blue" /> Year Built
                                </label>
                                <input
                                    type="text"
                                    value={yearBuilt}
                                    onChange={(e) => updateFormField('yearBuilt', e.target.value)}
                                    placeholder="When was the property built?"
                                    className="w-full py-4 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue text-lg transition-all"
                                />
                            </div>

                            {/* Property Size */}
                            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                                <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FaRulerCombined className="mr-2 text-blue" /> Property Size
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={propertySize}
                                        onChange={(e) => updateFormField('propertySize', e.target.value)}
                                        placeholder="Size"
                                        className="block w-2/3 py-4 px-4 border border-gray-300 bg-white rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue text-lg transition-all"
                                    />
                                    <div className="relative w-1/3">
                                        <select
                                            value={sizeUnit}
                                            onChange={(e) => updateFormField('sizeUnit', e.target.value)}
                                            className="block w-full h-full py-4 px-4 border border-gray-300 bg-white rounded-r-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue text-lg appearance-none transition-all"
                                        >
                                            <option value="sq ft">sq ft</option>
                                            <option value="sq m">sq m</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-3">The amount of indoor space available to guests.</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Save Button - Hero Style */}
                <div className="mt-10 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-8 py-4 bg-gradient-to-r from-blue to-indigo-700 text-white text-lg font-bold rounded-lg hover:from-blue hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
                    >
                        Save Property Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyTypeForm;