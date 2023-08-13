'use client'
import React from 'react'
import type {Metadata} from 'next'
import 'antd/dist/antd.css';
import {Content, Footer, Header} from "antd/es/layout/layout";
import { Layout, Menu} from "antd";
import './layout.css';


interface RootLayoutProps {
    children: React.ReactNode
}

function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="en">
        <body>
        <Layout className="layout">
            <Header>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                />
            </Header>
            <Content style={{padding: '0 50px'}}>
                <div className="site-layout-content" style={{marginTop: "50px"}}>{children}</div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
        </body>
        </html>
    )
}

export default RootLayout
