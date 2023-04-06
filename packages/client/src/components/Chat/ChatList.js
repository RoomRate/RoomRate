/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Button, Dropdown, DropdownButton, Modal, Form } from 'react-bootstrap';
import { ChatService, UserService } from '../../shared/services';
import { useAuth } from '../../shared/contexts/AuthContext';
import { LoadingIcon } from '../../shared/A-UI';
import { Image } from 'react-extras';
import DEFAULT_PFP from '../../assets/images/DefaultPFP.png';
import ReactTimeAgo from 'react-time-ago';
import { FaEllipsisH as EllipsisIcon } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { InlineError } from "../../shared/A-UI";
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { CustomToggle } from "../../shared/A-UI";

export const ChatList = ({ onChatSelect }) => {
  const [ chatList, setChatList ] = useState([]);
  const [ showAddUsersModal, setShowAddUsersModal ] = useState(false);
  const [ showRenameChatModal, setShowRenameChatModal ] = useState(false);
  const [ chatBeingUpdated, setChatBeingUpdated ] = useState();
  const [ chatTitle, setChatTitle ] = useState();
  const [ activeChat, setActiveChat ] = useState(parseInt(localStorage.getItem(`lastOpenedChat`)));
  const [ loadingChatList, setLoadingChatList ] = useState(true);
  const { currentUser } = useAuth();
  const {
    formState: {
      errors,
    },
    register,
    reset,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChatList(await ChatService.getChatsForUser({ user_id: currentUser.id }));
        setLoadingChatList(false);

        if (activeChat) {
          await getChatMessages({ chat_id: activeChat });
        }
      } catch (err) {
        setLoadingChatList(false);
        throw new Error(err);
      }
    };

    fetchData();
  }, []);

  const getChatMessages = async ({ chat_id }) => {
    try {
      const chatInfo = await ChatService.getChatInfo({ chat_id, user_id: currentUser.id });

      localStorage.setItem(`lastOpenedChat`, chat_id);
      setActiveChat(chat_id);
      onChatSelect(chatInfo);
    } catch (err) {
      throw new Error(err);
    }
  };

  const toggleAddUsersModal = () => setShowAddUsersModal(!showAddUsersModal);

  const toggleRenameChatModal = ({ chat }) => {
    setChatBeingUpdated(chat);
    setChatTitle(chat.chat_title);
    setShowRenameChatModal(!showRenameChatModal);
  };

  const leaveChat = async (chat_id) => {
    await ChatService.removeUserFromChat({ chat_id, user_id: currentUser.id });

    // TODO remove the chat from the UI / change the current "selected chat"
  };

  const searchUsers = async (q) => {
    const users = await UserService.searchUsers({ q });

    return users;
  };

  const addUserToChat = async (data) => {
    const { id: user_id, chat_id } = data.user;

    await ChatService.addUserToChat({ chat_id, user_id });
  };

  const renameChat = async (data) => {
    const { title, chat_id } = data;

    await ChatService.changeTitle({ chat_id, title });

    reset();
    setChatTitle(``);
    setChatBeingUpdated(null);

    // TODO update UI
  };

  const handleChatTitleChange = (e) => setChatTitle(e.target.value);

  return <div style={{ height: `97vh`, overflowY: `scroll` }}>
    {
      loadingChatList ?
        <LoadingIcon /> :
        <div>
          {
            chatList?.length ?
              chatList.map(chat =>
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  style={{
                    color: `black`,
                    textDecoration: `none`,
                    width: `100%`,
                    height: `100%`,
                    zIndex: -999,
                  }}
                  onClick={() => getChatMessages({ chat_id: chat.chat_id })}
                >
                  <Card
                    style={{
                      backgroundColor: chat.chat_id === activeChat ? `#FFDAD9` : ``,
                      display: `flex`,
                      flexDirection: `row`,
                      alignItems: `center`,
                      justifyContent: `space-between`,
                      width: `100%`,
                      height: `100%`,
                    }}
                    key={chat.id}
                    className="propertyListing"
                  >
                    <Card.Body>
                      <div className="d-flex w-100" style={{ padding: 0 }}>
                        <Image url={DEFAULT_PFP} width={50} height={50} alt="chatImg" />
                        <div className="text-start ms-2">
                          <h4 style={{ textOverflow: `ellipsis` }}>{chat.chat_title}</h4>
                          {
                            chat.last_message?.message &&
                              <>
                                <p style={{ overflowX: `ellipsis` }} className="col">
                                  {chat.user_id === chat.last_message.user.id ? `You: ` :
                                    `${chat.last_message.user.first_name} ${chat.last_message.user.last_name}: `}
                                  {chat.last_message.message} -
                                  <ReactTimeAgo
                                    date={chat.last_message.created_at}
                                    className="mt-1 ms-1 ml-1"
                                  />
                                </p>
                              </>
                          }
                        </div>
                        <Dropdown className="ms-auto align-self-center" align={{ md: `end` }} style={{ zIndex: 999 }}>
                          <Dropdown.Toggle as={CustomToggle}>
                            <EllipsisIcon style={{ zIndex: 999 }} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => toggleRenameChatModal({ chat })} style={{ zIndex: 999 }}>
                              Rename
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => toggleAddUsersModal() } style={{ zIndex: 999 }} >
                              Add User
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => leaveChat({ chat_id: chat.id })} style={{ zIndex: 999 }}>
                              Leave
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card.Body>
                  </Card>
                </div>) :
              <p>You currently do not have any ongoing chats</p>
          }
        </div>
    }

    <Modal show={showAddUsersModal} onHide={toggleAddUsersModal} >
      <Modal.Header closeButton>
        <Modal.Title>Add Users to Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(addUserToChat)}>
          <div>
            <AsyncSelect
              className="w-100 ms-2"
              cacheOptions
              noOptionsMessage={() => `Search for user...`}
              loadOptions={debounce(searchUsers, 100, { leading: true })}
              {...register(`user`, { required: true })}
            />
            <InlineError errors={errors} name="user" message="Please select a user to add" />
          </div>
          <div className="w-100 text-end">
            <Button variant="danger" type="submit">Add User</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>

    <Modal show={showRenameChatModal} onHide={toggleRenameChatModal}>
      <Modal.Header closeButton>
        <Modal.Title>Rename Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(renameChat)}>
          <div>
            <Form.Control
              id="title"
              {...register(`title`, { required: true })}
              value={chatTitle}
              onChange={handleChatTitleChange} />
            <InlineError errors={errors} name="user" message="Chat name cannot be empty" />
          </div>
          <div className="w-100 text-end">
            <Button variant="danger" type="submit">Save Changes</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  </div>;
};