'use client';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Button, Form, Input } from 'antd';
import React from 'react';

const BlogAddContainer = () => {
  function onFinish(values: any) {
    console.log(values);
  }

  return (
    <Form name="blogAdd" onFinish={onFinish}>
      <Form.Item label="Title" name={'title'} required>
        <Input />
      </Form.Item>
      <Form.Item label="Content" name={'content'}>
        <SimpleMDE />
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
