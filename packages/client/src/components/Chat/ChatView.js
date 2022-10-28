import { Card } from 'react-bootstrap';
import { ChatList } from './ChatList';

export const ChatView = () => {


  return (
    <div className="row">
      <div className="col-3">
        <ChatList />
      </div>
      <div className="col" style={{ overflowY: `scroll` }}>
        <Card>
          <Card.Title>Current Chat</Card.Title>
        </Card>
      </div>
    </div>
  );
}