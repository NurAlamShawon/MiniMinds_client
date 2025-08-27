import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://mini-minds-server.vercel.app",
});
const Useaxios = () => {
    return (
       axiosInstance
    );
};

export default Useaxios;