import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});
const Useaxios = () => {
    return (
       axiosInstance
    );
};

export default Useaxios;