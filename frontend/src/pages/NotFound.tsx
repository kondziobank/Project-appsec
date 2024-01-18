import React from "react";
import { withTranslation } from "react-i18next";
import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";

const NotFound = (props: any) => {
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Not Found | Web Crypto Center</title>
        </MetaTags>
        <Container fluid style={{ minHeight: "80vh" }}>
          <div>
            <h3>{props.t('Not Found')}</h3>
            <p>{props.t('The site does not exist')}</p>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(NotFound);
