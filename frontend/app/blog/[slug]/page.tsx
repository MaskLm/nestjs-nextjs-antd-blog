'use client';
import { message, Spin } from 'antd';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

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
      console.log('frontend:', data);
    } else {
      message.error('Error');
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [params.slug]);
  return (
    <>
      <Spin spinning={loading}>
        <div style={{ flex: 0 }}>
          {data ? (
            <>
              <h1>{data.title}</h1>
              <h4>{data.author.nickname}</h4>
              <br />
              <ReactMarkdown>{data.content}</ReactMarkdown>
            </>
          ) : (
            'Loading...'
          )}
        </div>
      </Spin>
    </>
  );
};

export default BlogContainer;
