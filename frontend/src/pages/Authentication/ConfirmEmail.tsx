import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { confirmAccount } from "src/helpers/api_helper";
import FullScreenNotification from "../FullScreenNotification";

interface IConfirmEmail {
  match: any;
  t: any;
}

const ConfirmEmail = (props: IConfirmEmail) => {
  const { token } = props.match.params;
  const history = useHistory();
  const [message, setMessage] = useState<string|null>(null);

  useEffect(() => {
    confirmAccount(token)
      .then(() => setMessage(props.t('confirm_email.successfully_confirmed')))
      .catch(() => setMessage(props.t('confirm_email.could_not_confirm')))
  }, []);

  useEffect(() => {
    if (message !== null) {
      setTimeout(() => {
        history.replace('/');
      }, 3000);
    }
  }, [message])


  if (!message) {
    return null;
  }

  return (
    <FullScreenNotification>
      <h3>{message}</h3>
      <p>{props.t('confirm_email.redirect_info')}</p>
    </FullScreenNotification>
  )
}

export default withTranslation()(ConfirmEmail);
