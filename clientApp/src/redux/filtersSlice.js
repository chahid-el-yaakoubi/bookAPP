import { createSlice } from "@reduxjs/toolkit";

// Function to load state from local storage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem(key);
      return storedState ? JSON.parse(storedState) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage", error);
    return defaultValue;
  }
};

// Function to save state to local storage
const saveToLocalStorage = (key, value) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

const initialState = {
  priceRange: { min: 0, max: 5000 },
  amenities: {},
  safety_features: {},
  bookingOptions: {},
  exceptionalProperties: {},
  propertyTypes: {},
  sortByPrice: 'default'
};

const filtersSlice = createSlice({
  name: "filters",
  initialState: loadFromLocalStorage("filters", initialState),
  reducers: {
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.priceRange = { min, max };
      saveToLocalStorage("filters", state);
    },
    toggleAmenity: (state, action) => {
      const amenityId = action.payload;
      // Only add the amenity if true, otherwise remove it
      if (state.amenities[amenityId]) {
        delete state.amenities[amenityId]; // Remove if it exists
      } else {
        state.amenities[amenityId] = true; // Add if it doesn't exist
      }
      saveToLocalStorage("filters", state);
    },
    toggleSafetyFeature: (state, action) => {
      const featureId = action.payload;
      if (state.safety_features[featureId]) {
        delete state.safety_features[featureId];
      } else {
        state.safety_features[featureId] = true;
      }
      saveToLocalStorage("filters", state);
    },
    toggleBookingOption: (state, action) => {
      const optionId = action.payload;
      state.bookingOptions[optionId] = !state.bookingOptions[optionId];
      saveToLocalStorage("filters", state);
    },
    toggleExceptionalProperty: (state, action) => {
      const propertyId = action.payload;
      state.exceptionalProperties[propertyId] = !state.exceptionalProperties[propertyId];
      saveToLocalStorage("filters", state);
    },
    togglePropertyType: (state, action) => {
      const type = action.payload;
      // Convert to lowercase for consistent comparisons
      const normalizedType = typeof type === 'string' ? type.toLowerCase() : type;
      state.propertyTypes[normalizedType] = !state.propertyTypes[normalizedType];
      saveToLocalStorage("filters", state);
    },
    setSortByPrice: (state, action) => {
      state.sortByPrice = action.payload;
      saveToLocalStorage("filters", state);
    },
    clearFilters: (state) => {
      state.priceRange = { min: 0, max: 5000 };
      state.amenities = {};
      state.safety_features = {};
      state.bookingOptions = {};
      state.exceptionalProperties = {};
      state.propertyTypes = {};
      state.sortByPrice = 'default';
      saveToLocalStorage("filters", state);
    },
  },
});

export const {
  setPriceRange,
  toggleAmenity,
  toggleSafetyFeature,
  toggleBookingOption,
  toggleExceptionalProperty,
  togglePropertyType,
  setSortByPrice,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;