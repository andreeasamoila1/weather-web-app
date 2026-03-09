import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./reducers/weatherReducer.js";

/**
 * Store Redux principale dell'applicazione.
 * Al momento gestisce un solo slice (weather),
 * ma la struttura è predisposta per aggiungere altri reducer in futuro
 * semplicemente aggiungendo chiavi all'oggetto `reducer`.
 */
export const store = configureStore({
  reducer: {
    weather: weatherReducer
  }
});
