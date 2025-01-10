import React, { createContext, useEffect, useReducer } from "react";

// Initial state
const INITIAL_STATE = {
  status: false,
};

// Create context
export const sideContext = createContext(INITIAL_STATE);

// Reducer function
const SideReducer = (state, action) => {
  switch (action.type) {
    case "OPEN":
      return {
        status: true,
      };
    case "CLOSE":
      return {
        status: false,
      };
    default:
      return state;
  }
};

// Context provider
export const sideContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SideReducer, INITIAL_STATE);


  return (
    <sideContext.Provider
      value={{
        status: state.status,
        dispatch,
      }}
    >
      {children}
    </sideContext.Provider>
  );
};
