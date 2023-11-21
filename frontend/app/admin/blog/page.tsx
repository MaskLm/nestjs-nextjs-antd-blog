'use client';
import { Popconfirm, Table, TablePaginationConfig, message } from 'antd';
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface';
import axiosInstance from '../../tools/AxiosInterceptorsJwt';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Search from 'antd/lib/input/Search';

interface DataType {
  id: number;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    nickname: string;
    avatarURL: string;
  };
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string | undefined | null;
  sortOrder?: string | undefined | null;
  filters?: Record<string, FilterValue>;
}

const BlogTable = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const fetchData = async () => {
    const abortController = new AbortController();
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        process.env.NEXT_PUBLIC_API_URL + '/blog',
        {
          params: {
            ...tableParams,
            ...tableParams.pagination,
          },
          signal: abortController.signal,
        },
      );
      setData(res.data);
      setTableParams({
        ...tableParams,

        pagination: {
          ...tableParams.pagination,
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

  const columns: ColumnsType<DataType> = [
    {
      title: 'id',
      dataIndex: 'id',
      sorter: true,
      width: '10%',
    },
    {
      title: 'title',
      dataIndex: 'title',
      sorter: true,
      width: '20%',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      sorter: true,
      width: '20%',
    },
    {
      title: 'updatedAt',
      dataIndex: 'updatedAt',
      sorter: true,
      width: '20%',
    },
    {
      title: 'author',
      dataIndex: 'author',
      render: (author) => author.nickname,
      width: '20%',
    },
    {
      title: 'Actions',
      render: (record: DataType) => (
        <>
          <Link href={`/admin/blog/edit/${record.id}`}>Edit</Link>
          <br />
          <Popconfirm
            title="Are you sure to delete this article?"
            okText="Yes"
            cancelText="No"
            onConfirm={async (e?: React.MouseEvent<HTMLElement>) => {
              console.error(e);
              try {
                await handleDeleteBlog(record.id);
                fetchData();
              } catch (e) {
                message.error('Delete error');
                console.error(e);
              }
            }}
          >
            <a>Delete</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
  ) => {
    setTableParams({
      ...tableParams,
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      sortField: Array.isArray(sorter) ? undefined : sorter.field?.toString(),
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      filters: filters as Record<string, FilterValue>,
    });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  return (
    <>
      <Search
        placeholder="input title to search"
        onSearch={(value) =>
          setTableParams({
            ...tableParams,
            filters: {
              ...tableParams.filters,
              title: [value],
            },
          })
        }
        enterButton
      />
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </>
  );
};

export default BlogTable;
async function handleDeleteBlog(id: number) {
  await axiosInstance.delete(process.env.NEXT_PUBLIC_API_URL + '/blog/' + id);
}
