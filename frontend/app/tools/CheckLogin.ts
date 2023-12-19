'use client';
import { checkIfTokenExpired } from './jwtTools';

const checkLogin = async () => {
  const storedAccount = localStorage.getItem('account');
  const accountTemp = storedAccount ? JSON.parse(storedAccount) : null;
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    if (accountTemp && !(await checkIfTokenExpired(refreshToken))) {
      return true;
    }
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('account');
  return false;
};

export default checkLogin;
