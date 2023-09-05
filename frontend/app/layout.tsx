'use client';

import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { Avatar, Col, Image, Layout, Menu, Row } from 'antd';
import './layout.css';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import axiosInstance from './tools/AxiosInterceptorsJwt';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

interface RootLayoutProps {
  children: React.ReactNode;
}

async function getAvatarURL(account: any) {
  const response = await axiosInstance.get(
    process.env.NEXT_PUBLIC_API_URL + '/user/' + account.sub,
  );
  return response.data.avatarURL;
}

function RootLayout({ children }: RootLayoutProps) {
  const searchParams = useSearchParams();
  const [avatarURL, setAvatarURL] = React.useState('');
  const [account, setAccount] = React.useState(null);
  const router = useRouter();
  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    const accountTemp = storedAccount ? JSON.parse(storedAccount) : null;
    setAccount(accountTemp);
    if (accountTemp) {
      getAvatarURL(accountTemp).then((url) => {
        setAvatarURL(url);
      });
    }
  }, []);

  function onClick({ item, key, keyPath, domEvent }: any) {
    if (key === 'home') router.push('/');
  }

  const items = [{ label: 'Home', key: 'home' }];
  return (
    <html lang="en">
      <body>
        <Layout className="layout">
          <Header>
            <Row>
              <Col>
                <div className="logo" />
              </Col>
              <Col flex={'auto'}>
                <Menu
                  theme={'dark'}
                  mode="horizontal"
                  items={items}
                  onClick={onClick}
                />
              </Col>
              <Col flex="auto">
                <div style={{ float: 'right' }}>
                  {account ? (
                    avatarURL ? (
                      <Link href={'/user/edit'}>
                        {' '}
                        <Avatar
                          icon={<Image src={avatarURL} preview={false} />}
                        />{' '}
                      </Link>
                    ) : (
                      <Link href={'/user/edit'}>
                        <Avatar icon={<UserOutlined />} />{' '}
                      </Link>
                    )
                  ) : (
                    <Link href={'/login'}>Login</Link>
                  )}
                </div>
              </Col>
            </Row>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <div className="site-layout-content" style={{ marginTop: '50px' }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </body>
    </html>
  );
}

export default RootLayout;
