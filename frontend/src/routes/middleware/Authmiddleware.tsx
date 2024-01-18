import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Redirect, useHistory } from "react-router-dom";
import { fetchUserInfo } from "src/store/actions";
import { fetchTableOfContents } from "src/store/articles/actions";
import UnverifiedAccountInfo from 'src/pages/Authentication/UnverifiedAccountInfo';

interface IAuthLayout {
  component: any;
  layout: any;
  isAuthProtected: any;
  path?: string;
  exact?: boolean;
  key?: number;
  name?: any;
}

const Authmiddleware = ({
  component,
  layout,
  isAuthProtected,
  path,
  exact,
  key,
  name,
  ...rest
}: IAuthLayout) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.user);
  const tableOfContents = useSelector((state: any) => state.articles.tableOfContents);

  useEffect(() => {
    if (isAuthProtected && localStorage.getItem("authUser") != null) {
      if (!userInfo) {
        dispatch(fetchUserInfo());
      }

      if (!tableOfContents) {
        dispatch(fetchTableOfContents())
      }
    }
  }, []);

  const Layout = layout;
  const Component = component;

  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthProtected) {
          if (localStorage.getItem("authUser") == null) {
            return <Redirect to={{ pathname: "/login", state: { from: props.location } }}/>;
          } else if (userInfo == null) {
            return null;
          } else if (userInfo.role.permissions.length === 0) {
            return <UnverifiedAccountInfo user={userInfo} />
          } else if (tableOfContents == null) {
            return null;
          } else if (history.location.pathname === '/') {
            return <Redirect to={`/a/${tableOfContents.slug}`} />
          }
        }

        return (
          <Layout>
            <Component {...props} name={name}/>
          </Layout>
        );
      }}
    />
  );
};

export default Authmiddleware;
