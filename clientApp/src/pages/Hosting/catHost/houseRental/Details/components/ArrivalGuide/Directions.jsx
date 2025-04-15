import { useState } from 'react';
import {
    FaUtensils, FaSubway, FaPlane, FaHotel,
    FaSave, FaUmbrellaBeach, FaShoppingCart, FaWalking,
    FaTimes, FaPlus
} from 'react-icons/fa';
import { selectProperty, UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed
import { useDispatch, useSelector } from 'react-redux';
import { updateProperty } from '../../../../../../../Lib/api';

const Directions = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    // Initialize state with useState - expanded with new categories
    const [nearbyItems, setNearbyItems] = useState({
        restaurants: selectedProperty?.proximities?.restaurants || [],
        publicTransit: selectedProperty?.proximities?.publicTransit || [],
        airports: selectedProperty?.proximities?.airports || [],
        attractions: selectedProperty?.proximities?.attractions || [],
        beaches: selectedProperty?.proximities?.beaches || [],
        bookingPlaces: selectedProperty?.proximities?.bookingPlaces || [],
        walkingRoutes: selectedProperty?.proximities?.walkingRoutes || []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Add a new item to a category
    const addNearbyItem = (category) => {
        setNearbyItems(prev => ({
            ...prev,
            [category]: [
                ...prev[category],
                {
                    id: Date.now().toString(),
                    name: '',
                    distance: '',
                    details: ''
                }
            ]
        }));
    };

    // Update a field of an item
    const updateNearbyItem = (category, id, field, value) => {
        setNearbyItems(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));

        // Clear any error for this field if it was previously set
        if (formErrors[`${category}_${id}_${field}`]) {
            setFormErrors(prev => {
                const updated = { ...prev };
                delete updated[`${category}_${id}_${field}`];
                return updated;
            });
        }
    };

    // Remove an item based on item ID
    const removeNearbyItem = (category, id) => {
        const confirmDelete = window.confirm(`Remove this item from ${category}?`);
        if (!confirmDelete) return;

        setNearbyItems(prev => ({
            ...prev,
            [category]: prev[category].filter(item => item.id !== id)
        }));

        // Clear any errors associated with this item
        setFormErrors(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(key => {
                if (key.includes(`${category}_${id}`)) {
                    delete updated[key];
                }
            });
            return updated;
        });
    };

    // Validate form before saving
    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // Check all items in all categories
        Object.entries(nearbyItems).forEach(([category, items]) => {
            items.forEach(item => {
                if (!item.name || item.name.trim() === '') {
                    errors[`${category}_${item.id}_name`] = 'Name is required';
                    isValid = false;
                }
            });
        });

        setFormErrors(errors);
        return isValid;
    };

    // Handle save
    const handleSave = async (e) => {
        e.preventDefault();

        // Validate the form first
        if (!validateForm()) {
            // Form has errors
            return;
        }

        setIsSaving(true);

        // Filter out items with empty names before saving
        const filteredItems = Object.entries(nearbyItems).reduce((acc, [category, items]) => {
            acc[category] = items.filter(item => item.name && item.name.trim() !== '');
            return acc;
        }, {});

        // Update the property state
        const updatedProperty = {
            proximities: filteredItems
        };

        const res = await updateProperty(selectedProperty?._id, updatedProperty);

        if (res.status === 200) {
            dispatch(selectProperty(res.data));
            setIsSaving(false);

        }
 
        
    };

    // Helper function to render nearby items
    const renderNearbyItems = (category, title, icon) => {
        return (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <h4 className="text-lg font-medium flex items-center text-gray-800">
                        <span className="mr-3 text-gray-600">{icon}</span>
                        {title}
                    </h4>
                    <button
                        type="button"
                        onClick={() => addNearbyItem(category)}
                        className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue transition-colors flex items-center text-sm font-medium"
                    >
                        <FaPlus className="mr-2" size={12} />
                        Add Item
                    </button>
                </div>

                {nearbyItems[category].length === 0 ? (
                    <div className="py-6 text-center bg-gray-50 rounded-md">
                        <p className="text-gray-500">No {title.toLowerCase()} added yet</p>
                        <button
                            onClick={() => addNearbyItem(category)}
                            className="mt-2 text-blue hover:text-blue font-medium text-sm"
                        >
                            + Add your first item
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {nearbyItems[category].map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Name*</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Central Park"
                                        value={item.name}
                                        onChange={(e) => updateNearbyItem(
                                            category,
                                            item.id,
                                            'name',
                                            e.target.value
                                        )}
                                        className={`w-full p-2 border ${formErrors[`${category}_${item.id}_name`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all`}
                                    />
                                    {formErrors[`${category}_${item.id}_name`] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrors[`${category}_${item.id}_name`]}
                                        </p>
                                    )}
                                </div>

                                <div className="md:w-32">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Distance</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2 km"
                                        value={item.distance}
                                        onChange={(e) => updateNearbyItem(
                                            category,
                                            item.id,
                                            'distance',
                                            e.target.value
                                        )}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Details</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Open 24/7, Famous landmark"
                                        value={item.details}
                                        onChange={(e) => updateNearbyItem(
                                            category,
                                            item.id,
                                            'details',
                                            e.target.value
                                        )}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all"
                                    />
                                </div>

                                <div className="self-end mb-1 ml-2">
                                    <button
                                        type="button"
                                        onClick={() => removeNearbyItem(category, item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-200"
                                        aria-label="Remove item"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Define icon sizing and colors consistently
    const iconProps = {
        size: 20,
        className: "min-w-5"
    };

    return (
        <div className="space-y-6 mb-24 shadow-xl p-8 mx-auto">
            {/* What's Nearby Section */}
            <div className="pt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">What's Nearby</h3>
                    <p className="text-gray-600">
                        Help guests discover the neighborhood and nearby amenities. Add important locations that guests might find useful during their stay.
                    </p>
                </div>

                {/* Restaurants & Cafes */}
                {renderNearbyItems('restaurants', 'Restaurants & Cafes', <FaUtensils {...iconProps} className="text-orange-500" />)}

                {/* Beaches */}
                {renderNearbyItems('beaches', 'Beaches (Plages)', <FaUmbrellaBeach {...iconProps} className="text-blue" />)}
                
                {/* Points of Interest */}
                {renderNearbyItems('attractions', 'Points of Interest', <FaHotel {...iconProps} className="text-green-500" />)}
                
                {/* Booking Places */}
                {renderNearbyItems('bookingPlaces', 'Booking Locations', <FaShoppingCart {...iconProps} className="text-purple-500" />)}

                {/* Walking Routes */}
                {renderNearbyItems('walkingRoutes', 'Walking Routes', <FaWalking {...iconProps} className="text-green-700" />)}

                {/* Public Transit */}
                {renderNearbyItems('publicTransit', 'Public Transit', <FaSubway {...iconProps} className="text-blue" />)}

                {/* Airports */}
                {renderNearbyItems('airports', 'Closest Airports', <FaPlane {...iconProps} className="text-gray-600" />)}

                {/* Save Button */}
                <div className="fixed bottom-6 right-6 z-10">
                    <button
                        onClick={handleSave}
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue shadow-lg flex items-center gap-2 transition-all disabled:opacity-70"
                    >
                        {isSaving ? (
                            <>
                                <span className="animate-spin mr-2">⟳</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Directions;