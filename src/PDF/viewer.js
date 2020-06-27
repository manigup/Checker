import React, { useRef, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import WebViewer from "@pdftron/webviewer";
import { str } from "../firebase";
import "./viewer.css";

const Viewer = (props) => {
  const viewer = useRef(null);
  const match = useRouteMatch();

  useEffect(() => {
    str
      .ref(match.params.file)
      .getDownloadURL()
      .then(function (url) {
        WebViewer(
          {
            path: "/lib",
            initialDoc: url,
          },
          viewer.current
        ).then((instance) => {});
      });
  }, []);

  return <div className="webviewer" ref={viewer}></div>;
};

export default Viewer;
