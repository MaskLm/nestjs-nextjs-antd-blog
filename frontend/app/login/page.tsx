'use client';
import { Button, Checkbox, Col, Form, Input, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { LoginFunc } from './api/login';
import { router } from 'next/client';

const LoginContainer = () => {
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
      await LoginFunc(values);
      message.success('Login Success');
      await router.push('/');
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e.error.statusCode == 401) {
        message.error('Invalid Username or Password');
      } else {
        message.error('Login Failed');
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
      <Row>
        <Col span={8} offset={8}>
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
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};

export default LoginContainer;
