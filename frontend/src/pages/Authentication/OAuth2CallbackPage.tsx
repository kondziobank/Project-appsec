import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { loginByOAuth2 } from "src/helpers/api_helper";
import { authError, loginOAuth2User } from "src/store/actions";

interface IOAuth2CallbackPage {
  location: any;
  match: any;
  history: any;
}

const OAuth2CallbackPage = (props: IOAuth2CallbackPage) => {
  const dispatch = useDispatch();
  const { provider } = props.match.params;

  const query = useMemo(() => new URLSearchParams(props.location.search), [props.location.search])
  const code = query.get('code');
  const state = query.get('state');
  const errorMessage = query.get('error_message');
  const credentials = { code, state };

  useEffect(() => {
    if (code === null || state === null) {
      dispatch(authError(errorMessage ?? 'OAuth2 error'));
      props.history.replace('/login');
    } else {
      dispatch(loginOAuth2User(provider, credentials, props.history))
    }
  }, [])

  return null;
}

export default OAuth2CallbackPage;
