import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { Row, Col, Container } from "reactstrap";
import CarouselPage from "./CarouselPage";
import { withTranslation } from "react-i18next";
import LanguageDropdown from "src/components/CommonForBoth/TopbarDropdown/LanguageDropdown";

interface IAuthRouteWrapper {
  title: string;
  children: any;
}

const AuthRouteWrapper = (props: IAuthRouteWrapper) => {
  return (
    <>
      <MetaTags>
        <title>{props.title} | Web Crypto Center</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3" style={{ maxHeight: '100vh' }}>
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/" className="d-block auth-logo">
                        <img src="/icons/logo-192.png" alt="" height="28" />{" "}
                        <span className="logo-txt">Web Crypto Center</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      {props.children}
                    </div>
                    <div className="mt-2 text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p className="mb-0">
                        Web Crypto Center - ©{new Date().getFullYear()} NMaszin
                      </p>
                      <LanguageDropdown />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </>
  );
}

export default withTranslation()(AuthRouteWrapper);
