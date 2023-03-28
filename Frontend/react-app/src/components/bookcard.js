import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types'

import { useNavigate } from "react-router-dom";

const { Meta } = Card;


const Book = (props) => {

    const navigate = useNavigate();

    const handleNav = () => {
        navigate("/book",
            {state:{id:props.book.id}}
        );
    }
    const onClick = () => {
        handleNav();
    }
    return (
        <Card
            style={{ width: 320 }}
            cover={<img alt="test" src={props.book.imgURL} />}
            onClick={onClick}
            hoverable={true}
            >
                <Meta title={props.book.title} description={props.book.summary} />
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