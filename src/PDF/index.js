import React from "react";
import { Redirect } from "react-router-dom";
import Viewer from "./viewer";

const PDFViewer = (props) => {
  const auth = JSON.parse(localStorage.getItem("checker"));
  if (auth) {
    return <Viewer user={auth} />;
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
