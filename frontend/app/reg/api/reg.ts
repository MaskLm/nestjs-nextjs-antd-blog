'use client';
import axios, { AxiosError } from 'axios';

export const RegFunc = async (userData: any) => {
  try {
    await axios.post(process.env.NEXT_PUBLIC_API_URL + '/account', {
      ...userData,
    });
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
};
