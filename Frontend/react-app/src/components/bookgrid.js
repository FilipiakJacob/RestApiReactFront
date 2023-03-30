import React from 'react';
import {Col,Row, Spin, Pagination, notification} from 'antd';
import BookCard from './bookcard';

import {useState, useEffect} from 'react';

const BookGrid = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1); 
    const [limit, setLimit] = useState(10); //How many results per page
    const [total, setTotal] = useState(null);
    

    useEffect(()=>{ 
      function fetchBooks (){
        const query = new URLSearchParams({
          page: page,
          limit: limit
        }).toString();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + localStorage.getItem("jwt"));
        fetch(`https://turboexhibit-diegosalsa-3030.codio-box.uk/api/v1/book?${query}`, {
          method: "GET",
          headers,
        }).then(status)
          .then(response =>{
            setTotal(response.headers.get("X-Total-Count"))
            return response;
          })
          .then(json)
          .then(data => {
            console.log(data)
            setBooks(data)
          })
          .catch((errorResponse) => {
            console.log(errorResponse)
            notification.error({ message: "Could not set books."})
          });
      };
      fetchBooks();
      },[page, limit]
    );

    if (books === []) {
        return <Spin size="large" />;
    };

    const cardList = Object.entries(books).map(([key, book], i)=> {
        return(
            <div style = {{padding: "10px"}} key = {i} >
                    <Col span = {6}>
                        <BookCard key ={i} book ={book}/> 
                    </Col> 
                </div>
        );
    });

    function onChange (page, limit){
        setPage(page);
        setLimit(limit);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Pagination current={page} pageSize={limit} total={total} onChange={onChange}
                showSizeChanger pageSizeOptions={['10', '20', '50', '100']} />
            </div>
            <Row type = "flex" justify = "space-evenly" gutter ={[40, 16]} > {cardList} </Row>
        </div>
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
  return response.json(); 
}

export default BookGrid;
