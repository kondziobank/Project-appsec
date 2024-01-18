import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import ResendConfirmationEmail from "src/components/Common/ResendConfirmationEmail";
import { logoutUser } from "src/store/actions";

interface IUnverifiedAccountInfo {
  user: any;
  t: any;
}
  
const UnverifiedAccountInfo = (props: IUnverifiedAccountInfo) => {
  const dispatch = useDispatch();
  const history = useHistory();

  function handleLogout(event: any) {
    event.preventDefault();
    dispatch(logoutUser(history))
  }

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', width: '500px' }}>
        <h3>{props.t('unverified_account_info.hi')}, {props.user.name}</h3>
        <p>
          {props.t('unverified_account_info.account_have_to_be_verified')}
        </p>
        {!props.user.emailConfirmed ? (
          <p>
            {props.t('unverified_account_info.send_confirmation_link_prefix')} <ResendConfirmationEmail>{props.t('unverified_account_info.send_confirmation_link_again')}</ResendConfirmationEmail>
          </p>
        ) : null}
        <p>{props.t('unverified_account_info.logout_prefix')} <Link to="/logout" onClick={handleLogout}>link</Link></p>
      </div>
    </div>
  )
}

export default withTranslation()(UnverifiedAccountInfo);
