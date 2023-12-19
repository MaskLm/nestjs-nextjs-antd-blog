'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '../../tools/AxiosInterceptorsJwt';
import { Input, Popconfirm, Table, TablePaginationConfig, message } from 'antd';
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface';
import Search from 'antd/lib/input/Search';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string | undefined | null;
  sortOrder?: string | undefined | null;
  filters?: Record<string, FilterValue>;
}

type RolesType = Record<number, string>;

interface DataType {
  id: number;
  nickname: string;
  username: string;
  createdAt: Date;
  role: string[];
}

const handleEditRoles = (id: number, roles: string) => async () => {
  await axiosInstance.put(
    process.env.NEXT_PUBLIC_API_URL + '/account/updateByAdmin/' + id,
    {
      role: roles.split(','),
    },
  );
};

const UserTable = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [newRoles, setRoles] = useState<RolesType>({});

  const handleInputChange = (id: number, value: string) => {
    setRoles((prevRoles) => ({ ...prevRoles, [id]: value }));
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'id',
      dataIndex: 'id',
      sorter: true,
      width: '10%',
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      width: '20%',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: '20%',
    },
    {
      title: 'Roles',
      dataIndex: 'role',
      width: '20%',
    },
    {
      title: 'Actions',
      render: (record: DataType) => (
        <>
          <Popconfirm
            title={
              <div>
                <p>Current Roles(join with ','):</p>
                <Input
                  defaultValue={record.role.join(',')}
                  onChange={(e) => handleInputChange(record.id, e.target.value)}
                />
              </div>
            }
            onConfirm={handleEditRoles(record.id, newRoles[record.id])}
          >
            <a>Edit Roles</a>
          </Popconfirm>
          <br />
          <Popconfirm
            title="Are you sure to delete this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={async (e?: React.MouseEvent<HTMLElement>) => {
              console.error(e);
              try {
                await handleDeleteUser(record.id);
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
  const fetchData = async () => {
    const abortController = new AbortController();
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        process.env.NEXT_PUBLIC_API_URL + '/account',
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
  return (
    <>
      <Search
        placeholder="input username to search"
        onSearch={(value) => {
          if (value === '' && tableParams.filters?.username) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { username, ...otherFilters } = tableParams.filters;
            setTableParams({
              ...tableParams,
              filters: otherFilters,
            });
          }
          setTableParams({
            ...tableParams,
            filters: {
              ...tableParams.filters,
              username: [value],
            },
          });
        }}
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

export default UserTable;
function handleDeleteUser(id: number) {
  throw new Error('Function not implemented.');
}
