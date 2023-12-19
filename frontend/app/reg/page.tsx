'use client';

import { AutoComplete, Button, Col, Form, Input, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { RegFunc } from './api/reg';
import { useRouter } from 'next/navigation';
import PasswordValidation from '../tools/account/PasswordValidation';
import axios from 'axios';

const RegContainer = () => {
  const [emailOption, setEmailOption] = useState<
    { value: string; label: string }[]
  >([]);
  const router = useRouter();

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
    const { confirm, ...rest } = values;
    try {
      await RegFunc(rest);
      message.success('Registration successful!');
      useEffect(() => {
        const clear = async () => {
          router.push('/login');
        };
        clear();
      }, []);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (e.message) message.error(e.message);
      message.error('Registration failed!');
    }
  }

  function handleEmailSearch(value: string) {
    let res: { value: string; label: string }[] = [];
    if (!value || value.indexOf('@') >= 0) {
      res = [];
    } else {
      res = ['gmail.com', '163.com', 'qq.com', 'outlook.com'].map((domain) => ({
        value: `${value}@${domain}`,
        label: `${value}@${domain}`,
      }));
    }
    setEmailOption(res);
  }

  return (
    <>
      <Form
        name="reg"
        labelCol={{
          xs: { span: 24 },
          sm: { span: 8 },
          md: { span: 6, offset: 2 },
          lg: { span: 6, offset: 2 },
          xl: { span: 6, offset: 2 },
          xxl: { span: 4, offset: 4 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 12 },
          lg: { span: 12 },
          xl: { span: 12 },
          xxl: { span: 10 },
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'Email'}
          name={'email'}
          rules={[
            { required: true, message: 'Please input your email!' },
            {
              type: 'email',
              message: 'Please input a valid email!',
            },
          ]}
        >
          <AutoComplete
            onSearch={handleEmailSearch}
            placeholder="input email here"
            options={emailOption}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          hasFeedback
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              type: 'string',
              min: 8,
              max: 32,
              message: 'Password must be at 8 to 32 characters!',
            },
            { validator: PasswordValidation },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Row>
        <Col span={8} offset={8}>
          {/* <div>
            <div
              id="g_id_onload"
              data-client_id=""
              data-context="signup"
              data-ux_mode="popup"
              data-login_uri=""
              data-auto_prompt="false"
            ></div>
            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signup_with"
              data-size="large"
              data-logo_alignment="center"
              data-width="100"
            ></div>
          </div> */}
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

export default RegContainer;
