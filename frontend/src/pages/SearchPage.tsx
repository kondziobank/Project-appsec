import MetaTags from "react-meta-tags";
import Breadcrumbs from "../components/Common/Breadcrumb"
import { Container } from "reactstrap";
import { withTranslation } from "react-i18next";

interface ISearchPage {
  match: any;
}

const SearchPage = (props: ISearchPage) => {
  const { query } = props.match.params;

  return (
    <div className="page-content">
      <MetaTags>
        <title>Search | Web Crypto Center</title>
      </MetaTags>
    <Container fluid style={{ minHeight: "80vh" }}>
      <Breadcrumbs
        title={`Wyniki wyszukiwania frazy: ${query}`}
        path={[]}
      />
      <div>
        Brak wyników
      </div>
    </Container>
    </div>
  );
};

export default withTranslation()(SearchPage);
