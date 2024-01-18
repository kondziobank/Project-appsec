import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

interface BreadcrumbProps {
  path: string[];
  title: string;
}

const Breadcrumb = (props: BreadcrumbProps) => {
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{props.title}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {props.path.map((path, index) => (
                <BreadcrumbItem key={index} active={index === props.path.length - 1}>
                  <Link to="#">{path}</Link>
                </BreadcrumbItem>
              ))}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;
