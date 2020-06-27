import React from "react";
import { Redirect } from "react-router-dom";
import Student from "./student";
import Teacher from "./teacher";

const Dashboard = (props) => {
  if (props.user) {
    if (props.user.type === "S") {
      return <Student user={props.user} />;
    } else return <Teacher user={props.user} />;
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
