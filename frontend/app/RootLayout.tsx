'use client';
import React, { useEffect } from 'react';
import { Avatar, Col, Image, Layout, Menu, Row } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Link from 'next/link';
import 'antd/dist/antd.css';
import './layout.css';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import getAvatarURL from './tools/account/getAvatar';
import contextAccountStore from './accountStore';
import { observer } from 'mobx-react';
interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  const accountStore = React.useContext(contextAccountStore);
  const { account, avatarURL } = accountStore;
  const [items, setItems] = React.useState([{ label: 'Home', key: 'home' }]);
  const router = useRouter();
  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    const accountTemp = storedAccount ? JSON.parse(storedAccount) : null;
    accountStore.setAccount(accountTemp);
    if (accountTemp) {
      getAvatarURL(accountTemp).then((url) => {
        accountStore.setAvatarURL(url);
      });
      if (account?.role.includes('admin'))
        setItems([
          { label: 'Home', key: 'home' },
          { label: 'Admin', key: 'admin' },
        ]);
    } else {
      accountStore.setAccount(null);
      accountStore.setAvatarURL('');
    }
  }, []);

  useEffect(() => {
    if (account?.role.includes('admin'))
      setItems([
        { label: 'Home', key: 'home' },
        { label: 'Admin', key: 'admin' },
      ]);
  }, [account]);

  function onClick({ item, key, keyPath, domEvent }: any) {
    switch (key) {
      case 'home':
        router.push('/');
        break;
      case 'admin':
        router.push('/admin');
        break;
    }
  }

  return (
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
          <Col
            flex="auto"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                float: 'right',
              }}
            >
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
      <Content className="site-content">
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default observer(RootLayout);
