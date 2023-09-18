'use client';
import { message, Spin } from 'antd';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

const BlogImage = (props: any) => {
  return <img {...props} style={{ maxWidth: '100%' }} />;
};

const BlogContainer = ({ params }: { params: { slug: string } }) => {
  const [data, setData] = useState({
    title: '',
    content: '',
    author: {
      nickname: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/blog/' + params.slug, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      setData(data);
    } else {
      message.error('Error');
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [params.slug]);
  return (
    <div>
      <Spin spinning={loading}>
        <div style={{ flex: 0 }}>
          {data ? (
            <div>
              <h1>{data.title}</h1>
              <h4>{data.author.nickname}</h4>
              <br />
              <ReactMarkdown
                components={{
                  img(props) {
                    return <img {...props} style={{ maxWidth: '100%' }} />;
                  },
                }}
              >
                {data.content}
              </ReactMarkdown>
            </div>
          ) : (
            'Loading...'
          )}
        </div>
      </Spin>
    </div>
  );
};

export default BlogContainer;
