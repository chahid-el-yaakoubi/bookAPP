import { createSlice } from "@reduxjs/toolkit";

const saveFilterCountToLocalStorage = (count) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem("applied-filters-count", count);
    }
  } catch (error) {
    console.error("Error saving filter count to localStorage", error);
  }
};

// Function to load the number of applied filters from local storage
const loadFilterCountFromLocalStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem("applied-filters-count");
      return storedCount ? parseInt(storedCount, 10) : 0;
    }
    return 0;
  } catch (error) {
    console.error("Error loading filter count from localStorage", error);
    return 0;
  }
};

const initialState = {
  hotels: [],
  filteredHotels: [],
  selectedFilter: null,
  appliedFilterCount: loadFilterCountFromLocalStorage(), // Load initial count from local storage
};

const hotelsSlice = createSlice({
  name: "hotels",
  // initialState : [],
  initialState: initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
      state.filteredHotels = action.payload.map(hotel => ({
        ...hotel,
        spaces: hotel.property_details?.spaces || [],
      }));
      // saveToLocalStorage("hotels-data", action.payload); // Save just the data
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
      
      // saveToLocalStorage("hotels-state", {
      //   ...state,
      //   filteredHotels: [] // Don't store filtered results in localStorage to save space
      // });
    },
    
    applyFilters: (state, action) => {
      const filters = action.payload;

      
      // Count the number of applied filters
      const appliedFilterCount = Object.values(filters).reduce((count, filter) => {
        return count + (typeof filter === 'object' ? Object.values(filter).filter(Boolean).length : (filter ? 1 : 0));
      }, 0);
      
      // Save the count to local storage
      saveFilterCountToLocalStorage(appliedFilterCount);
      
      // Update the state with the new count
      state.appliedFilterCount = appliedFilterCount;
      
      // First filter the hotels with efficient single-pass filtering
      let filtered = state.hotels.filter((hotel) => {
        // Apply price filter
        const price = (hotel.type?.type === 'hotel' || hotel.type?.type === 'guesthouse') 
          ? hotel.roomSummary.minPrice // Use minPrice for filtering
          : (hotel.pricing?.nightly_rate || hotel.price || 0);
        const priceMatch = price >= filters.priceRange.min && 
                          price <= filters.priceRange.max;
        if (!priceMatch) return false;
        
        // Apply amenities filter - handle both object and array data structures
        const amenitiesMatch = Object.entries(filters.amenities || {}).every(
          ([id, isSelected]) => isSelected === true && // Only include amenities that are true
            (hotel.property_details.propertyFeatures?.standard?.includes(id) || 
             hotel.property_details.propertyFeatures?.custom?.includes(id))
        );
        if (!amenitiesMatch) return false;

        // Apply safety features filter
        const safetyFeaturesMatch = Object.entries(filters.safety_features || {}).every(
          ([id, isSelected]) => isSelected  && 
            hotel.safety_features.safety.includes(id)
        );
        if (!safetyFeaturesMatch) return false;
        
        // Apply booking options filter
        const bookingOptionsMatch = Object.entries(filters.bookingOptions || {}).every(
          ([id, isSelected]) => !isSelected || 
            (Array.isArray(hotel.bookingOptions) && hotel.bookingOptions.includes(id))
        );
        if (!bookingOptionsMatch) return false;
        
        // Apply exceptional properties filter
        const exceptionalPropertiesMatch = Object.entries(filters.exceptionalProperties || {}).every(
          ([id, isSelected]) => !isSelected || 
            (Array.isArray(hotel.exceptionalProperties) && hotel.exceptionalProperties.includes(id))
        );
        if (!exceptionalPropertiesMatch) return false;
        
        // Apply property types filter
        const propertyTypesSelected = Object.values(filters.propertyTypes || {}).some(isSelected => isSelected);
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
      
      // New sorting logic to prioritize featured hotels first
      filtered.sort((a, b) => {
        const featuredA = a.featured ? 1 : 0; // 1 if featured, 0 otherwise
        const featuredB = b.featured ? 1 : 0; // 1 if featured, 0 otherwise
        if (featuredA !== featuredB) {
          return featuredB - featuredA; // Sort featured first
        }
        return 0; // No change in order if both are featured or not
      });

      // Then apply sorting based on price if specified
      if (filters.sortByPrice) {
        switch (filters.sortByPrice) {
          case 'low-to-high':
            filtered.sort((a, b) => {
              const priceA = (a.type?.type === 'hotel' || a.type?.type === 'guesthouse') 
                ? a.roomSummary.minPrice // Use minPrice for sorting
                : (a.pricing?.nightly_rate || a.price || 0);
              const priceB = (b.type?.type === 'hotel' || b.type?.type === 'guesthouse') 
                ? b.roomSummary.minPrice // Use minPrice for sorting
                : (b.pricing?.nightly_rate || b.price || 0);
              return priceA - priceB; // Sort low to high
            });
            break;
          case 'high-to-low':
            filtered.sort((a, b) => {
              const priceA = (a.type?.type === 'hotel' || a.type?.type === 'guesthouse') 
                ? a.roomSummary.maxPrice // Use maxPrice for sorting
                : (a.pricing?.nightly_rate || a.price || 0);
              const priceB = (b.type?.type === 'hotel' || b.type?.type === 'guesthouse') 
                ? b.roomSummary.maxPrice // Use maxPrice for sorting
                : (b.pricing?.nightly_rate || b.price || 0);
              return priceB - priceA; // Sort high to low
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