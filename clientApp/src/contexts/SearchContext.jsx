import React, { createContext, useReducer, useEffect } from "react";

// Default initial state
const INITIAL_STATE = {
  city: "",
  dates: [],
  options: localStorage.getItem("options") || {
    adult: 1,
    children: 0,
    rooms: 1,
  },
};

// Create the context
export const SearchContext = createContext(INITIAL_STATE);

// Reducer to handle actions
const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

// Provider component
export const SearchContextProvider = ({ children }) => {
  // Load safely from localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored && stored !== "undefined" ? JSON.parse(stored) : defaultValue;
    } catch (err) {
      console.warn(`Error loading ${key} from localStorage`, err);
      return defaultValue;
    }
  };

  const initialState = {
    city: loadFromLocalStorage("city", INITIAL_STATE.city),
    dates: loadFromLocalStorage("dates", INITIAL_STATE.dates),
    options: loadFromLocalStorage("options", INITIAL_STATE.options),
  };

  const [state, dispatch] = useReducer(SearchReducer, initialState);


  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("city", JSON.stringify(state.city));
    localStorage.setItem("dates", JSON.stringify(state.dates));
    localStorage.setItem("options", JSON.stringify(state.options));
  }, [state]);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        guests: state.options.adult + state.options.children,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
