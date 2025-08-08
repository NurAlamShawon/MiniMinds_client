import React from "react";
import UseUserRole from "../../Hooks/UseUserRole";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../Forbidden";

const Dashboard = () => {
  const { role } = UseUserRole();
  console.log(role)

  if (role === "admin") {
    return <AdminDashboard/>;
  } else {
    return <Forbidden/> ;
  }
};

export default Dashboard;
