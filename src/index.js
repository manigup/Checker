import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./SignIn";
import Register from "./SignUp";
import PDFViewer from "./PDF";
import Dashboard from "./Dashboard";
import Uploads from "./Uploads";
import "./index.css";

const auth = JSON.parse(localStorage.getItem("checker"));

ReactDOM.render(
  <Router>
    <Route exact path="/" render={() => <Login user={auth} />} />
    <Route exact path="/signup" render={() => <Register user={auth} />} />
    <Route
      exact
      path="/pdf/:file"
      render={({ ...props }) => <PDFViewer user={auth} route={props} />}
    />
    <Route exact path="/dashboard" render={() => <Dashboard user={auth} />} />
    <Route
      exact
      path="/uploads/:aid"
      render={({ ...props }) => <Uploads user={auth} route={props} />}
    />
  </Router>,
  document.getElementById("root")
);
