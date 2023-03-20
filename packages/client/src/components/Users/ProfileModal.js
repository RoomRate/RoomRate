import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import { Form } from "react-bootstrap";
import { Col, Row, Card } from "react-bootstrap";
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
// import EdiText from 'react-editext';
import { useAuth } from '../../shared/contexts/AuthContext';
import { LoadingIconProfile } from '../../shared/A-UI/LoadingIconProfile';
import { PropertyService } from "../../shared/services";
import { Link } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { UserService } from '../../shared/services';
import { ChatService } from '../../shared/services';
import { createBrowserHistory } from 'history';

export const ProfileModal = ({ id, onClose }) => {
  const { control, handleSubmit, register, reset } = useForm();
  const { currentUser } = useAuth();
  const [ user, setUser ] = useState([]);
  const [ properties, setProperties ] = useState([]);
  const [ isLoading, setLoading ] = useState(true);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ pic, setPic ] = useState([]);
  const [ userImage, setUserImage ] = useState([]);
  const [ thumbnails, setThumbnail ] = useState([]);
  const history = createBrowserHistory();

  function uploadSingleFile(e) {
    const files = [ ...e.target.files ];
    setPic(files);
  }

  const seekingOptions = [
    { value: `Yes`, label: `Yes` },
    { value: `No`, label: `No` },
  ];

  async function startChat() {
    const title = `Chat with test`;
    await ChatService.createNewChat({ created_by: currentUser.id, title });

    const chats = await ChatService.getChatsForUser({ user_id: currentUser.id });
    const chat = chats.find((c) => c.title === title);

    await ChatService.addUserToChat({ chat_id: chat.id, user_id: user.id });
    console.log(`User ${user.first_name} has been added to chat ${chat.id}`);
    history.push(`/chat`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const propertyList = await PropertyService.getPropertyList({ all: true });
        { /* eslint-disable-next-line max-len */ }
        const thumbnailPromises = propertyList.map(property => PropertyService.getPropertyThumbnail({ property_id: property.id }));
        const thumbnail = await Promise.all(thumbnailPromises);
        const thumbnailList = {};
        propertyList.forEach((property, index) => {
          thumbnailList[property.id] = thumbnail[index];
        });
        setProperties(propertyList);
        setThumbnail(thumbnailList);
        setUser(await UserService.getUserDetails({ id }));
        setUserImage(await UserService.getUserImage({ id }));
      }

      catch (err) {
        throw new Error(err);
      }
      finally {
        setLoading(false);
      }
    };

    document.title = `RoomRate - Properties`;
    fetchData();
  }, [ id ]);

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (data) => {
    data.seeking = data.seeking.value;
    setIsEditing(false);
    const formData = new FormData();

    for (const file of pic) {
      formData.append(`pictures`, file);
    }
    formData.append(`userData`, JSON.stringify({
      ...data,
      uid: currentUser.id,
    }));
    UserService.updateUser(formData);
    reset();
  };

  return (
    isLoading ?
      <LoadingIconProfile /> :
      <>
        <Modal
          className="modal"
          animation={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={true}
          onHide={onClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>User Profile</Modal.Title>
          </Modal.Header>
          <div>
            {user && !isEditing &&
              <div className="container">
                <Modal.Body>
                  <div className="container">
                    <Row>
                      <Col xs={4}>
                        <div id="profilePic" style={{ textAlign: `center` }}>
                          <img
                            src={userImage ? `data:image/jpeg;base64, ${userImage}` :
                              `../../assets/images/placeholderprofile.jpg`}
                            className="rounded-circle"
                            style={{ width: `225px`, height: `225px`, border: `1px solid black` }}
                            alt="user_image"
                          />
                        </div>
                        <div style={{ textAlign: `center` }}>
                          <h2 id="fullName">{user.first_name} {user.last_name}</h2>
                        </div>
                        <div id="seeking" style={{ textAlign: `center` }}>
                          <h5>Seeking Roommate: {user.seeking}</h5>
                        </div>
                      </Col>
                      <Col>
                        <div id="bio" style={{ marginLeft: `50px`, height: `100% ` }}>
                          <h5>{user.bio}</h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <br />
                  <div style={{ textAlign: `right` }}>
                    {id === currentUser.id ?
                      <>
                        <Button variant="secondary" onClick={handleOpenEdit}>Edit</Button>
                      &nbsp;
                        <Button variant="primary">Logout</Button>
                      </> :
                      <Button variant="primary" onClick={startChat}>Message</Button>}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="container horizontal-scrollable">
                    <p>Properties:</p>
                    <Row>
                      <ScrollMenu
                        arrowLeft={<div style={{ fontSize: `30px` }}>{` < `}</div>}
                        arrowRight={<div style={{ fontSize: `30px` }}>{` > `}</div>}>
                        {
                          properties
                            .filter(property => property.landlord_id === user.id)
                            .map(property => <Link
                              to={`/property/${property.id}/detail`}
                              style={{ color: `black`, textDecoration: `none` }}
                              onClick={onClose} >
                              <Card
                                style={{ width: `275px`, height: `230px` }}
                                key={property.id} className="propertyListing mb-3"
                              >
                                <div className="container">
                                  <img src={`data:image/jpeg;base64, ${thumbnails[property.id]}`}
                                    alt="propertyimg"
                                    className="w-100" />
                                  <h6 className="my-0">{property.street_1}</h6>
                                  {property.street_2 ? <h6 className="my-0 fw-light">Unit {property.street_2}
                                  </h6> : null}
                                </div>
                              </Card>
                            </Link>)
                        }

                      </ScrollMenu >
                    </Row >
                  </div >
                </Modal.Footer >
              </div>}
            {user && isEditing &&
              <Modal.Body>
                <form onSubmit={handleSubmit(handleSave)}>
                  <div className="container">

                    <Row>
                      <Col xs={4}>
                        <div className="container" id="profilePic">
                          <img
                            src={userImage ? `data:image/jpeg;base64, ${userImage}` :
                              `../../assets/images/blank-profile-picture.webp`}
                            className="rounded-circle"
                            style={{ width: `225px`, height: `200px`, border: `1px solid black` }}
                            alt="user_image"
                          /><br /><br />
                          <input
                            type="file"
                            onChange={uploadSingleFile}
                            single="single"
                            accept="image/*"
                          />
                        </div>
                        <br />
                        <div>
                          <label htmlFor="first_name">First Name:</label>
                          <input
                            className="form-control" type="text"
                            id="firstName" name="firstName" defaultValue={user.first_name}
                            {...register(`first_name`)}
                          />
                          <label htmlFor="last_name">Last Name:</label>
                          <input
                            className="form-control" type="text"
                            id="lastName" name="lastName" defaultValue={user.last_name}
                            {...register(`last_name`)}
                          />
                        </div>
                        <div id="seeking">
                          <label htmlFor="seeking">Are you seeking roommates?</label>
                          <Controller
                            name="seeking"
                            control={control}
                            render={({ field }) => <Select
                              {...field}
                              classNamePrefix="react-select"
                              options={seekingOptions}
                              defaultValue={user.seeking}
                            />}
                            rules={{
                              required: `Please Select`,
                            }}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div id="bio" style={{ height: `100% ` }}>
                          <label htmlFor="bio">Bio:</label>
                          <textarea
                            className="form-control" type="text" rows={18}
                            defaultValue={user.bio}
                            {...register(`bio`)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div style={{ textAlign: `right` }}>
                    <br /><Button variant="primary" type="submit">
                      Save
                    </Button>

                  </div>
                </form>
              </Modal.Body>}
          </div>
        </Modal >
      </>
  );
};
