'use client';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';

async function onFinish(values: any) {
  console.log('Success:', values);
}

function onFinishFailed(errorInfo: any) {
  console.log('Failed:', errorInfo);
}

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
  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 4, offset: 2 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
