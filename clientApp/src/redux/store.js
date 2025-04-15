// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import hotelsReducer from "./hotelsSlice";
import filtersReducer from "./filtersSlice";
import propertyReducer from "./reducers/propertyReducer";
import saveReducer from "./SaveClient";

const store = configureStore({
  reducer: {
    hotels: hotelsReducer,
    filters: filtersReducer, // Add the filters reducer
    property: propertyReducer,
    save: saveReducer,
  },
});

export default store;