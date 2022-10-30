import React, { useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { ChatList } from './ChatList';
import { useForm } from 'react-hook-form';
import { ChatService } from 'shared/services';
import './chat.scss';

const user_id = 13; // TODO grab this from the auth strategy

export const ChatView = () => {
  const [ chat, setChat ] = useState();
  const { register, handleSubmit } = useForm();

  const setCurrentChat = ({ chat }) => setChat(chat);

  const sendMessage = async ({ message }) => {
    if (message) {
      const { id: chat_id } = chat;

      const sentMessage = await ChatService.sendMessage({ message, user_id, chat_id });

       chat.messages.push(sentMessage);
    }
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
                {
                  chat.title ?
                    <div>{chat.title}</div> :
                    chat.users.map((user, index, array) => 
                      `${ user.first_name } ${ user.last_name }${ index + 1 !== array.length ? `, ` : `` }`  
                    )
                }
              </Card.Title>
              <Card.Body>
                {
                  chat.messages?.length ?
                    chat.messages.map(message => 
                      <div className={`${ user_id === message.created_by ? `mine` : `yours` } messages`}>
                        <div className="message">
                          {message.message}
                        </div>
                      </div> 
                  ) :
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
                      <button
                        className="btn btn-outline-primary"
                        id="send-button"
                        type="button">
                        Send
                      </button>
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
}