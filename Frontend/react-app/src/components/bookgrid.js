import React from 'react';
import {Col,Row, Spin} from 'antd';
import BookCard from './bookcard';

import {useState, useEffect} from 'react';

const BookGrid = () => {
    const [books, setBooks] = useState([]);
    
    useEffect(()=>{ 
            function fetchBooks (){
                const data = require('../data/posts.json');
                setBooks(data)
            }
            fetchBooks();
        },
    );
    if (books === []) {
        return <Spin size="large" />;
        }

    const cardList = Object.entries(books).map(([key, book], i)=> {
        return(
            <div style = {{padding: "10px"}} key = {i} >
                    <Col span = {6}>
                        <BookCard key ={i} book ={book}/> 
                    </Col> 
                </div>
        );
    });
    return (
        <Row type = "flex" justify = "space-around" > {cardList} </Row>
    );
}

export default BookGrid;
