'use client';
import axios, { AxiosError } from 'axios';

export async function LoginFunc(userData: any) {
  try {
    const res = await axios.post('/api/login', {
      ...userData,
    });
    console.log(res.data);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('account', JSON.stringify(res.data.account));
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
