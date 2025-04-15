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
  hotels: [],
  filteredHotels: [],
  selectedFilter: null,
};

const hotelsSlice = createSlice({
  name: "hotels",
  initialState: loadFromLocalStorage("hotels-state", initialState),
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
      state.filteredHotels = action.payload.map(hotel => ({
        ...hotel,
        spaces: hotel.property_details?.spaces || [],
      }));
      saveToLocalStorage("hotels-data", action.payload); // Save just the data
    },
    
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
      
      if (action.payload) {
        state.filteredHotels = state.hotels.filter((hotel) =>
          hotel.type?.type?.toLowerCase() === action.payload.toLowerCase()
        );
      } else {
        state.filteredHotels = state.hotels;
      }
      
      saveToLocalStorage("hotels-state", {
        ...state,
        filteredHotels: [] // Don't store filtered results in localStorage to save space
      });
    },
    
    applyFilters: (state, action) => {
      const filters = action.payload;
      
      // First filter the hotels with efficient single-pass filtering
      let filtered = state.hotels.filter((hotel) => {
        // Apply price filter
        const price = hotel.pricing?.nightly_rate || hotel.price || 0;
        const priceMatch = price >= filters.priceRange.min && 
                          price <= filters.priceRange.max;
        if (!priceMatch) return false;
        
        // Apply amenities filter - handle both object and array data structures
        const amenitiesMatch = Object.entries(filters.amenities).every(
          ([id, isSelected]) => {
            if (!isSelected) return true; // Skip if not selected
            
            // Check if amenities is an object with boolean flags
            if (hotel.amenities && typeof hotel.amenities === 'object' && !Array.isArray(hotel.amenities)) {
              return hotel.amenities[id];
            }
            
            // Or if it's an array of strings
            return Array.isArray(hotel.amenities) && hotel.amenities.includes(id);
          }
        );
        if (!amenitiesMatch) return false;
        
        // Apply booking options filter
        const bookingOptionsMatch = Object.entries(filters.bookingOptions).every(
          ([id, isSelected]) => !isSelected || 
            (Array.isArray(hotel.bookingOptions) && hotel.bookingOptions.includes(id))
        );
        if (!bookingOptionsMatch) return false;
        
        // Apply exceptional properties filter
        const exceptionalPropertiesMatch = Object.entries(filters.exceptionalProperties).every(
          ([id, isSelected]) => !isSelected || 
            (Array.isArray(hotel.exceptionalProperties) && hotel.exceptionalProperties.includes(id))
        );
        if (!exceptionalPropertiesMatch) return false;
        
        // Apply property types filter
        const propertyTypesSelected = Object.values(filters.propertyTypes).some(isSelected => isSelected);
        const propertyTypeMatch = !propertyTypesSelected || 
                                (hotel.type?.type && filters.propertyTypes[hotel.type.type.toLowerCase()]);
        if (!propertyTypeMatch) return false;
        
        return true;
      });
      
      // If there's a selected type filter, apply that too
      if (state.selectedFilter) {
        filtered = filtered.filter((hotel) =>
          hotel.type?.type?.toLowerCase() === state.selectedFilter.toLowerCase()
        );
      }
      
      // Then apply sorting
      if (filters.sortByPrice) {
        switch (filters.sortByPrice) {
          case 'low-to-high':
            filtered.sort((a, b) => {
              const priceA = a.pricing?.nightly_rate || a.price || 0;
              const priceB = b.pricing?.nightly_rate || b.price || 0;
              return priceA - priceB;
            });
            break;
          case 'high-to-low':
            filtered.sort((a, b) => {
              const priceA = a.pricing?.nightly_rate || a.price || 0;
              const priceB = b.pricing?.nightly_rate || b.price || 0;
              return priceB - priceA;
            });
            break;
          // Default - leave as is (default sort)
          default:
            break;
        }
      }
      
      state.filteredHotels = filtered;
    }
  },
});

export const {
  setHotels,
  setSelectedFilter,
  applyFilters
} = hotelsSlice.actions;

export default hotelsSlice.reducer;