import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../store/UserContext';
const API_URL = import.meta.env.VITE_API_URL;

const useAxios = () => {
  const { user } = useContext(UserContext);

  const axiosInstance = axios.create({
    baseURL: API_URL
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (user) {
        config.headers.Authorization = `Bearer ${ user.refreshToken }`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
