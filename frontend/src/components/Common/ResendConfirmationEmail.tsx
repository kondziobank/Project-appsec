import { useState } from "react";
import { Link } from "react-router-dom";
import { resendConfirmationToken } from "src/helpers/api_helper";


interface IResendConfirmationEmail {
  children: any;
}

const ResendConfirmationEmail = (props: IResendConfirmationEmail) => {
  const [sent, setSend] = useState(false);

  function sendConfirmationEmail() {
    resendConfirmationToken().catch(() => {});
    setSend(true);
  }

  return (
    <Link to="#" onClick={sendConfirmationEmail} style={{ pointerEvents: sent ? 'none' : 'auto' }}>
      {props.children}
    </Link>
  );
};

export default ResendConfirmationEmail;
