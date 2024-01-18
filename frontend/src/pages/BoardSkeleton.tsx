import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MetaTags from "react-meta-tags";

//import Breadcrumbs
import Breadcrumbs from "../components/Common/Breadcrumb"
import { Container } from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
import Droppable from "src/components/DragNDrop/Droppable";
import { useSelector } from "react-redux";
import { getArticle, pushArticleToApi } from "src/helpers/api_helper";

interface IBoardSkeleton {
  slug: string;
  match: any;
}

const BoardSkeleton = (props: IBoardSkeleton) => {
  const history = useHistory();

  const { slug } = props.match.params;
  const [article, setArticle] = useState<any>(null);
  const isEditMode = useSelector((state: any) => state.Layout.isEditMode);

  useEffect(() => {
    getArticle(slug)
      .then(article => setArticle(article))
      .catch(() => history.replace('/not-found'))
  }, [slug]);

  function handleArticleUpdate(article: any) {
    if (isEditMode) {
      pushArticleToApi(slug, article);
    }
  }

  if (!article) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Web Crypto Center</title>
        </MetaTags>
        <Container fluid style={{ minHeight: "80vh" }}>
          <div>
            <Droppable
              board={article}
              onBoardUpdate={handleArticleUpdate}
              key={article._id}
            />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(BoardSkeleton);
