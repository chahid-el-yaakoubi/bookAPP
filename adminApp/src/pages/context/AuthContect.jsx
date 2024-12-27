import React, { createContext, useEffect, useReducer } from "react";

// Initial state
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null
};

// Create context
export const AuthContext = createContext(INITIAL_STATE);

// Reducer function
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,  // Fixed typo here
        error: null
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        loading: false,  // Fixed typo here
        error: action.payload
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false, 
        error: null
      };
    default:
      return state;
  }
};

// Context provider
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Sync user data with localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{
      user: state.user,
      loading: state.loading,
      error: state.error,
      dispatch
    }}>
      {children}
    </AuthContext.Provider>
  );
};
