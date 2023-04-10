import React, { useEffect, useState } from 'react';
import { Button, Card, Form, InputGroup, Row, OverlayTrigger, Popover, Dropdown, Modal } from 'react-bootstrap';
import { ChatList } from './ChatList';
import { useForm } from 'react-hook-form';
import { ChatService, UserService } from '../../shared/services';
import { useAuth } from '../../shared/contexts/AuthContext';
import './chat.scss';
import { LoadingIcon } from '../../shared/A-UI';
import { FaEllipsisV as EllipsisIcon } from "react-icons/fa";
import ReactTimeAgo from 'react-time-ago';
import { CustomToggle } from "../../shared/A-UI";
import { InlineError } from "../../shared/A-UI";
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';

export const ChatView = () => {
  document.title = `Roomrate - Chats`;
  const [ activeChat, setActiveChat ] = useState(parseInt(localStorage.getItem(`lastOpenedChat`)));
  const [ loadingChat, setLoadingChat ] = useState(true);
  const { currentUser } = useAuth();
  const [ showRenameChatModal, setShowRenameChatModal ] = useState(false);
  const [ showAddUsersModal, setShowAddUsersModal ] = useState(false);

  // const [ chatBeingUpdated, setChatBeingUpdated ] = useState();
  const [ chatTitle, setChatTitle ] = useState();
  const [ chatId, setChatId ] = useState();
  // const [ userId, setUserId ] = useState();
  const {
    handleSubmit,
    formState: {
      errors,
    },
    register,
    reset,
  } = useForm();

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
    console.log(`sending message:`, message);
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

  const searchUsers = async (q) => {
    const users = await UserService.searchUsers({ q });

    return users.map(u => ({ value: u.id, label: `${u.first_name} ${u.last_name}` }));
  };

  const toggleRenameChatModal = ({ chat_id, title } = {}) => {
    // setChatBeingUpdated(chat);
    console.log(`toggleRenameChatModal`, chat_id, title);
    setChatTitle(title);
    setChatId(chat_id);
    setShowRenameChatModal(!showRenameChatModal);
  };

  const toggleAddUsersModal = ({ chat_id }) => {
    setChatId(chat_id);
    setShowAddUsersModal(!showAddUsersModal);
  };

  const leaveChat = async ({ chat_id }) => {
    await ChatService.removeUserFromChat({ chat_id, user_id: currentUser.id });
    setActiveChat(null);
    // TODO remove the chat from the UI / change the current "selected chat"
    window.location.reload();
    localStorage.setItem(`lastOpenedChat`, null);
  };

  const renameChat = async () => {
    await ChatService.changeTitle({ chat_id: chatId, title: chatTitle });
    reset();
    setShowRenameChatModal(false);
    window.location.reload();
  };
  /*
  const addUserToChat = async (data, chatId) => {
    const { id: user_id, chat_id } = data.user;

    await ChatService.addUserToChat({ chat_id: chatId, user_id });
  };
*/
  const handleChatTitleChange = (e) => setChatTitle(e.target.value);

  return (
    <div style={{ height: `93.80vh`, overflow: `hidden` }}>
      <Row style={{ padding: 0 }}>
        <div className="col-md-4" style={{ margin: 0, padding: 0 }}>
          <ChatList onChatSelect={setCurrentChat} />
        </div>
        <div className="col-md-8" style={{ margin: 0, padding: 0 }}>
          {
            activeChat ?
              loadingChat ?
                <LoadingIcon /> :
                activeChat ?
                  <Card style={{ height: `93.80vh`, borderRadius: 0 }}>
                    <Card.Header>
                      <Card.Title>
                        <div className="d-flex justify-content-between align-items-center">
                          {
                            activeChat.chat.title ?
                              <h4>{activeChat.chat.title}</h4> :
                              activeChat.users.map((user, index, array) =>
                                `${user.first_name} ${user.last_name}${index + 1 !== array.length ? `, ` : ``}`)
                          }
                          <Dropdown className="align-self-center">
                            <Dropdown.Toggle as={CustomToggle}>
                              <EllipsisIcon />
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ left: `-250%` }}>
                              { /* eslint-disable-next-line max-len */}
                              <Dropdown.Item onClick={() => toggleRenameChatModal({ chat_id: activeChat.chat.id, title: activeChat.chat.title })}>
                                Rename
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => toggleAddUsersModal({ chat_id: activeChat.chat.id })}>
                                Add User
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => leaveChat({ chat_id: activeChat.chat.id })}>
                                Leave Chat
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
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
                  <div /> : <p>Click on a chat to see messages</p>
          }

          <Modal show={showRenameChatModal} onHide={toggleRenameChatModal}>
            <Modal.Header closeButton>
              <Modal.Title>Rename Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={renameChat}>
                <div>
                  <Form.Control
                    id="title"
                    {...register(`title`, { required: true })}
                    value={chatTitle}
                    onChange={handleChatTitleChange}
                  />
                  <InlineError
                    errors={errors}
                    name="title"
                    message="Chat name cannot be empty"
                  />
                </div>
                <div className="w-100 text-end">
                  <br />
                  <Button variant="danger" type="submit">
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showAddUsersModal} onHide={toggleAddUsersModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add Users to Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit()}>
                <div>
                  <AsyncSelect
                    cacheOptions
                    noOptionsMessage={() => `Search for user...`}
                    loadOptions={debounce(searchUsers, 100, { leading: true })}
                    {...register(`user`, { required: true })}
                  />
                  <InlineError errors={errors} name="user" message="Please select a user to add" />
                </div>
                <div className="w-100 text-end">
                  <br /><Button variant="danger" type="submit">Add User</Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

        </div>
      </Row>
    </div>
  );
};
