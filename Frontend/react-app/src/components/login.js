import React from "react";
import { Form, Input, Button, notification} from "antd";
import {useNavigate} from "react-router-dom"


function Login () {
  const navigate = useNavigate();

  const formItemLayout = {
    labelCol: { 
      xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } 
    }
  };
  const tailFormItemLayout = {
    wrapperCol: { 
      xs: { span: 24, offset: 0 }, 
      sm: { span: 16, offset: 6 } 
    }
  }

  const usernameRules = [
    { required: true, message: "Input your username.", whitespace: true },
  ];

    const passwordRules = [
    { required: true, message: "Input your password." },
  ];

  const storeToken = (data) => {
    window.localStorage.setItem('jwt', data.token);
    window.localStorage.setItem('jwtExpIn', data.expiresIn); //Could be used for autorefreshing the token, but this his not implemented.
    window.localStorage.setItem('userId', data.userId);
    window.dispatchEvent(new Event("loggedIn"))
  };

  function onFinish (values){

  const {username, password} = values;
  const headers = new Headers();
  headers.append("Authorization", "Basic " + btoa(username +":"+ password));
  fetch("https://turboexhibit-diegosalsa-3030.codio-box.uk/api/v1/login", {
    method: "GET",
    headers,
  }).then(status)
    .then(json)
    .then((data) => {
      navigate("/");
      storeToken(data)
      notification.success({message:"Logged In Succesfully."});
    })
    .catch((errorResponse) => {
      notification.error({ message: 'Login Failed.', description: 'Incorrect username or password.' })
    });
  };

  return (
    <Form {...formItemLayout} onFinish={onFinish} name = "login">
      <Form.Item name="username" label="Username" rules = {usernameRules}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules = {passwordRules}>
        <Input.Password />
      </Form.Item >
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );

}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return new Promise((resolve, reject) => {
      return reject(response);
    });
  }
}

function json(response) {
  return response.json(); // note this returns a promise
}
export default Login;