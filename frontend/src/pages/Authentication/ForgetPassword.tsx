import { useState } from "react";
import { Alert } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { sendResetPasswordToken } from "src/helpers/api_helper";
import AuthRouteWrapper from "./AuthRouteWrapper";
import { withTranslation } from "react-i18next";

const ForgetPasswordPage = (props: any) => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string|null>(null);

  function handleValidSubmit(_event: any, values: any) {
    setMessage(null);
    sendResetPasswordToken(values.email)
      .then(() => {
        setError(false);
        setMessage(props.t('forget_password.email_sent'))
      })
      .catch(() => {
        setError(true);
        setMessage(props.t('forget_password.error'))
      })
  }

  return (
    <AuthRouteWrapper title="Forget password">
      <div className="text-center">
        <h5 className="mb-0">{props.t('forget_password.reset_password')}</h5>
      </div>

      {message ? (
        <Alert
          color={error ? 'danger' : 'success'}
          style={{ marginTop: "13px" }}
        >
          {message}
        </Alert>
      ) : null}

      <AvForm
        className="custom-form mt-4"
        onValidSubmit={(e: any, v: any) =>
          handleValidSubmit(e, v)
        }
      >
        <div className="mb-3">
          <AvField
            name="email"
            label="Email"
            className="form-control"
            placeholder="Enter email"
            type="email"
            required
          />
        </div>
        <div className="mb-3 mt-4">
          <button
            className="btn btn-primary w-100 waves-effect waves-light"
            type="submit"
          >
            {props.t('forget_password.reset')}
          </button>
        </div>
      </AvForm>

      <div className="mt-5 text-center">
        <p className="text-muted mb-0">
          <span>Remember it?{' '}</span>
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

export default withTranslation()(withRouter(ForgetPasswordPage));
