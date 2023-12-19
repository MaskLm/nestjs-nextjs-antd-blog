'use client';
import checkAdmin from '../tools/CheckAdmin';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'antd/lib/typography/Link';

const AdminPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!checkAdmin()) router.push('/result/deny');
  }, []);

  return (
    <div>
      <h1>Admin</h1>
      <p>Admin page</p>
      <Link href={'/admin/blog'}>Edit Blog</Link>
      <br />
      <Link href={'/admin/user'}>Manage User</Link>
      <br />
      <Link href={'/admin/blog/add'}>Add Blog</Link>
    </div>
  );
};

export default AdminPage;
