import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords
} from "../actions/weatherActions";

/**
 * Stato iniziale dello slice weather.
 * - data: dati meteo correnti (temperatura, vento, ecc.)
 * - forecast: previsioni per i prossimi 5 giorni (lista slot 3-orari)
 * - loading: flag per mostrare lo spinner durante le chiamate API
 * - error: messaggio di errore in caso di fetch fallita
 */
const initialState = {
  data: null,
  forecast: null,
  loading: false,
  error: null
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // Spazio riservato per eventuali reducer sincroni futuri
    // (es. clearWeather per resettare lo stato, toggleUnit per °C/°F...)
  },
  extraReducers: (builder) => {
    builder
      // ── fetchWeatherByCoords ──────────────────────────────
      // Gestisco i tre stati dell'async thunk: pending, fulfilled, rejected

      // Fetch avviata: attivo il loading e azzero eventuali errori precedenti
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch completata: salvo nello store sia i dati meteo correnti
      // che le previsioni (entrambi restituiti in parallelo dall'action)
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.weather;
        state.forecast = action.payload.forecast;
      })
      // Fetch fallita: disattivo il loading e salvo il messaggio di errore
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ── fetchWeatherByCity ────────────────────────────────
      // Questa action non ha un caso fulfilled perché internamente
      // fa dispatch di fetchWeatherByCoords, che aggiorna lo stato da sola.
      // Gestisco solo pending e rejected per il loading/errore.
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
// Centralizzare i selectors qui evita di accoppiare i componenti
// alla struttura interna dello store: se cambia la forma dello stato,
// basta aggiornare solo questi selectors.
export const selectWeather = (state) => state.weather.data;
export const selectForecast = (state) => state.weather.forecast;
export const selectLoading = (state) => state.weather.loading;
export const selectError = (state) => state.weather.error;

export default weatherSlice.reducer;
