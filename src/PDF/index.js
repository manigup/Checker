import React from "react";
import { Redirect } from "react-router-dom";
import Viewer from "./viewer";

const PDFViewer = (props) => {
  if (props.user) {
    return <Viewer user={props.user} route={props.route} />;
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

export default PDFViewer;
