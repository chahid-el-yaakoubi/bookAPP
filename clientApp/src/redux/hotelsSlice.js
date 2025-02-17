import { createSlice } from "@reduxjs/toolkit";

// Function to load state from local storage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const storedState = localStorage.getItem(key);
    return storedState ? JSON.parse(storedState) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage", error);
    return defaultValue;
  }
};

// Function to save state to local storage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

const initialState = {
  hotels: [],
  filteredHotels: [],
  selectedFilter: null,
  filters: loadFromLocalStorage("filters", {
    priceRange: { min: 200, max: 2000 },
    amenities: {},
    bookingOptions: {},
    exceptionalProperties: {},
    propertyTypes: {},
  }),
};

const hotelsSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
      state.filteredHotels = action.payload;
      saveToLocalStorage("hotels", action.payload);
    },
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
      if (action.payload) {
        state.filteredHotels = state.hotels.filter((hotel) =>
          hotel.type.toLowerCase() === action.payload.toLowerCase()
        );
      } else {
        state.filteredHotels = state.hotels;
      }
    },
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.filters.priceRange = { min, max };
      state.filteredHotels = state.hotels.filter(
        (hotel) => hotel.basePrice >= min && hotel.basePrice <= max
      );
      saveToLocalStorage("filters", state.filters);
    },
    toggleAmenity: (state, action) => {
      const amenityId = action.payload;
      state.filters.amenities[amenityId] = !state.filters.amenities[amenityId];
      state.filteredHotels = state.hotels.filter((hotel) =>
        Object.entries(state.filters.amenities).every(
          ([id, isSelected]) => (isSelected ? hotel.amenities?.[id] : true)
        )
      );
      saveToLocalStorage("filters", state.filters);
    },
    toggleBookingOption: (state, action) => {
      const optionId = action.payload;
      state.filters.bookingOptions[optionId] = !state.filters.bookingOptions[optionId];
      state.filteredHotels = state.hotels.filter((hotel) =>
        Object.entries(state.filters.bookingOptions).every(
          ([id, isSelected]) => (isSelected ? hotel.bookingOptions?.includes(id) : true)
        )
      );
      saveToLocalStorage("filters", state.filters);
    },
    toggleExceptionalProperty: (state, action) => {
      const propertyId = action.payload;
      state.filters.exceptionalProperties[propertyId] = !state.filters.exceptionalProperties[propertyId];
      state.filteredHotels = state.hotels.filter((hotel) =>
        Object.entries(state.filters.exceptionalProperties).every(
          ([id, isSelected]) => (isSelected ? hotel.exceptionalProperties?.includes(id) : true)
        )
      );
      saveToLocalStorage("filters", state.filters);
    },
    togglePropertyType: (state, action) => {
      const type = action.payload;
      state.filters.propertyTypes[type] = !state.filters.propertyTypes[type];
      state.filteredHotels = state.hotels.filter((hotel) =>
        Object.entries(state.filters.propertyTypes).some(
          ([id, isSelected]) => isSelected && hotel.type === id
        )
      );
      saveToLocalStorage("filters", state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        priceRange: { min: 200, max: 2000 },
        amenities: {},
        bookingOptions: {},
        exceptionalProperties: {},
        propertyTypes: {},
      };
      state.filteredHotels = state.hotels;
      saveToLocalStorage("filters", state.filters);
    },
  },
});

export const {
  setHotels,
  setSelectedFilter,
  setPriceRange,
  toggleAmenity,
  toggleBookingOption,
  toggleExceptionalProperty,
  togglePropertyType,
  clearFilters,
} = hotelsSlice.actions;

export default hotelsSlice.reducer;
