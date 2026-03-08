import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./reducers/weatherReducer.js";

export const store = configureStore({
  reducer: {
    weather: weatherReducer
  }
});
