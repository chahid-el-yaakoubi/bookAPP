import {
    CREATE_PROPERTY,
    UPDATE_PROPERTY,
    REMOVE_PROPERTY,
    SELECT_PROPERTY,
    ADD_PROPERTY_IMAGES
} from '../actions/propertyActions';
import axios from 'axios';

const initialState = {
    properties: [],
    selectedProperty: null
};

const propertyReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PROPERTY:
            console.log('Creating property at:', '/api/hotels', action.payload);
            axios.post('/api/hotels', action.payload)
                .then(response => {
                    console.log('Property created:', response.data);
                })
                .catch(error => {
                    console.error('Error creating property:', error.response ? error.response.data : error.message);
                });
            return { ...state, properties: [...state.properties, action.payload] };

        case UPDATE_PROPERTY:
            const { updatedProperty } = action.payload;
            const id = updatedProperty._id || updatedProperty.id;
            console.log('Updating property at:', `/api/hotels/${id}`, updatedProperty);
            axios.put(`/api/hotels/${id}`, updatedProperty)
                .then(response => {
                    console.log('Property updated:', response.data);
                })
                .catch(error => {
                    console.error('Error updating property:', error.response ? error.response.data : error.message);
                });
            return {
                ...state,
                properties: state.properties.map(property =>
                    (property.id === updatedProperty.id || property._id === id) ? updatedProperty : property
                ),
                // Update selectedProperty if it matches the updated property
                selectedProperty: state.selectedProperty && 
                    (state.selectedProperty.id === updatedProperty.id || state.selectedProperty._id === id) 
                    ? updatedProperty 
                    : state.selectedProperty
            };

        case REMOVE_PROPERTY:
            return {
                ...state,
                properties: state.properties.filter(property => 
                    property.id !== action.payload && property._id !== action.payload
                ),
                // Clear selectedProperty if it was removed
                selectedProperty: state.selectedProperty && 
                    (state.selectedProperty.id === action.payload || state.selectedProperty._id === action.payload)
                    ? null
                    : state.selectedProperty
            };

        case SELECT_PROPERTY:
            return {
                ...state,
                selectedProperty: action.payload,
            };

        case ADD_PROPERTY_IMAGES:
            const { propertyId, images } = action.payload;
            console.log('Adding images to property:', propertyId, images);
            
            // Make API call to update the property with new images
            axios.post(`/api/hotels/${propertyId}/images`, { images })
                .then(response => {
                    console.log('Property images added:', response.data);
                })
                .catch(error => {
                    console.error('Error adding property images:', error.response ? error.response.data : error.message);
                });

            // Update properties array with new images
            return {
                ...state,
                properties: state.properties.map(property =>
                    (property.id === propertyId || property._id === propertyId)
                        ? { ...property, images: [...(property.images || []), ...images] }
                        : property
                ),
                // Update selectedProperty if it matches the property getting new images
                selectedProperty: state.selectedProperty && 
                    (state.selectedProperty.id === propertyId || state.selectedProperty._id === propertyId)
                    ? { ...state.selectedProperty, images: [...(state.selectedProperty.images || []), ...images] }
                    : state.selectedProperty
            };

        default:
            return state;
    }
};

export default propertyReducer;





