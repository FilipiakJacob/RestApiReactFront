import React from 'react';
import { Menu, Button } from 'antd';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function TopNav(){

  const [logged, setLogged] = useState(null);

  const [key, setKey] = useState(["1"]);

  const location = useLocation();

  useEffect(() => { //Only happens once, no need for more listeners.
    function handleLogin() {
      setLogged(localStorage.getItem('userId'));
    }
    handleLogin()
    window.addEventListener('loggedIn', handleLogin); //Listen for changes in local storage. 
  }, []);

  useEffect(()=>{ //Happens each time the location changes.
    const path = location.pathname;
    console.log(path);
    switch (path)
    {
      case "/":
        setKey(["home"]);
        break;
      case "/account":
        setKey(["account"]);
        break;
      case "/addBook":
        setKey(["addBook"]);
        break;
      case "/login":
        setKey(["login"]);
        break;
      case "/register":
        setKey(["register"]);
        break;
      default:
        setKey(["home"]);
    }
  }, [location]);

  function logOut (){
    localStorage.removeItem('jwt');
    localStorage.removeItem('jwtExpIn'); //Could be used for autorefreshing the token, but this his not implemented.
    localStorage.removeItem('userId');
    setLogged(null);
  }


  return (
    <>
      <div className="topNav" />
      <Menu theme="dark" mode="horizontal" selectedKeys={key}>
        <Menu.Item key="home"><Link to="/">Home</Link></Menu.Item>
        {logged ? (
        <>
          <Menu.Item key="account"><Link to="/account">Account</Link></Menu.Item>
          <Menu.Item key="addBook"><Link to="/addBook">Add Book</Link></Menu.Item>
          <Menu.Item key="logOut"style={{ marginLeft:"auto", marginRight:0 }} selectable={false}><Link onClick={logOut}>Logout</Link></Menu.Item>
        </>
        ) : (
        <>
          <Menu.Item key="register"style={{ marginLeft:"auto", marginRight:0 }}><Link to="/register">Register</Link></Menu.Item>
          <Menu.Item key="login"><Link to="/login">Login</Link></Menu.Item>
        </>
        )}
      </Menu>
    </>
  );
}

export default TopNav;