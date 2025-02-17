// filtersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  priceRange: { min: 200, max: 2000 },
  amenities: [],
  propertyTypes: [],
  exceptionalProperties: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    toggleAmenity: (state, action) => {
      const amenityId = action.payload;
      if (state.amenities.includes(amenityId)) {
        state.amenities = state.amenities.filter((id) => id !== amenityId);
      } else {
        state.amenities.push(amenityId);
      }
    },
    togglePropertyType: (state, action) => {
      const type = action.payload;
      if (state.propertyTypes.includes(type)) {
        state.propertyTypes = state.propertyTypes.filter((t) => t !== type);
      } else {
        state.propertyTypes.push(type);
      }
    },
    toggleExceptionalProperty: (state, action) => {
      const prop = action.payload;
      if (state.exceptionalProperties.includes(prop)) {
        state.exceptionalProperties = state.exceptionalProperties.filter((p) => p !== prop);
      } else {
        state.exceptionalProperties.push(prop);
      }
    },
    resetFilters: (state) => {
      state.priceRange = { min: 200, max: 2000 };
      state.amenities = [];
      state.propertyTypes = [];
      state.exceptionalProperties = [];
    },
  },
});

export const {
  setPriceRange,
  toggleAmenity,
  togglePropertyType,
  toggleExceptionalProperty,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;