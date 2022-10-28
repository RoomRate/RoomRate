import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { ChatService } from '../../shared/services';

export const ChatList = () => {
  const [ chatList, setChatList ] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setChatList(await ChatService.getChatsForUser());

    }

    fetchData();
  });

  return (
    <ListGroup>
      <ListGroup.Item>Current Chats</ListGroup.Item>
      {
        chatList.length ?
          <>
          </> :
          <p>You currently do not have any ongoing chats</p>
      }
    </ListGroup>
  );
}