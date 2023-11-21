'use client';
import checkAdmin from '../tools/CheckAdmin';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!checkAdmin()) router.push('/result/deny');
  }, []);

  return (
    <div>
      <h1>Admin</h1>
      <p>Admin page</p>
    </div>
  );
};

export default AdminPage;
