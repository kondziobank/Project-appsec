import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <Container fluid={true}>
          <Row>
            <Col md={6}>
              {new Date().getFullYear()} © Politechnika Poznańska
            </Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                <Link to="#" className="ms-1 text-decoration-underline">
                  NMaszin
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
