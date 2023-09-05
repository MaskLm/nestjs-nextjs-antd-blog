'use client';

import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import AxiosInterceptorsJwt from '../../tools/AxiosInterceptorsJwt';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/router';

const BlogAddContainer = () => {
  async function onFinish(values: any) {
    try {
      const storedAccount = localStorage.getItem('account');
      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        const params = {
          ...values,
          author: account.sub,
        };
        const req = AxiosInterceptorsJwt.post(
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

  return (
    <Form name="blogAdd" onFinish={onFinish}>
      <Form.Item label="Title" name={'title'} required>
        <Input />
      </Form.Item>
      <Form.Item label="Content" name={'content'}>
        <SimpleMDE />
      </Form.Item>
      <Form.Item label={'Description'} name={'description'}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlogAddContainer;
