import React from 'react';
import { Menu } from 'antd';
import { Link } from "react-router-dom";


function TopNav(){
  return (
    <>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/Account">Account</Link></Menu.Item>

        <Menu.Item key="5"><Link to="/Login">Login</Link></Menu.Item>
      </Menu>
    </>
  );
}

export default TopNav;