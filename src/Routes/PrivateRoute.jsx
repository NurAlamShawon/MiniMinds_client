import React, { useContext } from 'react';
import { ValueContext } from '../Context/ValueContext';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {
   
const {loading,currentuser}=useContext(ValueContext);

let location = useLocation();
    if(loading){
        return <span className="loading loading-spinner loading-xl"></span>
    }
  if (!currentuser) {
     return <Navigate state={ location?.pathname }  to="/authentication"/>;
  
  }
      return children;
};

export default PrivateRoute;