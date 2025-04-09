import React, { createContext, useReducer, useEffect } from 'react';
import i18n from '../i18n';

export const TransContext = createContext();

const INITIAL_STATE = {
  language: localStorage.getItem('language') || 'en',  // Simplified this line
};

const TransReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      localStorage.setItem('language', action.payload);
      i18n.changeLanguage(action.payload);  // Update language in i18n
      return {
        ...state,
        language: action.payload,  // Update state with the new language
      };
    default:
      return state;
  }
};

export const TransContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TransReducer, INITIAL_STATE);

  // Initialize language on mount and listen for state changes
  useEffect(() => {
    i18n.changeLanguage(state.language);
  }, [state.language]);  // Make sure the effect runs whenever language changes

  return (
    <TransContext.Provider value={{ state, dispatch }}>
      {children}
    </TransContext.Provider>
  );
};
