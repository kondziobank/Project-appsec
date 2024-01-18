import { useEffect, useState } from "react";
import { getOAuth2AuthorizationUrl, OAuth2Provider } from "./api_helper";

interface IOAuth2Login {
    provider: OAuth2Provider;
    children: any;
    [key: string]: any;
}

const OAuth2Login = (props: IOAuth2Login) => {
  const [authorizationUrl, setAuthorizationUrl] = useState('#');
  
  useEffect(() => {
    getOAuth2AuthorizationUrl(props.provider)
      .then(url => setAuthorizationUrl(url))
  }, []);

  return (
    <a href={authorizationUrl} {...props}>
      {props.children}
    </a>
  )
}

export default OAuth2Login;
