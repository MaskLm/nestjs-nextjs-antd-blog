'use client';
import { Button, Checkbox, Col, Form, Input, message, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import { LoginFunc } from './api/login';
import { useRouter } from 'next/navigation';
import contextAccountStore from '../accountStore';
import axios from 'axios';
import getAvatarURL from '../tools/account/getAvatar';
import checkLogin from '../tools/CheckLogin';
import Link from 'next/link';

const LoginContainer = () => {
  const router = useRouter();
  useEffect(() => {
    const loginCheck = async () => {
      if (await checkLogin()) router.push('/');
    };
    loginCheck();
  }, []);
  const accountStore = useContext(contextAccountStore);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function onFinish(values: any) {
    try {
      const account = await LoginFunc(values);
      accountStore.setAccount(account);
      accountStore.setAvatarURL(await getAvatarURL(account));
      message.success('Login Success');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (e.error.statusCode == 401) {
          message.error('Invalid Username or Password');
        } else {
          message.error('Login Failed');
        }
      }
    }
  }

  return (
    <>
      <Form
        name="login"
        labelCol={{ span: 4, offset: 2 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          extra={<Link href={'/account/forgotPassword'}>Forgot Password</Link>}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 8 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Row gutter={[0, 16]}>
        {/* <Col span={8} offset={8}>
          <div>
            <div
              id="g_id_onload"
              data-client_id=""
              data-context="signin"
              data-ux_mode="popup"
              data-login_uri=""
              data-auto_prompt="false"
            ></div>
            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
            ></div>
          </div>
        </Col> */}
        <Col span={8} offset={8}>
          <Link href={'/reg'}>
            <Button>Register</Button>
          </Link>
        </Col>
        <Col span={8} offset={8}>
          <Button
            onClick={async () => {
              const state = Math.random().toString(36).substring(7);
              await axios.get(
                process.env.NEXT_PUBLIC_API_URL + '/oauth2/state',
                { params: { state: state } },
              );
              const query = new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
                scope: 'read:user user:email',
                state: state,
              });
              router.push(
                `https://github.com/login/oauth/authorize?${query.toString()}`,
              );
            }}
          >
            Login With Github
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default LoginContainer;
