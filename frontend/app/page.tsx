'use client';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const BlogList = dynamic(() => import('./BlogList'), {
  ssr: false,
});

const HomePage = () => {
  const searchParams = useSearchParams();
  return <BlogList />;
};

export default HomePage;
