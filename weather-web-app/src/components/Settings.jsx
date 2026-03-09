import { Col, Container, Row } from "react-bootstrap";
import {
  ArrowLeft,
  CloudyFill,
  CodeSlash,
  GeoAltFill,
  Github
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTimeOfDay } from "../utils/timeOfDay";
import { selectWeather } from "../redux/reducers/weatherReducer";

/**
 * Settings component
 * Pagina delle impostazioni/info dell'applicazione.
 * Mostra un riepilogo delle tecnologie usate nel progetto
 * e link utili (OpenWeather, GitHub, Source).
 * Non ha logica Redux: è una pagina puramente informativa/statica.
 */
const Settings = () => {
  const navigate = useNavigate();

  // Leggo i dati meteo dallo store per calcolare il tema corrente,
  // coerente con quello visualizzato nella Home
  const weather = useSelector(selectWeather);
  const timeOfDay = getTimeOfDay(weather);

  // Lista delle info tecniche del progetto mostrate nella card centrale.
  // Uso un array di oggetti per rendere il rendering dinamico e facile da aggiornare.
  const infos = [
    { label: "Versione", value: "1.0.0" },
    { label: "Framework", value: "React + Redux Toolkit" },
    { label: "UI Library", value: "React Bootstrap" },
    { label: "Dati meteo", value: "OpenWeather API" },
    { label: "Geolocaliz.", value: "react-geolocated" }
  ];

  return (
    // Il tema cambia dinamicamente in base all'ora del giorno,
    // in modo da essere sempre coerente con lo sfondo della Home.
    // Se i dati meteo non sono ancora disponibili, getTimeOfDay restituisce "night" come fallback.
    <div className={`weather-root theme-${timeOfDay}`}>
      <div className="weather-content">
        <Container fluid className="px-3 px-md-5 py-4 text-white">
          {/* Header della pagina: pulsante back + titolo */}
          <div className="d-flex align-items-center gap-3 mb-5">
            <button
              onClick={() => navigate("/")}
              className="back-btn d-flex align-items-center justify-content-center"
            >
              <ArrowLeft />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <CloudyFill className="settings-cloud" />
                <span className="settings-app-label">Weather</span>
              </div>
              <h1 className="settings-title">Settings</h1>
            </div>
          </div>

          <Row className="justify-content-center ">
            <Col xs={12} md={7} lg={5}>
              {/* Card con le info tecniche del progetto.
                  Il bordo separatore tra le righe viene applicato
                  a tutte tranne l'ultima tramite il check sull'indice. */}
              <div className="info-card mb-4">
                {infos.map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={`d-flex justify-content-between align-items-center px-4 py-3 ${i < infos.length - 1 ? "info-row-border" : ""}`}
                  >
                    <span className="stat-label">{label}</span>
                    <span className="info-value">{value}</span>
                  </div>
                ))}
              </div>

              {/* Link rapidi: OpenWeather, GitHub del progetto e Source */}
              <div className="d-flex gap-3 mb-5 ">
                <a
                  href="https://openweathermap.org"
                  target="_blank"
                  rel="noreferrer"
                  className="settings-link settings-link--blue d-flex align-items-center justify-content-center gap-2 p-3 stat-label"
                >
                  <GeoAltFill /> OpenWeather
                </a>
                <a
                  href="https://github.com/andreeasamoila1/weather-web-app"
                  target="_blank"
                  rel="noreferrer"
                  className="settings-link d-flex align-items-center justify-content-center gap-2 p-3 stat-label"
                >
                  <Github /> GitHub
                </a>
                <a
                  href="#"
                  className="settings-link d-flex align-items-center justify-content-center gap-2 p-3 stat-label"
                >
                  <CodeSlash /> Source
                </a>
              </div>

              {/* Footer della pagina con copyright dinamico */}
              <div className="text-center coords-text settings-footer-note">
                © {new Date().getFullYear()} — Built with React & OpenWeather
                API
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Settings;
