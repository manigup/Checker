import React from "react";
import { Redirect } from "react-router-dom";
import UploadsList from "./uploads";

const Uploads = () => {
  const auth = JSON.parse(localStorage.getItem("checker"));
  if (auth) {
    return <UploadsList user={auth} />;
  } else {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }
};

export default Uploads;
