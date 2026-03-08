import { Container, Nav, Navbar } from "react-bootstrap";
import { CloudyFill } from "react-bootstrap-icons";

const WeatherNavbar = () => {
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default WeatherNavbar;
