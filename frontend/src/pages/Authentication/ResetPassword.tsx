import { useState } from "react"
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Alert, FormGroup, Label, Input, Button } from "reactstrap"
import { resetPassword } from "src/helpers/api_helper";
import { generatePasswordComplexityPolicyInfo, validatePasswordComplexity } from "src/logic/validators";
import FullScreenNotification from "../FullScreenNotification"

interface IResetPassword {
  match: any;
  t: any;
}

const ResetPassword = (props: IResetPassword) => {
  const { token } = props.match.params
  const history = useHistory();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string|null>(null);
  const [error, setError] = useState<boolean|null>(null);

  function handleResetPassword() {
    setMessage(null);

    if (!validatePasswordComplexity(password)) {
      setError(true);
      setMessage(generatePasswordComplexityPolicyInfo(props.t));
      return;
    }

    if (password !== confirmPassword) {
      setError(true);
      setMessage(props.t('reset_password.passwords_have_to_match'));
      return;
    }

    resetPassword(token, { password, confirmPassword })
      .then(() => {
        setError(false);
        setMessage(props.t('reset_password.reset_success'));

        setTimeout(() => {
          history.replace('/');
        }, 3000);
      })
      .catch(() => {
        setError(true);
        setMessage(props.t('reset_password.reset_error'));
      })
  }

  return (
    <FullScreenNotification>
      <h3>{props.t('reset_password.reset_password')}</h3>
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        {message ? (
          <Alert color={error ? 'danger' : 'success'}>
            {message}
          </Alert>
        ) : null}
        <FormGroup>
          <Label>{props.t('reset_password.new_password')}</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>{props.t('reset_password.confirm_password')}</Label>
          <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </FormGroup>
        <Button style={{ width: '100%' }} onClick={handleResetPassword}>{props.t('reset_password.reset_password')}</Button>        
      </div>
    </FullScreenNotification>
  )
}

export default withTranslation()(ResetPassword);
