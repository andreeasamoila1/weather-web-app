import { useEffect } from "react";
import Navbar from "./Navbar";
import { Col, Container, Row } from "react-bootstrap";
import { GeoAltFill, SunriseFill, SunsetFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectForecast,
  selectLoading,
  selectWeather
} from "../redux/reducers/weatherReducer";
import { fetchWeatherByCoords } from "../redux/actions/weatherActions";
import { useGeolocated } from "react-geolocated";
import { DropletFill, Wind, Thermometer } from "react-bootstrap-icons";
import { Spinner } from "react-bootstrap";
import { getTimeOfDay } from "../utils/timeOfDay";
import Footer from "./Footer";

/**
 * Home component – pagina principale dell'app.
 *
 * Al mount carica subito il meteo di Lodi come posizione di default,
 * poi appena il browser concede la geolocalizzazione aggiorna i dati
 * con le coordinate reali dell'utente.
 *
 * Visualizza:
 * - Temperatura attuale, range min/max, condizione meteo
 * - Icona meteo da OpenWeather
 * - Statistiche secondarie (umidità, vento, visibilità, pressione…)
 * - Orari di alba e tramonto
 * - Previsioni per i prossimi 5 giorni
 *
 * Il tema visivo (sfondo, palette colori) cambia dinamicamente
 * in base all'ora del giorno tramite la classe CSS `theme-${timeOfDay}`.
 */
