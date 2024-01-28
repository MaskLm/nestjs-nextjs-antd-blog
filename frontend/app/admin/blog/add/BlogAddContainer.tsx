'use client';

import { message } from 'antd';
import React, { useEffect } from 'react';
import AxiosInterceptorsJwt from '../../../tools/AxiosInterceptorsJwt';
import { isAxiosError } from 'axios';
import checkAdmin from '../../../tools/CheckAdmin';
import { useRouter } from 'next/navigation';
import BlogForm from '../blogForm';

const BlogAddContainer = () => {
  const router = useRouter();

  useEffect(() => {
    if (!checkAdmin()) router.push('/result/deny');
  }, []);
  async function onFinish(values: any) {
    try {
      const storedAccount = localStorage.getItem('account');
      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        const params = {
          ...values,
          author: account.sub,
        };
        AxiosInterceptorsJwt.post(
          process.env.NEXT_PUBLIC_API_URL + '/blog',
          params,
        );
        message.success('Blog Added');
      }
    } catch (e) {
      if (isAxiosError(e)) {
        message.error(e.response?.data?.message);
        if (e.response?.status === 401) {
          const router = useRouter();
          await router.push('/login');
        }
      }
    }
  }

  return <BlogForm onFinish={onFinish} />;
};

export default BlogAddContainer;
