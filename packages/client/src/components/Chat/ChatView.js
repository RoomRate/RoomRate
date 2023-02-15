/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { ChatList } from './ChatList';
import { useForm } from 'react-hook-form';
import { ChatService } from '../../shared/services';
import './chat.scss';

export const ChatView = () => {
  document.title = `Roomrate - Chats`;
  const [ chat, setChat ] = useState();
  const [ user_id, set_user_id ] = useState(13); // TODO grab this from the auth strategy
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
        if (user_id !== message.created_by) {
          chat.messages.push(message);
          setChat({ ...chat });
        }
      };
    }
  }, [ wss, chat, HOST, user_id ]);

  const setCurrentChat = (selected) => setChat(selected.chat);

  const sendMessage = async ({ message }) => {
    try {
      if (message) {
        const { id: chat_id } = chat;

        const sentMessage = await ChatService.sendMessage({ message, user_id, chat_id });

        chat.messages.push(sentMessage);
        reset();

        wss.send(JSON.stringify({
          chat_id,
          created_by: user_id,
          message,
        }));
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // This can be used for demo purposes
  const changeUser = () => {
    set_user_id(user_id === 13 ? 14 : 13);
  };

  return (
    <div className="row" style={{ height: `100vh` }}>
      <div className="col-3">
        <ChatList onChatSelect={setCurrentChat} />
      </div>
      <div className="col">
        {
          chat ?
            <Card style={{ height: `100vh` }}>
              <Card.Title>
                <div onClick={() => changeUser()}>
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
                      <div className={`${user_id === message.created_by ? `mine` : `yours`} messages`}>
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
            ``
        }
      </div>
    </div>
  );
};
