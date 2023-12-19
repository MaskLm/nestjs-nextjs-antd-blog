'use client';
import { Button, Form, Input, message } from 'antd';
import PasswordValidation from '../../tools/account/PasswordValidation';
import React, { useState } from 'react';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  async function onFinish(values: any) {
    const getUpdateAccountTokenByOTPParas: { email: string; otp: string } = {
      email: values.email,
      otp: values.otp,
    };
    const getUpdateAccountTokenByOTPURL = new URL(
      process.env.NEXT_PUBLIC_API_URL + '/auth/getUpdateAccountTokenByOTP',
    );
    Object.keys(getUpdateAccountTokenByOTPParas).forEach((key) =>
      getUpdateAccountTokenByOTPURL.searchParams.append(
        key,
        getUpdateAccountTokenByOTPParas[
          key as keyof typeof getUpdateAccountTokenByOTPParas
        ],
      ),
    );
    const getTokenRes = await fetch(getUpdateAccountTokenByOTPURL, {
      method: 'Get',
    });
    const getTokenData = await getTokenRes.json();
    if (!getTokenRes.ok) {
      message.error(getTokenData.message);
    } else {
      const updateAccountParas: {
        updateAccountJwt: string;
        password: string;
      } = {
        updateAccountJwt: getTokenData.token,
        password: values.password,
      };
      const updateAccountURL = new URL(
        process.env.NEXT_PUBLIC_API_URL + '/account/' + getTokenData.id,
      );
      const updateAccountRes = await fetch(updateAccountURL, {
        method: 'PATCH',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateAccountParas),
      });
      const updateAccountData = await updateAccountRes.json();
      if (!updateAccountRes.ok) {
        message.error(updateAccountData.message);
      } else {
        message.success('Update password successful!');
      }
    }
  }

  async function onClickSendEmail() {
    const url = new URL(
      process.env.NEXT_PUBLIC_API_URL + '/mail/sendResetPassword',
    );
    url.searchParams.append('email', email);
    const res = await fetch(url, {
      method: 'Get',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      if (res.status == 404) message.error('Email not found!');
      message.error('Send email failed!');
      console.error(res);
    } else {
      message.success('Send email successful!');
    }
  }

  return (
    <Form
      name="forgotPasswordForm"
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
      <Form.Item label={'Email'} name={'email'} required>
        <Input onChange={(e) => setEmail(e.target.value)} value={email} />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          xs: { span: 24 },
          sm: { offset: 8, span: 16 },
          md: { offset: 8, span: 12 },
          lg: { offset: 8, span: 12 },
          xl: { offset: 8, span: 12 },
          xxl: { offset: 8, span: 10 },
        }}
      >
        <Button onClick={onClickSendEmail}>Send Verification email</Button>
      </Form.Item>
      <Form.Item label={'Verification Code'} name={'otp'} required>
        <Input />
      </Form.Item>
      <Form.Item
        label="New Password"
        name="password"
        required
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
        label="Confirm New Password"
        name="confirmPassword"
        required
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
  );
};

export default ForgotPasswordForm;
