'use client';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Switch,
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const UploadFunc = async (options: any) => {
  const { onSuccess, onError, file, onProgress } = options;

}
const UserAddContainer = () => {
  function onFinish(values: any) {
    console.log(values);
  }

  return (
    <Form
      name="user-add"
      labelCol={{ span: 4, offset: 2 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
    >
      <Form.Item label={'Nickname'} name={'nickname'}>
        <Input />
      </Form.Item>
      <Form.Item label={'Avatar'} name={'avatar'}>
        <Upload
          action={process.env.NEXT_PUBLIC_API_URL + '/user/uploadAvatar'}
          listType="picture-card"
          customRequest={UploadFunc}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item label={'Email'} name={'email'}>
        <Input />
      </Form.Item>
      <Form.Item
        label={'Age'}
        name={'age'}
        rules={[
          {
            type: 'number',
            min: 0,
            max: 129,
            message: 'Age must be between 0 and 129!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item label={'Email Visible'} name={'emailVisible'}>
        <Switch
          checkedChildren="true"
          unCheckedChildren="false"
          defaultChecked
        />
      </Form.Item>
      <Form.Item label={'Age Visible'} name={'ageVisible'}>
        <Switch
          checkedChildren="true"
          unCheckedChildren="false"
          defaultChecked
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" />
      </Form.Item>
    </Form>
  );
};
export default UserAddContainer;
