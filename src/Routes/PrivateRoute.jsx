import React, { useContext } from "react";
import { ValueContext } from "../Context/ValueContext";
import { useLocation } from "react-router";
import { Navigate } from "react-router";
import UseUserRole from "../Hooks/UseuserRole";

const PrivateRoute = ({ children }) => {
  const { loading, currentuser } = useContext(ValueContext);
  const { role } = UseUserRole();

  let location = useLocation();
  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }
  if (!currentuser) {
    return <Navigate state={location?.pathname} to="/authentication" />;
  }
  if (role !== "user") {
      return <Navigate state={location?.pathname}  to="/forbidden"/>;
  }
  return children;
};

export default PrivateRoute;
