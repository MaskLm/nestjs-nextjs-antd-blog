import axios, { AxiosError } from 'axios';

export const RegFunc = async (userData: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + '/account',
      { ...userData },
    );
    return response;
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
