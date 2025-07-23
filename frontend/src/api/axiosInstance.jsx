import axios from 'axios';

const axiosInstance = axios.create({
 // baseURL: 'http://localhost:3000', // your backend base URL
 baseURL:'https://deploy-table-reservation-api.vercel.app/', 
 withCredentials: true,            // ✅ send cookies with requests
});

export default axiosInstance;
