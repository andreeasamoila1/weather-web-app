import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords
} from "../actions/weatherActions";

const initialState = {
  data: null, // dati meteo correnti
  forecast: null, // previsioni 5 giorni
  loading: false,
  error: null
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // reducer sincroni futuri (es. clearWeather, toggleUnit...)
  },
  extraReducers: (builder) => {
    builder
      // ── fetchWeatherByCoords ──────────────────────────────
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.weather;
        state.forecast = action.payload.forecast;
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ── fetchWeatherByCity ────────────────────────────────
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// ── Selectors ─────────────────────────────────────────────
export const selectWeather = (state) => state.weather.data;
export const selectForecast = (state) => state.weather.forecast;
export const selectLoading = (state) => state.weather.loading;
export const selectError = (state) => state.weather.error;

export default weatherSlice.reducer;
