import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CloudyFill, HouseFill } from "react-bootstrap-icons";
import { getTimeOfDay } from "../utils/timeOfDay";
import { selectWeather } from "../redux/reducers/weatherReducer";

/**
 * NotFound component
 * Pagina 404 mostrata quando l'utente naviga su un URL non esistente.
 * Usa lo stesso tema dinamico (day/night/dawn/dusk) della Home
 * per mantenere coerenza visiva con il resto dell'app.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const weather = useSelector(selectWeather);
  const timeOfDay = getTimeOfDay(weather);

  return (
    <div className={`weather-root theme-${timeOfDay}`}>
      <div className="weather-content d-flex align-items-center justify-content-center">
        <div className="text-center text-white px-4">
          {/* Icona cloud */}
          <div className="mb-4" style={{ opacity: 0.4 }}>
            <CloudyFill style={{ fontSize: "5rem" }} />
          </div>

          {/* Codice errore */}
          <div
            style={{
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 200,
              fontSize: "clamp(5rem, 20vw, 10rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              opacity: 0.9
            }}
          >
            404
          </div>

          {/* Messaggio */}
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginTop: "1rem",
              marginBottom: "2.5rem"
            }}
          >
            Questa pagina non esiste
          </p>

          {/* Pulsante torna alla Home */}
          <button
            onClick={() => navigate("/")}
            className="back-btn d-inline-flex align-items-center gap-2 px-4"
            style={{
              width: "auto",
              height: "44px",
              borderRadius: "14px",
              fontSize: "0.8rem",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.08em"
            }}
          >
            <HouseFill />
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
