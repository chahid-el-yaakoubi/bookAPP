import React, { createContext, useReducer, useEffect } from 'react';
import i18n from '../i18n';

export const TransContext = createContext();

const INITIAL_STATE = {
  language: localStorage.getItem('language') ? localStorage.getItem('language') : 'en'
};

const TransReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      localStorage.setItem('language', action.payload);
      i18n.changeLanguage(action.payload);
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};

export const TransContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TransReducer, INITIAL_STATE);

  // Initialize language on mount
  useEffect(() => {
    i18n.changeLanguage(state.language);
  }, []);

  return (
    <TransContext.Provider value={{ state, dispatch }}>
      {children}
    </TransContext.Provider>
  );
}; 