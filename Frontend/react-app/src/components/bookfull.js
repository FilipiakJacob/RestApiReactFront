import React, { useState, useEffect } from "react";
import { Spin, Layout, Card, notification } from "antd";
import BookSider from "./booksider"
import { useLocation } from 'react-router-dom';


const { Content } = Layout;

const BookFull = () => {
  const [book, setBook] = useState(null);
  const {id} = useLocation().state;
  const [text, setText] = useState(null)
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    function fetchBooks (){
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", "Bearer " + localStorage.getItem("jwt"));
      fetch(`https://turboexhibit-diegosalsa-3030.codio-box.uk/api/v1/book/${id}`, {
        method: "GET",
        headers,
      }).then(status)
        .then(json)
        .then(data => {
          const {contents,authorId,...rest} = data 
          setBook(rest)
          setText(decodeText(contents))
          return fetchAuthor(authorId) //Chaining the fetch requests
        })
        .catch((errorResponse) => {
          console.log(errorResponse)
          notification.error({ message: "Could not fetch book."})
        });
    };

    function fetchAuthor (authorId){
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", "Bearer " + localStorage.getItem("jwt"));
      fetch(`https://turboexhibit-diegosalsa-3030.codio-box.uk/api/v1/author/${authorId}`, {
        method: "GET",
        headers,
      }).then(status)
        .then(json)
        .then(data => {
          setAuthor(data.name)
        })
        .catch((errorResponse) => {
          console.log(errorResponse)
          notification.error({ message: "Could not fetch author."})
        });
    };
    fetchBooks();
    },[id]
  );
  
  function decodeText(contents) {
    //This is needed as the text I used for my example books contained non-ascii characters.
    //A lot of effort for a problem I created myself.
    //Basically this takes the base64-encoded text, splits away the metadata, and converts it to utf-8.
    //Took inspiration from https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
    //and https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode
    let justB64 = contents.split(",")[1]
    let binaryText = atob(justB64)
    let decodedText = new TextDecoder().decode(new Uint8Array([...binaryText].map(c => c.charCodeAt(0))));
    return decodedText
  }

  if (!book) {
    return <Spin size="large" />; 
  }
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <BookSider book={book} author={author}/>
      <Layout>
          <Content style={{ margin: '24px 16px 0', overflow: 'hidden', minWidth:"100%" }}>
          <Card style={{ width: '100%', borderRadius: 0 }}>
            <p>{text}</p>
          </Card>
        </Content>
      </Layout>
    </Layout>
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
  return response.json(); 
}


export default BookFull;