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

const Home = () => {
  const dispatch = useDispatch();
  const weather = useSelector(selectWeather);
  const loading = useSelector(selectLoading);
  const forecast = useSelector(selectForecast);

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000
  });
  useEffect(() => {
    if (coords) {
      dispatch(
        fetchWeatherByCoords({ lat: coords.latitude, lon: coords.longitude })
      );
    }
  }, [coords, dispatch]);
  const timeOfDay = getTimeOfDay(weather);

  const getDailyForecast = () => {
    if (!forecast) return [];
    const seen = new Set();
    const todayStr = new Date().toLocaleDateString();

    const todayItem = forecast.list.find(
      (item) => new Date(item.dt * 1000).toLocaleDateString() === todayStr
    );

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
    <div className={`weather-root theme-${timeOfDay}`}>
      <Navbar />

      <div className="weather-content">
        <Container fluid className="px-3 px-md-5 py-4 py-md-5 ">
          {loading || !weather ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <Spinner animation="grow" variant="light" />
            </div>
          ) : (
            <>
              <Row className="g-4 align-items-center">
                <Col
                  xs={12}
                  md={4}
                  className="d-none d-md-flex flex-column text-md-start order-md-1"
                >
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
                        <div className="stat-card">
                          <span className="stat-icon">{icon}</span>
                          <span className="stat-label">{label}</span>
                          <span className="stat-value">{value}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
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
                <Col
                  xs={6}
                  md={4}
                  className="d-flex flex-column align-items-center align-items-md-end justify-content-center text-center text-md-end order-1 order-md-3"
                >
                  <div className="temp-display">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <div className="temp-range mb-4">
                    {Math.round(weather.main.temp_min)}° /{" "}
                    {Math.round(weather.main.temp_max)}°
                  </div>

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
                    <div className="stat-card">
                      <span className="stat-icon">{icon}</span>
                      <span className="stat-label">{label}</span>
                      <span className="stat-value">{value}</span>
                    </div>
                  </Col>
                ))}
              </Row>
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
              {forecast && (
                <div className="mt-5">
                  <div className="section-label">Next 5 Days</div>
                  <Row className="g-3">
                    {getDailyForecast().map((item) => (
                      <Col key={item.dt} xs={6} sm={4} md={4} lg={2}>
                        <div className="forecast-card">
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
    </div>
  );
};

export default Home;
