import React from 'react';
import {Col,Row} from 'antd';
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
        return < h3 > Loading books... < /h3>
        }

    const cardList = Object.entries(books).map(([key, book], i)=> {
        console.log("HEEEEEEEEEEEEE")
        console.log(book);
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
