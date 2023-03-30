import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types'

import { useNavigate } from "react-router-dom";

const { Meta } = Card;


const Book = ({book}) => {

    const navigate = useNavigate();

    const handleNav = () => {
        navigate("/book",
            {state:{id:book.id}}
        );
    }
    const onClick = () => {
        handleNav();
    }
    return (
        <Card
            style={{ width: "14vw", heigh:"20vh" }} 
            cover={
              <img alt="book" src={book.cover}/>}
            onClick={onClick}
            hoverable={true}>
            <Meta
                title={<div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.name}</div>}
                description={<div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.description}</div>}
            />
        </Card>
    );
}


Book.propTypes = {

    imgURL: PropTypes.string,
    likes: PropTypes.number,
    liked: PropTypes.bool,
    comments: PropTypes.number,
    pinned: PropTypes.bool,
    title: PropTypes.string,
    summary: PropTypes.string
};

export default Book; 