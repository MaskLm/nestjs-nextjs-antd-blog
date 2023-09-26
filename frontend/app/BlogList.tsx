'use client';

import React, { useEffect, useState } from 'react';
import { PaginationConfig } from 'antd/es/pagination';
import axios from 'axios';
import { Avatar, List } from 'antd';
import Link from 'next/link';

const BlogList = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [listParams, setListParams] = useState<ListParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  interface ListParams {
    pagination?: PaginationConfig;
  }

  const fetchData = async () => {
    const abortController = new AbortController();
    setLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/blog/pagination',
        {
          paginationBlogDto: listParams.pagination,
          signal: abortController.signal,
        },
      );
      setData(res.data.items);
      setListParams({
        ...listParams,
        pagination: {
          ...listParams.pagination,
          total: res.data.total,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      abortController.abort();
    }
  };

  const handleListChange = (page: number, pageSize: number) => {
    setListParams({
      ...listParams,
      pagination: {
        ...listParams.pagination,
        current: page,
        pageSize: pageSize,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(listParams)]);

  return (
    <List
      loading={loading}
      dataSource={data}
      pagination={{
        ...listParams.pagination,
        onChange: handleListChange,
      }}
      itemLayout="vertical"
      renderItem={(item: any) => (
        <List.Item key={item.title}>
          <List.Item.Meta
            avatar={<Avatar src={item.author.avatarURL} />}
            title={
              <Link href={process.env.NEXT_PUBLIC_WEB_URL + '/blog/' + item.id}>
                {item.title}
              </Link>
            }
            description={item.description}
          />
          {item.content}
        </List.Item>
      )}
    ></List>
  );
};
export default BlogList;
