import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import { Form } from "react-bootstrap";
import { Col, Row, Card } from "react-bootstrap";
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
// import EdiText from 'react-editext';
import EditProfileModal from './EditProfileModal';
import { useAuth } from '../../shared/contexts/AuthContext';
import { LoadingIcon } from '../../shared/A-UI';
import { PropertyService } from "../../shared/services";
import { Link } from 'react-router-dom';
import PROPERTY_IMAGE from "../../assets/images/placeholderproperty.jpg";
import { Image } from 'react-extras';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { UserService } from '../../shared/services';

export const ProfileModal = ({ onClose }) => {
  const { control } = useForm();
  const [ showEditModal, setShowEditModal ] = useState(false);
  const { currentUser } = useAuth();
  const [ properties, setProperties ] = useState([]);
  const [ isLoading, setLoading ] = useState(true);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ first_name, setFirstName ] = useState(currentUser.first_name);
  const [ last_name, setLastName ] = useState(currentUser.last_name);
  const [ setSeeking ] = useState(currentUser.seeking);
  const [ setBio ] = useState(currentUser.bio);

  const seekingOptions = [
    { value: `Yes`, label: `Yes` },
    { value: `No`, label: `No` },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setProperties(await PropertyService.getPropertyList({ all: true }));
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
  }, []);

  const handleOpenEdit = () => {
    // setShowEditModal(true);
    setIsEditing(true);
  };

  const handleSave = (event) => {
    setIsEditing(false);
    event.preventDefault();
    const formData = new FormData();
    formData.append(`id`, currentUser.id);
    formData.append(`first_name`, first_name);
    formData.append(`last_name`, last_name);
    // const object = {};
    // formData.forEach((value, key) => object[key] = value);
    // const json = JSON.stringify(object);
    // formData.append(`seeking`, seeking.value);
    // formData.append(`bio`, bio);
    console.log(`clicked`, formData);
    // console.log(`test`, formData.getAll(`data`));
    UserService.updateUser(formData);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  return (
    isLoading ?
      <LoadingIcon style={{ show: `none` }} /> :
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
            {currentUser && !isEditing &&
              <div className="container">
                <Modal.Body>
                  <div className="container">
                    <Row>
                      <Col xs={4}>
                        <div id="profilePic" style={{ textAlign: `center` }}>
                          <img src={require(`../../assets/images/blank-profile-picture.webp`)}
                            className="rounded-circle" style={{ width: `200px`, height: `200px` }}
                            alt="Avatar" />
                        </div>
                        <br />
                        <div style={{ textAlign: `center` }}>
                          <h2 id="fullName">{currentUser.first_name} {currentUser.last_name}</h2>
                        </div>
                        <div id="seeking" style={{ textAlign: `center` }}>
                          <p>Seeking Roommate</p>
                        </div>
                      </Col>
                      <Col>
                        <div id="bio" style={{ border: `1px solid black`, height: `100% ` }}>
                          <p>Bio</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <br />
                  <div style={{ textAlign: `right` }}>
                    <Button variant="primary">
                      Message
                    </Button>
                    &nbsp;<Button variant="secondary" onClick={handleOpenEdit}>Edit</Button>
                    {showEditModal &&
                      <EditProfileModal onClose={handleCloseEdit}>
                        <h1>edit</h1>
                      </EditProfileModal>}
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
                            .filter(property => property.landlord_id === currentUser.id)
                            .map(property => <Link
                              to={`/property/${property.id}/detail`}
                              style={{ color: `black`, textDecoration: `none` }}
                              onClick={onClose} >
                              <Card
                                style={{ width: `275px`, height: `230px` }}
                                key={property.id} className="propertyListing mb-3"
                              >
                                <div className="container">
                                  <Image
                                    url={PROPERTY_IMAGE}
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
            {currentUser && isEditing &&
              <Modal.Body>
                <div className="container">
                  <Row>
                    <Col xs={4}>
                      <div className="container" id="profilePic">
                        <img src={require(`../../assets/images/blank-profile-picture.webp`)}
                          className="rounded-circle" style={{ width: `200px`, height: `200px`, textAlign: `center` }}
                          alt="Avatar" />
                        <input type="file" accept="image/*"
                          style={{ ptextAlign: `left` }}
                        />
                      </div>
                      <br />
                      <div>
                        <label htmlFor="first_name">First Name:</label>
                        <input
                          className="form-control" type="text"
                          id="firstName" name="firstName" value={first_name}
                          onChange={(event) => setFirstName(event.target.value)}
                        />
                        <label htmlFor="last_name">Last Name:</label>
                        <input
                          className="form-control" type="text"
                          id="lastName" name="lastName" value={last_name}
                          onChange={(event) => setLastName(event.target.value)}
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
                            onChange={(setSeeking)}
                          />}
                        />
                      </div>
                    </Col>
                    <Col>
                      <div id="bio" style={{ height: `100% ` }}>
                        <label htmlFor="bio">Bio:</label>
                        <textarea
                          className="form-control" type="text" rows={16}
                          onChange={(event) => setBio(event.target.value)}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div style={{ textAlign: `right` }}>
                  <br /><Button variant="primary" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </Modal.Body>}
          </div>
        </Modal >
      </>
  );
};
