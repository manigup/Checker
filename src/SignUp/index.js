import React from "react";
import { Redirect } from "react-router-dom";
import Register from "./register";

const SignIn = () => {
  const auth = JSON.parse(localStorage.getItem("checker"));
  if (!auth) {
    return <Register />;
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
