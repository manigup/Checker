import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import { str } from "../firebase";
import "./viewer.css";

const Viewer = (props) => {
  const viewer = useRef(null);

  useEffect(() => {
    str
      .ref(props.route.match.params.file)
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
