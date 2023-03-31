import { Layout, Card} from 'antd';
import { useState } from 'react';

const { Sider } = Layout;
const {Meta} = Card;

function BookSider ({book,author}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    
      <Sider collapsible collapsed={collapsed}
      style={{borderRadius: '0'}} 
      collapsedWidth={30} onCollapse={(value) => setCollapsed(value)}
      >
        <Card  bordered={false} 
        bodyStyle={{ overflow: "hidden", 
        padding:"0", borderRadius: '0', backgroundColor: "#001529"}}
         style={{borderRadius: '0' }} cover={
              !collapsed && ( <img alt="book" style={{borderRadius: '0'}} src={book.cover}/>)
         }>
          <Meta 
            title={
              !collapsed && (<span style={{color:"#FFFFFF"}}>{book.name}</span>)
              }
            description={
              !collapsed && (
                <div>
                  <span style={{color:"#FFFFFF"}}>Author: {author}</span>
                  <br/>
                  <span style={{color:"#FFFFFF"}}>Released: {book.date}</span>
                  <br/>
                  <span style={{color:"#FFFFFF"}}>ISBN-13: {book.isbn}</span>
                  <br/>
                  <span style={{color:"#FFFFFF"}}>{book.description}</span>
                </div>
                )
              }
            />
        </Card>
      </Sider>
  )
}

export default BookSider;