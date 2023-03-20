import React, { useEffect, useState } from 'react';
import { Button, Card, Form, InputGroup, Row, OverlayTrigger, Popover } from 'react-bootstrap';
import { ChatList } from './ChatList';
import { useForm } from 'react-hook-form';
import { ChatService } from '../../shared/services';
import { useAuth } from '../../shared/contexts/AuthContext';
import './chat.scss';
import { LoadingIcon } from '../../shared/A-UI';
import { FaEllipsisH as EllipsisIcon } from "react-icons/fa";
import ReactTimeAgo from 'react-time-ago';

export const ChatView = () => {
  document.title = `Roomrate - Chats`;
  const [ activeChat, setActiveChat ] = useState();
  const [ loadingChat, setLoadingChat ] = useState(true);
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

    if (activeChat) {
      wss.onmessage = data => {
        const message = JSON.parse(data.data.toString());
        if (currentUser.id !== message.created_by) {
          activeChat.messages.push(message);
          setActiveChat({ ...activeChat });
        }
      };
    }
  }, [ wss, activeChat, HOST, currentUser.id ]);

  const setCurrentChat = (selected) => {
    setActiveChat(selected);
    setLoadingChat(false);
  };

  const sendMessage = async ({ message }) => {
    try {
      if (message) {
        const { id: chat_id } = activeChat.chat;

        const sentMessage = await ChatService.sendMessage({ message, user_id: currentUser.id, chat_id });

        activeChat.messages.push(sentMessage);
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

  return (
    <div style={{ height: `93.80vh`, overflow: `hidden` }}>
      <Row style={{ padding: 0 }}>
        <div className="col-md-4" style={{ margin: 0, padding: 0 }}>
          <ChatList onChatSelect={setCurrentChat} />
        </div>
        <div className="col-md-8" style={{ margin: 0, padding: 0 }}>
          {
            loadingChat ?
              <LoadingIcon /> :
              activeChat ?
                <Card style={{ height: `93.80vh`, borderRadius: 0 }}>
                  <Card.Header>
                    <Card.Title>
                      <div>
                        {
                          activeChat.chat.title ?
                            <p>{activeChat.chat.title}</p> :
                            activeChat.users.map((user, index, array) =>
                              `${user.first_name} ${user.last_name}${index + 1 !== array.length ? `, ` : ``}`)
                        }
                      </div>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body style={{ display: `flex`, flexDirection: `column`, justifyContent: `space-between` }}>
                    <div>
                      {
                        activeChat.messages?.length ?
                          activeChat.messages.map(message =>
                            <div className="row" style={{ margin: 0 }}>
                              <div className={`${currentUser.id === message.created_by ? `mine` : `yours`} messages`}>
                                <OverlayTrigger
                                  delay={{ show: 250, hide: 400 }}
                                  placement="top"
                                  overlay={
                                    <Popover>
                                      <Popover.Body>
                                        <EllipsisIcon />
                                      </Popover.Body>
                                    </Popover>
                                  }>
                                  <>
                                    <div className="message">
                                      {message.message}
                                    </div>
                                    <ReactTimeAgo date={message.created_at} style={{ fontSize: `12px` }} />
                                  </>
                                </OverlayTrigger>
                                {/* <img src={require(`../../assets/images/DefaultPFP.png`)} alt="Profile" /> */}
                              </div>
                            </div>) :
                          `There doesn't seem to be anything here`
                      }
                    </div>

                    <Form onSubmit={handleSubmit(sendMessage)}>
                      <div id="chatbar" className="input-group">
                        <InputGroup>
                          <input
                            {...register(`message`)}
                            type="text"
                            id="my-message"
                            className="form-control"
                            placeholder="Type a message..." />
                          <Button
                            variant="outline-danger"
                            onClick={handleSubmit(sendMessage)}
                            id="send-button"
                            type="button">
                            Send
                          </Button>
                        </InputGroup>
                      </div>
                    </Form>
                  </Card.Body>
                </Card> :
                <div />
          }
        </div>
      </Row>
    </div>
  );
};
