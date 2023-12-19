'use client';
import { Form, Input } from 'antd';
import PasswordValidation from '../../tools/account/PasswordValidation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import checkLogin from '../../tools/CheckLogin';

const ChangePasswordForm = () => {
  const router = useRouter();
  useEffect(() => {
    const loginCheck = async () => {
      if (!(await checkLogin())) router.push('/login');
    };
    loginCheck();
  }, []);

  /*  function getChangeAccountToken() {}

  function ChangePasswordFunc() {}*/
  function onFinish(values: any) {
    console.log(values);
  }

  return (
    <Form
      name="changePasswordForm"
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
      <Form.Item label={'Current Password'} name={'currentPassword'} required>
        <Input.Password />
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
    </Form>
  );
};

export default ChangePasswordForm;
