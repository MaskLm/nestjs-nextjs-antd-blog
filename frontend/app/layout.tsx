'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const RootLayout = dynamic(() => import('./RootLayout'), {
  ssr: false,
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
};

export default Layout;
