'use client';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export async function checkJWTIsNoExpired(token: string): Promise<boolean> {
  try {
    const decoded = await jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    console.error('Failed to decode access token:', error);
    return false;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = await jwtDecode(refreshToken);
    const currentTime = Date.now() / 1000;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (decoded.exp < currentTime) {
      //清除localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('account');
      //跳转到登录页面
      const router = useRouter();
      router.push('/login');
    }
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + '/auth/refresh',
      { refreshToken },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
