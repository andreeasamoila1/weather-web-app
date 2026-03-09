import { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { CloudyFill, Gear, Search } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { fetchWeatherByCity } from "../redux/actions/weatherActions.js";
import { useNavigate } from "react-router-dom";
/**
 * WeatherNavbar component
 * Navbar principale dell'app. Contiene:
 * - Brand/logo a sinistra
 * - Orologio live (aggiornato ogni secondo) e data corrente al centro
 * - Barra di ricerca per città a destra
 * - Pulsante per navigare alla pagina Settings
 *
 * È completamente responsive: su mobile collassa in un hamburger menu
 * e il pulsante Settings viene spostato fuori dal collapse per restare sempre visibile.
 */
const WeatherNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Stato locale per il testo della ricerca
  const [city, setCity] = useState("");

  // Stato locale per l'orario corrente, aggiornato ogni secondo tramite interval
  const [time, setTime] = useState(new Date());

  // Avvio un interval che aggiorna `time` ogni 1000ms per avere un orologio live.
  // Il cleanup nel return evita memory leak quando il componente viene smontato.
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Formato l'orario separando ore:minuti dal suffisso AM/PM
  // così posso stilizzarli in modo diverso nel JSX (es. AM/PM più piccolo)
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  const formattedHHMM = formattedTime.slice(0, -3);
  const formattedAmPm = formattedTime.slice(-2);
  const formattedDay = time.toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });

  // Gestisce il submit della form di ricerca:
  // dispatcha l'action per fetchare il meteo della città cercata,
  // poi svuota il campo di input.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      dispatch(fetchWeatherByCity(city.trim()));
      setCity("");
    }
  };

  return (
    <Navbar expand="lg" className="mx-2 mx-md-4 p-0">
      <Container fluid className="py-3 px-2">
        {/* Logo */}
        <Navbar.Brand href="#" className="d-flex align-items-center text-white">
          <CloudyFill className="cloud mx-2 fs-1 text-white" />
          <span className="fs-3">Weather</span>
        </Navbar.Brand>

        {/* Su mobile: icona Settings e hamburger toggle sempre visibili fuori dal collapse */}
        <div className="d-flex align-items-center gap-2 d-lg-none">
          <Button
            variant="transparent"
            className="px-2 py-0 text-white d-lg-none"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >
            <Gear className="fs-3" />
          </Button>
          <Navbar.Toggle
            aria-controls="main-nav"
            className="border-0"
            style={{ filter: "invert(1)" }}
          />
        </div>

        {/* Contenuto collassabile: orologio, ricerca, settings (solo desktop) */}
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto" />

          {/* Orologio live e data – visibili solo su desktop */}
          <div className="d-none d-lg-flex align-items-center gap-4 me-4 text-white">
            <div className="fs-5 lh-1">
              {formattedHHMM} <small className="fs-6">{formattedAmPm}</small>
            </div>
            <div className="fs-5 lh-1">{formattedDay}</div>
          </div>

          {/* Form di ricerca per città */}
          <Form onSubmit={handleSubmit} className="d-flex gap-2 my-2 my-lg-0">
            <Form.Control
              className="bg-transparent border-0 text-white"
              type="text"
              placeholder="Search..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Button
              type="submit"
              variant="transparent"
              className="px-3 py-0 text-white"
            >
              <Search className="fs-3" />
            </Button>
          </Form>

          {/* Pulsante Settings – visibile solo su desktop (su mobile è fuori dal collapse) */}
          <Button
            variant="transparent"
            className="px-3 py-0 text-white my-2 my-lg-0 d-none d-lg-block"
            aria-label="Settings"
            onClick={() => navigate("/settings")}
          >
            <Gear className="fs-3" />
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default WeatherNavbar;