const Home = () => {
  const dispatch = useDispatch();

  // Leggo dallo store Redux i dati meteo correnti, il forecast e lo stato di loading
  const weather = useSelector(selectWeather);
  const loading = useSelector(selectLoading);
  const forecast = useSelector(selectForecast);

  // Coordinate di fallback (Lodi): usate al primo caricamento prima
  // che il browser restituisca la posizione reale dell'utente
  const LODI_COORDS = { lat: 45.3167, lon: 9.5 };

  // Hook che richiede la geolocalizzazione del browser.
  // userDecisionTimeout: se l'utente non risponde entro 5s,
  // si prosegue comunque con la posizione di default.
  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000
  });

  // Al primo render carico subito i dati con la posizione di default (Lodi),
  // così l'utente vede qualcosa mentre il browser elabora la geolocalizzazione
  useEffect(() => {
    dispatch(fetchWeatherByCoords(LODI_COORDS));
  }, []);

  // Appena arrivano le coordinate reali, sovrascrivo i dati meteo
  // con quelli della posizione effettiva dell'utente
  useEffect(() => {
    if (coords) {
      dispatch(
        fetchWeatherByCoords({ lat: coords.latitude, lon: coords.longitude })
      );
    }
  }, [coords, dispatch]);

  // Determino il momento della giornata (morning / day / evening / night)
  // in base all'orario di alba/tramonto restituito dall'API.
  // Viene usato per applicare il tema CSS corretto.
  const timeOfDay = getTimeOfDay(weather);

  /**
   * getDailyForecast
   * L'API OpenWeather restituisce previsioni ogni 3 ore per 5 giorni.
   * Questa funzione le filtra per ottenere un'unica voce per giorno:
   * - include oggi (primo item del giorno corrente trovato)
   * - poi il primo item di ogni giorno futuro (nessun duplicato)
   * - restituisce massimo 6 elementi
   */
  const getDailyForecast = () => {
    if (!forecast) return [];
    const seen = new Set();
    const todayStr = new Date().toLocaleDateString();

    // Cerco il primo slot disponibile per oggi
    const todayItem = forecast.list.find(
      (item) => new Date(item.dt * 1000).toLocaleDateString() === todayStr
    );

    // Per i giorni futuri prendo solo il primo slot disponibile per ciascuna data
    const futureDays = forecast.list.filter((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (date === todayStr || seen.has(date)) return false;
      seen.add(date);
      return true;
    });

    const result = todayItem ? [todayItem, ...futureDays] : futureDays;
    return result.slice(0, 6);
  };
  return (
    // Il tema CSS cambia dinamicamente in base all'ora del giorno
    <div className={`weather-root theme-${timeOfDay}`}>
      <Navbar />

      <div className="weather-content">
        <Container fluid className="px-3 px-md-5 py-4 py-md-5 ">
          {/* Mostro uno spinner centrato mentre i dati sono in caricamento */}
          {loading || !weather ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <Spinner animation="grow" variant="light" />
            </div>
          ) : (
            <>
              {/* ── RIGA PRINCIPALE ────────────────────────────────────────
                  Layout a 3 colonne su desktop:
                  [Col sinistra: condizione + stats] [Col centro: icona] [Col destra: temperatura]
                  Su mobile le colonne sinistra/destra si sovrappongono
                  e le stats vengono mostrate in una riga separata sotto. */}
              <Row className="g-4 align-items-center">
                {/* COLONNA SINISTRA (solo desktop): condizione, coordinate, stats */}
                <Col
                  xs={12}
                  md={4}
                  className="d-none d-md-flex flex-column text-md-start order-md-1"
                >
                  {/* Condizione principale e descrizione */}
                  <div className="condition-display mb-1">
                    {weather.weather[0].main}
                  </div>
                  <div
                    className="fs-6 text-capitalize mb-4"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.05em"
                    }}
                  >
                    {weather.weather[0].description}
                  </div>
                  {/* Posizione: nome città, paese e coordinate geografiche */}
                  <div className="mb-4 d-flex flex-column align-items-md-start gap-1">
                    <div className="location-tag">
                      <GeoAltFill style={{ color: "rgba(130,160,255,0.9)" }} />
                      {weather.name.toUpperCase()}, {weather.sys.country}
                    </div>
                    <div className="coords-text">
                      {weather.coord.lat.toFixed(2)}°N —{" "}
                      {weather.coord.lon.toFixed(2)}°E
                    </div>
                  </div>
                  <Row className="g-2">
                    {/*Array delle statistiche secondarie, costruito in modo dichiarativo
                     per evitare ripetizioni nel JSX (stesso blocco usato sia su desktop che mobile) */}
                    {[
                      {
                        icon: <DropletFill />,
                        label: "Humidity",
                        value: `${weather.main.humidity}%`
                      },
                      {
                        icon: <Wind />,
                        label: "Visibility",
                        value: `${(weather.visibility / 1000).toFixed(1)} km`
                      },
                      {
                        icon: <Wind />,
                        label: "Wind",
                        value: `${weather.wind.speed} m/s`
                      },
                      {
                        icon: <Thermometer />,
                        label: "Cloud Cover",
                        value: `${weather.clouds.all}%`
                      },
                      {
                        icon: <Thermometer />,
                        label: "Feels Like",
                        value: `${weather.main.feels_like}°C`
                      },
                      {
                        icon: <Thermometer />,
                        label: "Pressure",
                        value: `${weather.main.pressure} hPa`
                      }
                    ].map(({ icon, label, value }) => (
                      <Col key={label} xs={6}>
                        {/* Griglia delle statistiche secondarie (desktop) */}
                        <div className="stat-card">
                          <span className="stat-icon">{icon}</span>
                          <span className="stat-label">{label}</span>
                          <span className="stat-value">{value}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
                {/* COLONNA CENTRALE: icona meteo da OpenWeather CDN */}
                <Col
                  xs={6}
                  md={4}
                  className="d-flex align-items-center justify-content-center order-1 order-md-2"
                >
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                    className="w-100 weather-icon-wrap"
                    style={{ maxWidth: "260px" }}
                  />
                </Col>
                {/* COLONNA DESTRA: temperatura, range, vento/pressione, alba/tramonto */}
                <Col
                  xs={6}
                  md={4}
                  className="d-flex flex-column align-items-center align-items-md-end justify-content-center text-center text-md-end order-1 order-md-3"
                >
                  {/* Temperatura arrotondata all'intero */}
                  <div className="temp-display">
                    {Math.round(weather.main.temp)}°
                  </div>
                  {/* Range min/max del giorno */}
                  <div className="temp-range mb-4">
                    {Math.round(weather.main.temp_min)}° /{" "}
                    {Math.round(weather.main.temp_max)}°
                  </div>
                  {/* Vento e pressione in formato compatto (solo desktop) */}
                  <div className="wind-pressure mb-4 text-center text-md-end d-none d-md-block">
                    <div>
                      WIND <span>{weather.wind.speed} M/S</span>
                    </div>
                    <div>
                      PRESSURE <span>{weather.main.pressure} HPA</span>
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.75rem",
                        marginTop: "4px"
                      }}
                    >
                      — {weather.name.toUpperCase()}
                    </div>
                  </div>
                  {/* Card alba/tramonto – converto i timestamp Unix in HH:MM */}
                  <div className="sun-card mt-2 d-none d-md-flex">
                    <div className="d-flex flex-column align-items-center">
                      <SunriseFill
                        style={{
                          fontSize: "1.6rem",
                          color: "rgba(255,210,80,0.9)"
                        }}
                      />
                      <div className="sun-time">
                        {new Date(
                          weather.sys.sunrise * 1000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="sun-label">Sunrise</div>
                    </div>
                    <div className="sun-divider" />
                    <div className="d-flex flex-column align-items-center">
                      <SunsetFill
                        style={{
                          fontSize: "1.6rem",
                          color: "rgba(180,200,255,0.9)"
                        }}
                      />
                      <div className="sun-time">
                        {new Date(weather.sys.sunset * 1000).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                      <div className="sun-label">Sunset</div>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* ── STATS E SUN CARD MOBILE ─────────────────────────────
                  Stesse informazioni della colonna desktop,
                  ma riposizionate sotto l'icona su schermi piccoli */}
              <div className="d-flex d-md-none align-items-center justify-content-center mt-3 mb-1">
                <div className="location-tag">
                  <GeoAltFill style={{ color: "rgba(130,160,255,0.9)" }} />
                  {weather.name.toUpperCase()}, {weather.sys.country}
                </div>
              </div>
              <Row className="g-2 mt-3 d-md-none">
                {[
                  {
                    icon: <DropletFill />,
                    label: "Humidity",
                    value: `${weather.main.humidity}%`
                  },
                  {
                    icon: <Wind />,
                    label: "Visibility",
                    value: `${(weather.visibility / 1000).toFixed(1)} km`
                  },
                  {
                    icon: <Wind />,
                    label: "Wind",
                    value: `${weather.wind.speed} m/s`
                  },
                  {
                    icon: <Thermometer />,
                    label: "Cloud Cover",
                    value: `${weather.clouds.all}%`
                  },
                  {
                    icon: <Thermometer />,
                    label: "Feels Like",
                    value: `${weather.main.feels_like}°C`
                  },
                  {
                    icon: <Thermometer />,
                    label: "Pressure",
                    value: `${weather.main.pressure} hPa`
                  }
                ].map(({ icon, label, value }) => (
                  <Col key={label} xs={6}>
                    <div
                      className="stat-card"
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "4px"
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span className="stat-icon">{icon}</span>
                        <span className="stat-label">{label}</span>
                      </div>
                      <span className="stat-value">{value}</span>
                    </div>
                  </Col>
                ))}
              </Row>
              {/* Sun card mobile */}
              <div className="sun-card mt-3 d-md-none justify-content-center">
                <div className="d-flex flex-column align-items-center">
                  <SunriseFill
                    style={{
                      fontSize: "1.6rem",
                      color: "rgba(255,210,80,0.9)"
                    }}
                  />
                  <div className="sun-time">
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </div>
                  <div className="sun-label">Sunrise</div>
                </div>
                <div className="sun-divider" />
                <div className="d-flex flex-column align-items-center">
                  <SunsetFill
                    style={{
                      fontSize: "1.6rem",
                      color: "rgba(180,200,255,0.9)"
                    }}
                  />
                  <div className="sun-time">
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </div>
                  <div className="sun-label">Sunset</div>
                </div>
              </div>
              {/* ── PREVISIONI 5 GIORNI ─────────────────────────────────
                  Renderizzate solo se il forecast è disponibile nello store.
                  getDailyForecast() deduplica i dati 3-orari dell'API
                  restituendo una card per giorno. */}
              {forecast && (
                <div className="mt-5">
                  <div className="section-label">Next 5 Days</div>
                  <Row className="g-3">
                    {getDailyForecast().map((item) => (
                      <Col key={item.dt} xs={6} sm={4} md={4} lg={2}>
                        <div className="forecast-card">
                          {/* Data in formato "Mon 9 Jun" */}
                          <div className="forecast-date">
                            {new Date(item.dt * 1000).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short"
                              }
                            )}
                          </div>
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt={item.weather[0].description}
                            width={48}
                          />
                          <div className="forecast-desc">
                            {item.weather[0].description}
                          </div>
                          <div className="forecast-temp-max">
                            {Math.round(item.main.temp_max)}°
                          </div>
                          <div className="forecast-temp-min">
                            {Math.round(item.main.temp_min)}°
                          </div>
                          <div className="forecast-humidity">
                            <DropletFill className="me-1" />
                            {item.main.humidity}%
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
