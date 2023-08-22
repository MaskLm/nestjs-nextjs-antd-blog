import axios from 'axios';
import { checkIfTokenExpired, refreshAccessToken } from './jwtTools';
import { message } from 'antd';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && refreshToken) {
    const isTokenExpired = checkIfTokenExpired(accessToken);

    if (isTokenExpired) {
      try {
        const ans = await refreshAccessToken(refreshToken);
        const newAccessToken = ans.accessToken;
        localStorage.setItem('accessToken', ans.accessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        message.error('Failed to refresh access token:' + error);
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

export default axiosInstance;
