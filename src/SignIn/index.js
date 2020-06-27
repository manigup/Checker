import React from "react";
import { Redirect } from "react-router-dom";
import Login from "./login";

const SignIn = () => {
  const auth = JSON.parse(localStorage.getItem("checker"));
  if (!auth) {
    return <Login />;
  } else {
    return (
      <Redirect
        to={{
          pathname: "/dashboard",
        }}
      />
    );
  }
};

export default SignIn;
