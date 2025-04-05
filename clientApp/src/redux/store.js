import { configureStore } from "@reduxjs/toolkit";
import hotelsReducer from "./hotelsSlice";
import propertyReducer from './reducers/propertyReducer';

const store = configureStore({
  reducer: {
    hotels: hotelsReducer,
    property: propertyReducer,
  },
});

export default store;
