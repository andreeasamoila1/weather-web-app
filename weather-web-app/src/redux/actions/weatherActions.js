import { createAsyncThunk } from "@reduxjs/toolkit";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

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
      return { weather, forecast };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchWeatherByCity = createAsyncThunk(
  "weather/fetchByCity",
  async (cityName, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
      );
      const cityObj = await res.json();
      if (!cityObj || cityObj.length === 0)
        return rejectWithValue("Città non trovata");
      const { lat, lon } = cityObj[0];
      dispatch(fetchWeatherByCoords({ lat, lon }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
