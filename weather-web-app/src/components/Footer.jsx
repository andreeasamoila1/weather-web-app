import { CloudyFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { selectWeather } from "../redux/reducers/weatherReducer";

const Footer = () => {
  const weather = useSelector(selectWeather);

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
        <div className="footer-brand">
          <CloudyFill className="footer-icon" />
          <span className="footer-brand-name">Weather</span>
        </div>
        {lastUpdated && (
          <div className="footer-center">
            Last updated at <span>{lastUpdated}</span>
          </div>
        )}
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
