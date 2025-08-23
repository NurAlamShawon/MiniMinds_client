import React, { useContext } from 'react';
import { ValueContext } from '../Context/ValueContext';
import { Navigate, useLocation } from 'react-router';
import UseUserRole from '../Hooks/UseuserRole';

const AdminRoute = ({children}) => {
   
const {loading,currentuser}=useContext(ValueContext);
const {role , isloading}=UseUserRole();

let location = useLocation();
    if(loading|| isloading){
        return <span className="loading loading-spinner loading-xl"></span>
    }
  if (!currentuser || role!=='admin') {
     return <Navigate state={ location?.pathname }  to="/forbidden"/>;
  
  }
      return children;
};;

export default AdminRoute;