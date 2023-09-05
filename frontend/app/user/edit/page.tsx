'use client';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../tools/AxiosInterceptorsJwt';
import { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/es/upload';
import { useRouter } from 'next/router';

const UploadFunc = async (options: any) => {
  const { onSuccess, onError, file, onProgress } = options;
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      console.log(account);
      const response = await axiosInstance.post(
        process.env.NEXT_PUBLIC_API_URL + `/user/uploadAvatar`,
        formData,
      );
      onSuccess(response.data, file);
    } else {
      message.error('Please Login');
      const router = useRouter();
      await router.push('/login');
    }
  } catch (error) {
    onError(error);
  }
};
const UserAddContainer = () => {
  const [fileList, setFileList] = useState<any[]>([]);

  function onFinish(values: any) {
    const accountString = localStorage.getItem('account');
    if (accountString) {
      const account = JSON.parse(accountString);
      const submitValues = {
        ...values,
        avatarURL: fileList[0].response.url,
        account: account.sub,
      };
      try {
        axiosInstance.patch(
          process.env.NEXT_PUBLIC_API_URL + '/user/' + account.sub,
          submitValues,
        );
        message.success('User edit successfully!');
      } catch (e) {
        message.error('User edit failed!');
      }
    } else {
      const router = useRouter();
      message.error('Please Login');
      router.push('/login');
    }
  }

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

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
        <ImgCrop rotationSlider>
          <Upload
            action={process.env.NEXT_PUBLIC_API_URL + '/user/uploadAvatar'}
            listType="picture-card"
            customRequest={UploadFunc}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </ImgCrop>
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
        <Switch />
      </Form.Item>
      <Form.Item label={'Age Visible'} name={'ageVisible'}>
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default UserAddContainer;
