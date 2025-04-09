import React, { createContext, useEffect, useReducer } from "react";

// Safely parse user from localStorage
let storedUser = null;
try {
  const rawUser = localStorage.getItem("user");
  storedUser = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;
} catch (error) {
  console.error("Failed to parse 'user' from localStorage:", error);
  storedUser = null;
}

// Initial state
const INITIAL_STATE = {
  user: storedUser,
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
        loading: false,
        error: null
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        loading: false,
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
    if (state.user !== undefined) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
