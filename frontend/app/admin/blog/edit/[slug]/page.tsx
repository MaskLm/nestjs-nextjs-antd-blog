'use client';

import { useRouter } from 'next/navigation';
import BlogForm from '../../blogForm';
import { useEffect, useState } from 'react';
import checkAdmin from '../../../../tools/CheckAdmin';
import axiosInstance from '../../../../tools/AxiosInterceptorsJwt';
import { Spin, message } from 'antd';

const BlogEditContainer = ({ params }: { params: { slug: number } }) => {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (!checkAdmin()) router.push('/result/deny');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ans = await axiosInstance.get(
        process.env.NEXT_PUBLIC_API_URL + '/blog/' + params.slug,
      );
      setValue(ans.data);
      setLoading(false);
    } catch (e) {
      message.error('Failed to get data');
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      await axiosInstance.get(
        process.env.NEXT_PUBLIC_API_URL + '/blog/' + params.slug,
        values,
      );
    } catch (e) {
      message.error('Failed to update data');
    }
  };
  if (loading)
    return (
      <Spin
        spinning={loading}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 9999,
        }}
      />
    );
  return (
    <Spin spinning={loading}>
      <BlogForm onFinish={onFinish} initialValues={value} />
    </Spin>
  );
};

export default BlogEditContainer;
