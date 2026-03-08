import Navbar from "./Navbar";
import { Col, Container, Row } from "react-bootstrap";
import { GeoAltFill, SunriseFill, SunsetFill } from "react-bootstrap-icons";

const Home = () => {
  return (
    <Container fluid className="px-3 px-md-5 py-4 py-md-5 ">
      <Row className="g-4 align-items-center">
        <Col
          xs={12}
          md={4}
          className="d-none d-md-flex flex-column text-md-start order-md-1"
        >
          <div className="condition-display mb-1">Clear</div>
          <div
            className="fs-6 text-capitalize mb-4"
            style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}
          >
            clear sky
          </div>
          <div className="mb-4 d-flex flex-column align-items-md-start gap-1">
            <div className="location-tag">
              <GeoAltFill style={{ color: "rgba(130,160,255,0.9)" }} />
              LODI, IT
            </div>
            <div className="coords-text">45.32°N — 9.50°E</div>
          </div>
        </Col>

        <Col
          xs={6}
          md={4}
          className="d-flex align-items-center justify-content-center order-1 order-md-2"
        >
          <img
            src="https://openweathermap.org/img/wn/01d@4x.png"
            alt="clear sky"
            className="w-100 weather-icon-wrap"
            style={{ maxWidth: "260px" }}
          />
        </Col>

        <Col
          xs={6}
          md={4}
          className="d-flex flex-column align-items-center align-items-md-end justify-content-center text-center text-md-end order-1 order-md-3"
        >
          <div className="temp-display">16°</div>
          <div className="temp-range mb-4">16° / 17°</div>
          <div className="wind-pressure mb-4 text-center text-md-end d-none d-md-block">
            <div>
              WIND <span>2.35 M/S</span>
            </div>
            <div>
              PRESSURE <span>1025 HPA</span>
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.75rem",
                marginTop: "4px"
              }}
            >
              — LODI
            </div>
          </div>
          <div className="sun-card mt-2 d-none d-md-flex">
            <div className="d-flex flex-column align-items-center">
              <SunriseFill
                style={{ fontSize: "1.6rem", color: "rgba(255,210,80,0.9)" }}
              />
              <div className="sun-time">06:48</div>
              <div className="sun-label">Sunrise</div>
            </div>
            <div className="sun-divider" />
            <div className="d-flex flex-column align-items-center">
              <SunsetFill
                style={{ fontSize: "1.6rem", color: "rgba(180,200,255,0.9)" }}
              />
              <div className="sun-time">18:17</div>
              <div className="sun-label">Sunset</div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
