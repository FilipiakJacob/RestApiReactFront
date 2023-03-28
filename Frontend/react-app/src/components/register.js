import React from "react";
import { Form, Input, Button} from "antd";
import {useNavigate} from "react-router-dom"


function Register (){
  const navigate = useNavigate();
  /**This form was, for the most part, sourced from the week 8 lab /*/

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

function onFinish (values){
  const { confirm, ...data } = values; 

  fetch("https://turboexhibit-diegosalsa-8080.codio-box.uk/api/v1/user", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(status)
    .then(json)
    .then((data) => {
      navigate("/");
      alert("User added");
    })
    .catch((errorResponse) => {
      // For you TODO: show nicely formatted error message and clear form
      json(errorResponse)
      .then((data)=>
      alert(`Error: ${data.message}`
      ));
    });
};



  const usernameRules = [
    { required: true, message: "Input your username.", whitespace: true },
  ];

  const emailRules = [
    { type: "email", message: "Input is not valid email." },
    { required: true, message: "Input your e-mail." },
  ];

  const passwordRules = [
    { required: true, message: "Input your password." },
  ];

  const confirmRules = [
    { required: true, message: "Confirm your password." },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }

        return Promise.reject("Passwords must match.");
      },
    }),
  ];


  return (
    <Form {...formItemLayout} onFinish={onFinish} name="register">
      <Form.Item name="username" label="Username" rules = {usernameRules}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules = {emailRules}>
        <Input />
      </Form.Item>

      <Form.Item name="password" label="Password" rules = {passwordRules}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="confirm" label="Confirm Password" rules = {confirmRules}>
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

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


export default Register;
