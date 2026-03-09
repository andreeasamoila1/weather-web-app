import { CloudyFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { selectWeather } from "../redux/reducers/weatherReducer";

/**
 * Footer component
 * Mostra il brand dell'app, l'orario dell'ultimo aggiornamento meteo
 * e il credito alla sorgente dati (OpenWeather API).
 */
const Footer = () => {
  // Leggo i dati meteo correnti dallo store Redux
  const weather = useSelector(selectWeather);

  // Converto il timestamp Unix (in secondi) restituito dall'API
  // in un orario leggibile HH:MM. Se i dati non sono ancora disponibili,
  // lastUpdated rimane null e la sezione centrale non viene renderizzata.
  const lastUpdated = weather
    ? new Date(weather.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  return (
    <footer className="weather-footer">
      <div className="footer-divider" />
      <div className="footer-inner">
        {/* Logo con icona cloud a sinistra */}
        <div className="footer-brand">
          <CloudyFill className="footer-icon" />
          <span className="footer-brand-name">Weather</span>
        </div>
        {/* Mostro l'orario di aggiornamento solo se i dati meteo sono presenti */}
        {lastUpdated && (
          <div className="footer-center">
            Last updated at <span>{lastUpdated}</span>
          </div>
        )}
        {/* Copyright con anno dinamico + link alla fonte dati */}
        <div className="footer-right">
          <span className="footer-copy">© {new Date().getFullYear()}</span>
          <a
            href="https://openweathermap.org"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            Powered by OpenWeather
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
