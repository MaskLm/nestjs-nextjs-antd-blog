'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { Oauth2LoginFunc } from './api/oauth2Login';
import contextAccountStore from '../../accountStore';
import getAvatarURL from '../../tools/account/getAvatar';
import { message } from 'antd';

const Oauth2CallbackPage = () => {
  const accountStore = useContext(contextAccountStore);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  async function onFinish(values: any) {
    try {
      const account = await Oauth2LoginFunc(values);
      accountStore.setAccount(account);
      accountStore.setAvatarURL(await getAvatarURL(account));
      message.success('Login Success');
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.push('/result/deny');
      }
    }
  }
  useEffect(() => {
    if (!token) {
      router.push('/result/failed');
    } else {
      onFinish({ token });
      router.push('/');
    }
  }, [token]);
  return <div>Redirecting...</div>;
};

export default Oauth2CallbackPage;
