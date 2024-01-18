import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { loginUser } from "../../store/actions";
import OAuth2Login from "src/helpers/OAuth2Login";
import { withTranslation } from "react-i18next";
import AuthRouteWrapper from "./AuthRouteWrapper";

interface LoginProps {
  history: object;
  t: any;
}

const Login = (props: LoginProps) => {
  const dispatch = useDispatch();
  const authError = useSelector((state: any) => state.auth.error);
  const { history } = props;

  const handleValidSubmit = (_event: any, credentials: any) => {
    dispatch(loginUser(credentials, history));
  };

  return (
    <AuthRouteWrapper title="Login">
      <div className="text-center">
        <h5 className="mb-0">{props.t('Log In')}</h5>
      </div>
      <AvForm
        className="custom-form mt-2 pt-2"
        onValidSubmit={handleValidSubmit}
      >
        {authError ? <Alert color="danger">{props.t('Invalid Credentials')}</Alert> : null}
        <div className="mb-3">
          <AvField
            name="email"
            label={props.t('E-mail address')}
            className="form-control"
            placeholder={props.t('E-mail address')}
            type="email"
            required
            errorMessage={props.t('av.email_invalid')}
          />
        </div>
        <div className="mb-3">
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <label className="form-label">{props.t('Password')}</label>
            </div>
            <div className="flex-shrink-0">
              <div className="">
                <Link
                  to="/forgot-password"
                  className="text-muted"
                >
                  {props.t('login.forgot_password')}
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <AvField
              name="password"
              type="password"
              className="form-control"
              required
              placeholder={props.t('Password')}
              errorMessage={props.t('av.password_invalid')}
            />
          </div>
        </div>
        <div className="mb-3">
          <button
            className="btn btn-primary w-100 waves-effect waves-light"
            type="submit"
          >
            {props.t('Log In')}
          </button>
        </div>
      </AvForm>

      <div className="mt-4 text-center">
        <h5 className="font-size-14 mb-3">{props.t('Sign in with')}</h5>
        <ul className="list-inline">
          <li className="list-inline-item">
            <OAuth2Login provider="facebook" className="social-list-item bg-primary text-white border-primary">
              <i className="mdi mdi-facebook" />
            </OAuth2Login>
          </li>
          <li className="list-inline-item">
            <OAuth2Login provider="google" className="social-list-item bg-danger text-white border-danger">
              <i className="mdi mdi-google" />
            </OAuth2Login>
          </li>
          <li className="list-inline-item">
            <OAuth2Login provider="discord" className="social-list-item bg-secondary text-white border-secondary">
              <i className="mdi mdi-discord" />
            </OAuth2Login>
          </li>
        </ul>
      </div>

      <div className="mt-5 text-center">
        <p className="text-muted mb-0">
          {props.t('Dont have an account')}{" "}
          <Link
            to="/register"
            className="text-primary fw-semibold"
          >
            {" "}
            {props.t('Sign up now')}
          </Link>{" "}
        </p>
      </div>
    </AuthRouteWrapper>
  );
};

export default withTranslation()(Login);
