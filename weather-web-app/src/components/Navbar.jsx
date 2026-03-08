import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { CloudyFill } from "react-bootstrap-icons";

const WeatherNavbar = () => {
  const [time, setTime] = useState(new Date());

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
  return (
    <Navbar expand="lg" className="mx-2 mx-md-4 p-0">
      <Container fluid className="py-3 px-2">
        <Navbar.Brand href="#" className="d-flex align-items-center ">
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default WeatherNavbar;
