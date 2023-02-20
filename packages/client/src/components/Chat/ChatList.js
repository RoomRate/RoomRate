import React, { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { ChatService } from '../../shared/services';
import { useAuth } from '../../shared/contexts/AuthContext';

export const ChatList = ({ onChatSelect }) => {
  const [ chatList, setChatList ] = useState([]);
  const [ activeChat, setActiveChat ] = useState(parseInt(localStorage.getItem(`lastOpenedChat`)));
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChatList(await ChatService.getChatsForUser({ user_id: currentUser.id }));

        if (activeChat) {
          await getChatMessages({ chat_id: activeChat });
        }
      } catch (err) {
        throw new Error(err);
      }
    };

    fetchData();
  }, []);

  const getChatMessages = async ({ chat_id }) => {
    try {
      // TODO consolidate all these requests into one
      const messages = await ChatService.getMessagesForChat({ chat_id, user_id: currentUser.id });
      const users = await ChatService.getChatUsers({ chat_id, user_id: currentUser.id });
      const chatInfo = await ChatService.getChatById({ chat_id, user_id: currentUser.id });

      const chat = {
        id: chat_id,
        title: chatInfo.title,
        messages,
        users,
      };

      localStorage.setItem(`lastOpenedChat`, chat_id);
      setActiveChat(chat_id);
      onChatSelect({ chat });
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <Card>
      <Card.Title>Ongoing Chats</Card.Title>
      <Card.Body>
        <ListGroup>
          {
            chatList?.length ?
              <>
                {
                  chatList.map(chat =>
                    <ListGroup.Item
                      action
                      onClick={() => getChatMessages({ chat_id: chat.chat_id })}
                      active={chat.chat_id === activeChat}>
                      {
                        chat.chat_title &&
                          <div className="row">
                            <dt>Title: </dt>
                            <dd>{chat.chat_title}</dd>
                          </div>
                      }
                      <div className="row">
                        <dt>Other users: </dt>
                        <dd>
                          {
                            chat.users.map((user, index, array) =>
                              `${user.first_name} ${user.last_name}${index + 1 !== array.length ? `, ` : ``}`)
                          }
                        </dd>
                      </div>
                      <div className="row">
                        {
                          chat.last_message?.message &&
                            <>
                              <dt>Last message: </dt>
                              <dd style={{ overflowX: `ellipsis` }}>
                                {
                                  chat.user_id === chat.last_message.user.id ?
                                    `You: ` :
                                    `${chat.last_message.user.first_name} ${chat.last_message.user.last_name}: `
                                }
                                {chat.last_message.message}
                              </dd>
                            </>
                        }

                      </div>
                    </ListGroup.Item>)
                }
              </> :
              <p>You currently do not have any ongoing chats</p>
          }
        </ListGroup>
      </Card.Body>
    </Card>
  );
};