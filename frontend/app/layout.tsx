import dynamic from 'next/dynamic';
import React from 'react';

const RootLayout = dynamic(() => import('./RootLayout'), {
  ssr: false,
});

interface RootLayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: RootLayoutProps) {
  return <RootLayout>{children}</RootLayout>;
}

export default Layout;
