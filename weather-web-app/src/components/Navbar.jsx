import { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { CloudyFill, Gear, Search } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { fetchWeatherByCity } from "../redux/actions/weatherActions.js";
import { useNavigate } from "react-router-dom";

const WeatherNavbar = () => {
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
        <Navbar.Brand href="#" className="d-flex align-items-center text-white">
          <CloudyFill className="cloud mx-2 fs-1 " />
          <span className="fs-3">Weather</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="main-nav"
          className="border-0"
          style={{ filter: "invert(1)" }}
        />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto" />
          <div className="d-none d-lg-flex align-items-center gap-4 me-4 ">
            <div className="fs-5 lh-1">
              {formattedHHMM} <small className="fs-6">{formattedAmPm}</small>
            </div>
            <div className="fs-5 lh-1">{formattedDay}</div>
          </div>
          <Form onSubmit={handleSubmit} className="d-flex gap-2 my-2 my-lg-0">
            <Form.Control
              className="bg-transparent border-0 "
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
