'use client';
import 'easymde/dist/easymde.min.css';
import { Button, Form, Input } from 'antd';
import SimpleMDE from 'react-simplemde-editor';
import hljs from 'highlight.js';

interface BlogFormProps {
  onFinish: (values: any) => void;
  initialValues?: any;
}

const BlogForm = ({ onFinish, initialValues }: BlogFormProps) => {
  return (
    <div>
      <Form name="blogAdd" onFinish={onFinish} initialValues={initialValues}>
        <Form.Item label="Title" name={'title'} required>
          <Input />
        </Form.Item>
        <Form.Item label="Content" name={'content'}>
          <SimpleMDE
            options={{
              renderingConfig: {
                markedOptions: {
                  highlight: function (code: any) {
                    return hljs.highlightAuto(code).value;
                  },
                  pedantic: false,
                  gfm: true,
                  breaks: false,
                  sanitize: false,
                  smartLists: true,
                  smartypants: false,
                  xhtml: true,
                },
              },
            }}
          />
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
    </div>
  );
};

export default BlogForm;
