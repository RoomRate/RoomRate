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
import AvatarGroup from 'react-avatar-group';

export const ChatList = ({ onChatSelect }) => {
  const [ chatList, setChatList ] = useState([]);
  const [ showAddUsersModal, setShowAddUsersModal ] = useState(false);
  const [ showRenameChatModal, setShowRenameChatModal ] = useState(false);
  const [ chatBeingUpdated, setChatBeingUpdated ] = useState();
  const [ chatTitle, setChatTitle ] = useState();
  const [ activeChat, setActiveChat ] = useState(parseInt(localStorage.getItem(`lastOpenedChat`)));
  const [ loadingChatList, setLoadingChatList ] = useState(true);
  const [ userImage, setUserImage ] = useState(null);
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

  const searchUsers = async (q) => {
    const users = await UserService.searchUsers({ q });
    console.log(users);

    return users;
  };
  /*
  const getChatUsers = async ({ chat_id }) => {
    setUsersInChat(await ChatService.getChatUsers({ chat_id, user_id: currentUser.id }));
    console.log(usersInChat);

    return usersInChat;
  };
*/
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
                        <AvatarGroup
                          avatars={[
                            ...(chat.users || []).map(user => ({
                              avatar: `${user.first_name} ${user.last_name}`,
                              initials: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
                            })),
                            {
                              avatar: `${currentUser.first_name} ${currentUser.last_name}`,
                              initials: `${currentUser.first_name.charAt(0)}${currentUser.last_name.charAt(0)}`,
                            },
                          ]}
                          size={35}
                        />
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
                      </div>
                    </Card.Body>
                  </Card>
                </div>) :
              <p>You currently do not have any ongoing chats</p>
          }
        </div>
    }
  </div >;
};