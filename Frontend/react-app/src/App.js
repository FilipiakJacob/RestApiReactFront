import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import TopNav from "./components/topnav";


const { Header, Content } = Layout;



function App() {
  return (
    <Router>
      <Layout className='layout'>

        <Header className="header">
          <TopNav/>
        </Header>

        <Layout>
          <Content>
            <Routes>
              <Route path="/" element={<Home/>} />
            </Routes>
          </Content>
        </Layout>

      </Layout>
    </Router>
  );
};

export default App;
