import React, { useState, useEffect } from "react";
import { Spin, Layout, Descriptions, Card } from "antd";
import BookSider from "./booksider"
import { useLocation } from 'react-router-dom';


const { Content } = Layout;

const BookFull = () => {
  const [book, setBook] = useState(null);
  const {id} = useLocation().state; 

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = require('../data/posts.json');
        const data = response[id];
        setBook(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  },);
  
  if (!book) {
    return <Spin size="large" />; 
  }

  const { title, authorId, allText, cover, text } = book;

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <BookSider book={book}/>
      <Layout>
          <Content style={{ margin: '24px 16px 0', overflow: 'hidden', minWidth:"100%" }}>
          <Card style={{ width: '100%', borderRadius: 0 }}>
            <p>{allText}</p>
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
};

export default BookFull;