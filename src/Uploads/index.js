import React from "react";
import { Redirect } from "react-router-dom";
import UploadsList from "./uploads";

const Uploads = (props) => {
  if (props.user) {
    return <UploadsList user={props.user} route={props.route} />;
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
