import { Layout, Card} from 'antd';
import { useState } from 'react';

const { Sider } = Layout;
const {Meta} = Card;

function BookSider ({book}) {
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
            <div style={{ overflow: "hidden", height: "30vh" }}>
              <img alt="book" style={{borderRadius: '0', height:"100%"}} src={book.imgURL}/>
            </div>
         }>
          <Meta 
            title={
              !collapsed && (<span style={{color:"#FFFFFF"}}>{book.title}</span>)
              }
            description={
              !collapsed && (<span style={{color:"#FFFFFF"}}>{book.allText}</span>)
              }
            />
        </Card>
      </Sider>
  )
}

export default BookSider;