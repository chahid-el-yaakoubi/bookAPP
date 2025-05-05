import { useState, useEffect, useMemo } from 'react';
import {
    FaPlus,
    FaMinus,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaCalendar,
    FaRulerCombined
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectProperty } from '../../../../../../../redux/actions/propertyActions';
import axios from 'axios';
import { updateProperty } from '../../../../../../../Lib/api';

const PropertyTypeForm = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    // All property types in a flat array with category tags
    const allPropertyTypes = useMemo(() => [
        { id: 'studio', label: 'Studio', icon: '🏙️', category: 'apartment' },
        { id: 'apartment', label: 'Apartment', icon: '🏙️', category: 'apartment' },
        { id: 'villa', label: 'Villa', icon: '🏡', category: 'house' },
        { id: 'house', label: 'House', icon: '🏡', category: 'house' },
        { id: 'guesthouse', label: 'Guesthouse (Maison d’hôtes)', icon: '🏠', category: 'hotel' },
        { id: 'hotel', label: 'Hotel', icon: '🏨', category: 'hotel' },
    ], []);

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
        propertyType: selectedProperty?.type?.type || '',
        propertyCategory: selectedProperty?.type?.category || '',
        listingType: selectedProperty?.type?.listingType || '',
        floors: selectedProperty?.type?.floors || 1,
        floorNumber: selectedProperty?.type?.floorNumber || 1,
        yearBuilt: selectedProperty?.type?.yearBuilt || '',
        propertySize: selectedProperty?.type?.size || '',
        sizeUnit: selectedProperty?.type?.sizeUnit || 'sq m',
        viewType: selectedProperty?.type?.viewType || [],
        showSuccess: false,
        successTimeout: null
    });

    // Destructure state
    const {
        activeFilter, propertyType, propertyCategory, listingType,
        floors, floorNumber, yearBuilt, propertySize, sizeUnit, viewType,
        showSuccess, successTimeout
    } = formState;

    // Helper function to update form fields
    const updateFormField = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (successTimeout) clearTimeout(successTimeout);
        };
    }, [successTimeout]);

    // Update category when selecting property type
    const selectPropertyType = (type) => {
        updateFormField('propertyType', type.id);
        updateFormField('propertyCategory', type.category);
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
            { id: 'cityView', label: 'City view' },                 // منظر المدينة
            { id: 'oceanView', label: 'Ocean view' },               // منظر المحيط
            { id: 'seaView', label: 'Sea view' },                   // منظر البحر
            { id: 'mountainView', label: 'Mountain view' },         // منظر الجبال
            { id: 'gardenView', label: 'Garden view' },             // منظر الحديقة
            { id: 'parkView', label: 'Park view' },                 // منظر المنتزه
            { id: 'poolView', label: 'Pool view' },                 // منظر المسبح
            { id: 'valleyView', label: 'Valley view' },             // منظر الوادي
            { id: 'desertView', label: 'Desert view' },             // منظر الصحراء (مثلاً في مرزوكة أو زاكورة)
            { id: 'kasbahView', label: 'Kasbah view' },             // منظر القصبة (شائع في الجنوب المغربي)
            { id: 'forestView', label: 'Forest view' },             // منظر الغابة
            { id: 'riverView', label: 'River view' },               // منظر النهر
            { id: 'lakeView', label: 'Lake view' },                 // منظر البحيرة (مثلاً بنصميم أو إفران)
            { id: 'harborView', label: 'Harbor view' },             // منظر الميناء
            { id: 'medinaView', label: 'Medina (Old Town) view' },  // منظر المدينة القديمة
            { id: 'mountainVillageView', label: 'Berber village view' }, // منظر قرية جبلية
            { id: 'streetView', label: 'Street view' },             // منظر الشارع
            { id: 'courtyardView', label: 'Courtyard view' },       // منظر الفناء الداخلي (شائع في الرياض)
            { id: 'noView', label: 'No special view' }              // لا يوجد منظر خاص
        ];
          
        return allViewTypes;
    }, []);

    // Toggle view type selection (add or remove from array)
    const toggleViewType = (viewId) => {
        // Special case for "No special view" - selecting it clears all other selections
        if (viewId === 'noView') {
            updateFormField('viewType', ['noView']);
            return;
        }

        // If "No special view" was previously selected, remove it
        let updatedViews = viewType.filter(v => v !== 'noView');
        
        // Toggle the selected view
        if (updatedViews.includes(viewId)) {
            updatedViews = updatedViews.filter(v => v !== viewId);
        } else {
            updatedViews.push(viewId);
        }
        
        // If no views are selected after removing one, add "No special view"
        if (updatedViews.length === 0) {
            updatedViews = ['noView'];
        }
        
        updateFormField('viewType', updatedViews);
    };

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
    const handleSave = async (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = [];
        if (!propertyType) validationErrors.push("Property type");
        if (!propertyCategory) validationErrors.push("Property category");
        if (!listingType) validationErrors.push("Listing type");
        if (!isHotelLike && (!viewType || viewType.length === 0)) validationErrors.push("View type");

        if (validationErrors.length > 0) {
            alert(`Please fill in the following required fields: ${validationErrors.join(", ")}.`);
            return;
        }

        // Build property object
        const updatedProperty = {
            type: {
                type: propertyType,
                category: propertyCategory,
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

        const res = await updateProperty(selectedProperty?._id, updatedProperty);

        if (res.status === 200) {
            dispatch(selectProperty(res.data));
        }
        showSuccessMessage();
    };

    return (
        <div className="mx-auto bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="bg-primary py-4 px-4">
                <h1 className="text-xl font-medium text-white">Property Details</h1>
            </div>

            {/* Success message */}
            {showSuccess && (
                <div className="fixed top-10 right-20 m-4 bg-green-500 border-l-4 border-blue text-gray-100 p-3 rounded z-50">
                    <div className="flex items-center">
                        <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-sm">Property details saved successfully.</p>
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
                                className={`px-4 py-2 whitespace-nowrap text-sm font-medium rounded-t-lg ${activeFilter === category.id
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
                                className={`flex items-center p-3 rounded-lg ${propertyType === type.id
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
                                        onClick={() => updateFormField('listingType', option.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg ${listingType === option.id
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
                                    <label className={`block text-base font-medium mb-3 flex items-center ${viewType && viewType.length > 0 ? 'text-gray-700' : 'text-red-500'}`}>
                                        <FaMapMarkerAlt className="mr-2 text-blue" /> View Types (Select all that apply)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {getFilteredViewTypes(propertyCategory).map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => toggleViewType(option.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg ${viewType.includes(option.id)
                                                    ? 'bg-blue text-white'
                                                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span>{option.label}</span>
                                                {viewType.includes(option.id) && (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        {viewType && viewType.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="font-medium">Selected views:</span>
                                                {viewType.map(v => {
                                                    const viewOption = getFilteredViewTypes(propertyCategory).find(opt => opt.id === v);
                                                    return (
                                                        <span key={v} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                            {viewOption?.label || v}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {['apartment', 'house', 'hotel'].includes(propertyCategory) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Floors in Building */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Building Floors</label>
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (floors > 1) {
                                                            const newFloors = floors - 1;
                                                            updateFormField('floors', newFloors);
                                                            if (floorNumber > newFloors) {
                                                                updateFormField('floorNumber', newFloors);
                                                            }
                                                        }
                                                    }}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="text-xl font-medium text-gray-700">{floors}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateFormField('floors', floors + 1)}
                                                    className="bg-blue hover:bg-blue text-white rounded-full w-8 h-8 flex items-center justify-center"
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Floor Number */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Floor</label>
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => floorNumber > 1 && updateFormField('floorNumber', floorNumber - 1)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="text-xl font-medium text-gray-700">{floorNumber}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (floorNumber < floors) {
                                                            updateFormField('floorNumber', floorNumber + 1);
                                                        }
                                                    }}
                                                    className={`${floorNumber < floors ? 'bg-blue hover:bg-blue text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-full w-8 h-8 flex items-center justify-center`}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Property Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <FaRulerCombined className="mr-2 text-blue" /> Property Size
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={propertySize}
                                                onChange={(e) => updateFormField('propertySize', e.target.value)}
                                                placeholder="Size"
                                                className="block w-2/3 py-2 px-3 border border-gray-300 rounded-l-lg"
                                            />
                                            <select
                                                value={sizeUnit}
                                                onChange={(e) => updateFormField('sizeUnit', e.target.value)}
                                                className="block w-1/3 py-2 px-3 border border-gray-300 rounded-r-lg appearance-none bg-white"
                                            >
                                                <option value="sq ft">sq ft</option>
                                                <option value="sq m">sq m</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Save Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full py-3 bg-blue text-white font-medium rounded-lg hover:bg-blue"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyTypeForm;