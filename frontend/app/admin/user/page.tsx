import { useState } from 'react';
import axiosInstance from '../../tools/AxiosInterceptorsJwt';
import { TablePaginationConfig } from 'antd';
import { FilterValue } from 'antd/lib/table/interface';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string | undefined | null;
  sortOrder?: string | undefined | null;
  filters?: Record<string, FilterValue>;
}

interface DataType {
  id: number;
  nickname: string;
  username: string;
  createdAt: Date;
}

const UserTable = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
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
        process.env.NEXT_PUBLIC_API_URL + '/user',
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
};

export default UserTable;
