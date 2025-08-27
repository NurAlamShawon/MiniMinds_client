import React from "react";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../Forbidden";
import UseUserRole from "../../Hooks/UseuserRole";

const Dashboard = () => {
  const { role } = UseUserRole();


  if (role === "admin") {
    return <AdminDashboard/>;
  } else {
    return <Forbidden/> ;
  }
};

export default Dashboard;
