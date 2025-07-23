import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // your backend base URL
 //baseURL:'https://bodies-winter-democracy-nam.trycloudflare.com', 
 withCredentials: true,            // ✅ send cookies with requests
});

export default axiosInstance;
