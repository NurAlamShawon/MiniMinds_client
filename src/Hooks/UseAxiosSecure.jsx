import axios from "axios";
import React, { useContext } from "react";
import { ValueContext } from "../Context/ValueContext";
import { Navigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: "https://parcel-pilot-website-server.vercel.app",
});

const useAxiosSecure = () => {
  const { currentuser ,signout} = useContext(ValueContext);




  axiosInstance.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${currentuser.accessToken}`;

    return config;
  });





  axiosInstance.interceptors.response.use(res=>{
 return res;
  },error=>{
    if(error.response?.status === 401 || error.response?.status === 403){
     signout().then(()=>{console.log("Signout For Status 401")});
     Navigate('/forbidden')
    }
    
  });
  

  return axiosInstance;
};

export default useAxiosSecure;
