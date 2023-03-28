import React from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import BookGrid from "./bookgrid";


const {Content } = Layout;

function Home(){
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    return (
        <Layout
            style={{
            padding: '0 24px 24px',
            }}
        >
            <Content
                style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                }}
            >
                <BookGrid/>
            </Content>
        </Layout>
    )
}

export default Home;