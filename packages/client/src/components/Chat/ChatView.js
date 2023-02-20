import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap';
import { ChatList } from './ChatList';
import { useForm } from 'react-hook-form';
import { ChatService } from '../../shared/services';
import { useAuth } from '../../shared/contexts/AuthContext';
import './chat.scss';

export const ChatView = () => {
  document.title = `Roomrate - Chats`;
  const [ chat, setChat ] = useState();
  const { currentUser } = useAuth();
  const { register, reset, handleSubmit } = useForm();

  const HOST = process.env.NODE_ENV === `production` ?
    window.location.origin.replace(/^http/, `ws`) :
    `ws://localhost:4567`;

  const [ wss, setWss ] = useState(new WebSocket(HOST));

  useEffect(() => {
    if (!wss) {
      setWss(new WebSocket(HOST));
    }

    if (chat) {
      wss.onmessage = data => {
        const message = JSON.parse(data.data.toString());
        if (currentUser.id !== message.created_by) {
          chat.messages.push(message);
          setChat({ ...chat });
        }
      };
    }
  }, [ wss, chat, HOST, currentUser.id ]);

  const setCurrentChat = (selected) => setChat(selected.chat);

  const sendMessage = async ({ message }) => {
    try {
      if (message) {
        const { id: chat_id } = chat;

        const sentMessage = await ChatService.sendMessage({ message, user_id: currentUser.id, chat_id });

        chat.messages.push(sentMessage);
        reset();

        wss.send(JSON.stringify({
          chat_id,
          created_by: currentUser.id,
          message,
        }));
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const LEFT_WIDTH = 30;

  return (
    <Container fluid>
      <Row>
        <Col style={{ width: `${100 - LEFT_WIDTH}%` }}>
          <ChatList onChatSelect={setCurrentChat} />
        </Col>
        <Col style={{ width: `${LEFT_WIDTH}%` }}>
          {
            chat ?
              <Card style={{ height: `100vh` }}>
                <Card.Title>
                  <div>
                    {
                      chat.title ?
                        <p>{chat.title}</p> :
                        chat.users.map((user, index, array) =>
                          `${user.first_name} ${user.last_name}${index + 1 !== array.length ? `, ` : ``}`)
                    }
                  </div>
                </Card.Title>
                <Card.Body>
                  {
                    chat.messages?.length ?
                      chat.messages.map(message =>
                        <div className={`${currentUser.id === message.created_by ? `mine` : `yours`} messages`}>
                          <div className="message">
                            {message.message}
                          </div>
                        </div>) :
                      `There doesn't seem to be anything here`
                  }

                  <Form onSubmit={handleSubmit(sendMessage)}>
                    <div id="chatbar" className="input-group mb-3">
                      <input
                        {...register(`message`)}
                        type="text"
                        id="my-message"
                        className="form-control"
                        placeholder="Type a message..." />

                      <div className="input-group-append">
                        <Button
                          variant="outline-primary"
                          onClick={handleSubmit(sendMessage)}
                          id="send-button"
                          type="button">
                          Send
                        </Button>
                      </div>
                    </div>
                  </Form>
                </Card.Body>
              </Card> :
              <div />
          }
        </Col>
      </Row>
    </Container>
  );
};
