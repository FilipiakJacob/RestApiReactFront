import React, {useState} from "react";
import { Form, Input, Button, notification,DatePicker, Upload} from "antd";
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

function Register (){

  const [cover, setCover] = useState(null);
  const [contents, setContents]= useState(null);

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

  const toBase64 = async (file) =>{
    if (file===null) {
      return null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(); //If the upload succeeds, resolve the promise
        reader.onerror = (e) => reject(); //If it fails, reject the promise
      });
    return btoa(reader.result);
}

  async function onFinish (data){

    data.cover = await toBase64(cover);
    data.contents = await toBase64(contents);
    data.authorId = Number(data.authorId);
    data.date = (data.date).toISOString().slice(0, 10);
    console.log(data.date)
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + localStorage.getItem("jwt"));

    console.log(JSON.stringify(data));
    fetch("https://turboexhibit-diegosalsa-3030.codio-box.uk/api/v1/book", {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }).then(status)
      .then(json)
      .then((data) => {
        notification.success({message:"Book added"});
      })
      .catch((errorResponse) => {
        json(errorResponse)
        .then((data)=>
        notification.error({message:"Error", description: data.path[0] +" "+ data.message})
        );
      });
  };


  const generalRules = [
    { 
      required: true,
    },
  ]
  const isbnRules =[
    { required: true },
    { len: 14,message: 'The ISBN must have exactly 14 characters.'}
  ]

  return (
    <Form {...formItemLayout} onFinish={onFinish}>
      <Form.Item name="name" label="Name" rules={generalRules}>
        <Input />
      </Form.Item>

      <Form.Item name="authorId" label="Author ID" rules={generalRules}>
        <Input type="number" />
      </Form.Item>

      <Form.Item name="date" label="Date" rules={generalRules}>
        <DatePicker />
      </Form.Item>

      <Form.Item name="isbn" label="Isbn"   rules={isbnRules}>
        <Input />
      </Form.Item>

      <Form.Item name="description"label="Description" rules={generalRules}>
        <TextArea rows={6} />
      </Form.Item>

      <Form.Item name="cover" label="Cover" rules={generalRules} >
        {/*Set the state and return false to stop the file from
        being uploaded before the form is sent*/}
        <Upload beforeUpload={(file)=> {setCover(file);return false;}}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="contents" label="Contents" rules={generalRules} > 
        <Upload beforeUpload={(file)=> {setContents(file);return false;}}>
          <Button icon={<UploadOutlined/>}>Select File</Button>
        </Upload>
      </Form.Item>
    
      <Form.Item {...tailFormItemLayout} rules={generalRules} >
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
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
