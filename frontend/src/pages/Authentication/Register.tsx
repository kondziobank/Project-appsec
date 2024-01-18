import { useState } from "react";
import { Link } from "react-router-dom";
import {  useDispatch } from "react-redux";
import { Alert } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { generatePasswordComplexityPolicyInfo, validatePasswordComplexity } from "src/logic/validators";
import AuthRouteWrapper from "./AuthRouteWrapper";
import { loginUser } from "src/store/actions";
import { signUp } from "src/helpers/api_helper";

const Register = (props: any) => {
  const { history } = props;
  const dispatch = useDispatch();

  const [error, setError] = useState(false);

  const handleValidSubmit = async (credentials: any) => {
    setError(false);

    try {
      await signUp(credentials);
      dispatch(loginUser({ email: credentials.email, password: credentials.password }, history));
    } catch (error) {
      setError(true);
    }
  };

  const passwordsComparator = (value: any, ctx: any) => {
    return value === ctx.password
      ? true
      : props.t('register.passwords_do_not_match')
  }

  const passwordComplexityValidator = (value: any) => {
    return validatePasswordComplexity(value) ? true : generatePasswordComplexityPolicyInfo(props.t);
  }

  return (
    <AuthRouteWrapper title="Register">
      <div className="text-center">
        <h5 className="mb-0">{props.t('Register Account')}</h5>
      </div>
      <AvForm
        className="needs-validation custom-form mt-4 pt-2"
        onValidSubmit={(e: any, v: any) => {
          handleValidSubmit(v);
        }}
      >
        {error ? (
          <Alert color="danger">{props.t('register.registration_error')}</Alert>
        ) : null}

        <div className="mb-3">
          <AvField
            id="email"
            name="email"
            label={props.t('E-mail address')}
            className="form-control"
            placeholder={props.t('E-mail address')}
            type="email"
            required
          />
        </div>

        <div className="mb-3">
          <AvField
            name="name"
            label={props.t('Username')}
            type="text"
            required
            placeholder={props.t('Username')}
          />
        </div>
        <div className="mb-3">
          <AvField
            name="password"
            label={props.t('Password')}
            type="password"
            required
            placeholder={props.t('Password')}
            validate={{ passwordComplexityValidator }}
          />
        </div>
        <div className="mb-3">
          <AvField
            name="confirmPassword"
            label={props.t('Confirm password')}
            type="password"
            required
            placeholder={props.t('Confirm password')}
            validate={{ passwordsComparator }}
          />
        </div>
        <div className="mb-4">
          <p className="mb-0">
            {props.t('register.terms_of_use_prefix')}
            {" "}
            <Link to="/terms-of-use" className="text-primary">
              {props.t('register.terms_of_use')}
            </Link>
            {" "}
            Web Crypto Center
          </p>
        </div>
        <div className="mb-3">
          <button
            className="btn btn-primary w-100 waves-effect waves-light"
            type="submit"
          >
            {props.t('register.register')}
          </button>
        </div>
      </AvForm>

      <div className="mt-5 text-center">
        <p className="text-muted mb-0">
          {props.t('register.already_have_an_account')}
          {" "}
          <Link
            to="/login"
            className="text-primary fw-semibold"
          >
            {props.t('Log In')}
          </Link>
        </p>
      </div>
    </AuthRouteWrapper>
  );
};

export default withTranslation()(Register);
