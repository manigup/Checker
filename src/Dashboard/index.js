import React from "react";
import { Redirect } from "react-router-dom";
import Student from "./student";
import Teacher from "./teacher";
import "./dashboard.css";

const Dashboard = () => {
  const auth = JSON.parse(localStorage.getItem("checker"));
  if (auth) {
    if (auth.type === "S") {
      return <Student user={auth} />;
    } else return <Teacher user={auth} />;
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

export default Dashboard;
