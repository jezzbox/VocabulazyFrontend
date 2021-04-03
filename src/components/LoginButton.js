import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({className}) => {
  const { loginWithRedirect } = useAuth0();

  return <button className={className} onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;