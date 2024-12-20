import React, { createContext, useReducer, useEffect } from "react";

// Initial state
const INITIAL_STATE = {
  city: "undefined",
  dates: [],
  options: {
    adult: 1,
    children: 0,  // Fixed spelling issue here
    rooms: 1,
  },
};

// Create context
export const SearchContext = createContext(INITIAL_STATE);

// Reducer function
const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload; // Update state based on payload
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

// Context provider
export const SearchContextProvider = ({ children }) => {
  // Load initial state from localStorage or use default state
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const savedValue = localStorage.getItem(key);
      return savedValue ? JSON.parse(savedValue) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  const initialState = {
    city: loadFromLocalStorage("city", INITIAL_STATE.city),
    dates: loadFromLocalStorage("dates", INITIAL_STATE.dates),
    options: loadFromLocalStorage("options", INITIAL_STATE.options),
  };

  const [state, dispatch] = useReducer(SearchReducer, initialState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("city", JSON.stringify(state.city));
    localStorage.setItem("dates", JSON.stringify(state.dates));
    localStorage.setItem("options", JSON.stringify(state.options));
  }, [state]);

  return (
    <SearchContext.Provider value={{ city: state.city, options: state.options, dates: state.dates, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
};
