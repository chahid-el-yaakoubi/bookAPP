export const CREATE_PROPERTY = 'CREATE_PROPERTY';
export const UPDATE_PROPERTY = 'UPDATE_PROPERTY';
export const REMOVE_PROPERTY = 'REMOVE_PROPERTY';
export const SELECT_PROPERTY = 'SELECT_PROPERTY';
export const ADD_PROPERTY_IMAGES = 'ADD_PROPERTY_IMAGES'; // New action type

export const createProperty = (property) => ({
    type: CREATE_PROPERTY,
    payload: property,
});

export const updateProperty = (property) => ({
    type: UPDATE_PROPERTY,
    payload: property,
});

export const removeProperty = (propertyId) => ({
    type: REMOVE_PROPERTY,
    payload: propertyId,
});

export const selectProperty = (property) => ({
    type: SELECT_PROPERTY,
    payload: property,
});

// New action creator for adding images to a property
export const addPropertyImages = (propertyId, images) => ({
    type: ADD_PROPERTY_IMAGES,
    payload: {
        propertyId,
        images
    }
});