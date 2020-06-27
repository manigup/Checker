import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Login from "./SignIn";
import Register from "./SignUp";
import PDFViewer from "./PDF";
import Dashboard from "./Dashboard";
import Uploads from "./Uploads";
import "./index.css";

const THEME = createMuiTheme({
  typography: {
    fontFamily: `'Balsamiq Sans', cursive`,
  },
});

const App = () => (
  <MuiThemeProvider theme={THEME}>
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/signup" component={Register} />
      <Route exact path="/pdf/:file" component={PDFViewer} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/uploads/:aid" component={Uploads} />
    </Router>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
