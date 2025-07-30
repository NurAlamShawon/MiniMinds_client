import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://parcel-pilot-website-server.vercel.app",
});
const Useaxios = () => {
    return (
       axiosInstance
    );
};

export default Useaxios;