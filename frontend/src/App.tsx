import React from "react";
import { Redirect } from "react-router-dom";
import BoardSkeleton from "./pages/BoardSkeleton";

import { Switch, BrowserRouter as Router } from "react-router-dom";

//Authentication pages
import Login from "src/pages/Authentication/Login";
import Register from "src/pages/Authentication/Register";
import ForgetPassword from "src/pages/Authentication/ForgetPassword";

//redux
import { useSelector } from "react-redux";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import "./assets/scss/preloader.scss";

import NotFound from "./pages/NotFound";
import OAuth2CallbackPage from "./pages/Authentication/OAuth2CallbackPage";
import ConfirmEmail from "./pages/Authentication/ConfirmEmail";
import ResetPassword from "./pages/Authentication/ResetPassword";
import SearchPage from "./pages/SearchPage";

interface RouteProps {
  path: string;
  component: any;
  exact?: boolean;
  name?: any;
}

const App = () => {
  const { layoutType } = useSelector((state: any) => ({
    layoutType: state.Layout.layoutType,
  }));

  const authRoutes: Array<RouteProps> = [
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: '/auth/:provider/callback', component: OAuth2CallbackPage },
    { path: '/confirm/:token', component: ConfirmEmail },
    { path: '/reset-password/:token', component: ResetPassword },
    { path: "/forgot-password", component: ForgetPassword },
  ];

  const userRoutes: Array<RouteProps> = [
    { path: "/not-found", component: () => <NotFound /> },
    { path: "/a/:slug", component: BoardSkeleton },
    { path: "/s/:query", component: SearchPage },
    { path: "*", component: () => <Redirect to="/not-found" /> },
  ];

  const Layout = VerticalLayout
  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}
          {userRoutes.map((route: any, idx: number) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
              name={route.name}
            />
          ))}
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
