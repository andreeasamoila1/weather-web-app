import { Col, Container, Row } from "react-bootstrap";
import {
  ArrowLeft,
  CloudyFill,
  CodeSlash,
  GeoAltFill,
  Github
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const infos = [
    { label: "Versione", value: "1.0.0" },
    { label: "Framework", value: "React + Redux Toolkit" },
    { label: "UI Library", value: "React Bootstrap" },
    { label: "Dati meteo", value: "OpenWeather API" },
    { label: "Geolocaliz.", value: "react-geolocated" }
  ];

  return (
    <div className="weather-root theme-night">
      <div className="weather-content">
        <Container fluid className="px-3 px-md-5 py-4 text-white">
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
                  href="https://github.com"
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
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Settings;
