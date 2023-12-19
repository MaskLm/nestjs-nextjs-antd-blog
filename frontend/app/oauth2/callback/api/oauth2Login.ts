'use client';
import axios, { AxiosError } from 'axios';

export async function Oauth2LoginFunc(userData: any) {
  try {
    const res = await axios.post('/api/oauth2/callback', {
      ...userData,
    });
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('account', JSON.stringify(res.data.account));
    return res.data.account;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (
      axiosError.isAxiosError &&
      axiosError.response &&
      axiosError.response.data
    ) {
      throw axiosError.response.data;
    } else {
      throw e;
    }
  }
}
