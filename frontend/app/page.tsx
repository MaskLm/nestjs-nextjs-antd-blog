import dynamic from 'next/dynamic';

const BlogList = dynamic(() => import('./BlogList'), {
  ssr: false,
});

const HomePage = () => {
  return <BlogList />;
};

export default HomePage;
