// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import hotelsReducer from "./hotelsSlice";
import propertyReducer from "./reducers/propertyReducer";
import saveReducer from "./SaveClient"; // 👈 your new reducer

const store = configureStore({
  reducer: {
    hotels: hotelsReducer,
    property: propertyReducer,
    save: saveReducer, // 👈 add it to the store
  },
});

export default store;
