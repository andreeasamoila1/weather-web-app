import { createAsyncThunk } from "@reduxjs/toolkit";

// La API key viene letta dalle variabili d'ambiente tramite Vite,
// così non finisce mai nel codice sorgente committato
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

/**
 * fetchWeatherByCoords
 * Async thunk che recupera in parallelo:
 * - i dati meteo correnti (endpoint /weather)
 * - le previsioni a 5 giorni (endpoint /forecast, slot ogni 3 ore)
 *
 * Uso Promise.all per eseguire le due chiamate contemporaneamente
 * e dimezzare il tempo di attesa rispetto a due fetch sequenziali.
 *
 * In caso di errore restituisco il messaggio tramite rejectWithValue
 * così il reducer può salvarlo nello stato senza che Redux Toolkit
 * lo tratti come un'eccezione non gestita.
 */
export const fetchWeatherByCoords = createAsyncThunk(
  "weather/fetchByCoords",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        )
      ]);
      const weather = await weatherRes.json();
      const forecast = await forecastRes.json();
      // Restituisco entrambi i payload in un unico oggetto:
      // il reducer li separa in state.data e state.forecast
      return { weather, forecast };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * fetchWeatherByCity
 * Async thunk per la ricerca meteo tramite nome città.
 *
 * Poiché l'API meteo di OpenWeather accetta solo coordinate,
 * questo thunk fa prima una chiamata al Geocoding API per
 * convertire il nome della città in lat/lon, poi fa dispatch
 * di fetchWeatherByCoords con le coordinate ottenute.
 *
 * Questo approccio evita di duplicare la logica di fetch
 * e garantisce che lo stato venga aggiornato sempre
 * dallo stesso thunk (fetchWeatherByCoords).
 */
export const fetchWeatherByCity = createAsyncThunk(
  "weather/fetchByCity",
  async (cityName, { dispatch, rejectWithValue }) => {
    try {
      // Risolvo il nome città in coordinate geografiche
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
      );
      const cityObj = await res.json();

      // Se il geocoding non trova risultati, rifiuto con un messaggio leggibile
      if (!cityObj || cityObj.length === 0)
        return rejectWithValue("Città non trovata");

      // Uso le coordinate del primo risultato per fetchare il meteo
      const { lat, lon } = cityObj[0];
      dispatch(fetchWeatherByCoords({ lat, lon }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
