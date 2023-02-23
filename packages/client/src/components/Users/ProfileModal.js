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

function ProfileModal({ onClose }) {
  const [ showEditModal, setShowEditModal ] = useState(false);
  const { currentUser } = useAuth();
  const [ properties, setProperties ] = useState([]);
  const [ isLoading, setLoading ] = useState(true);

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
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  return (
    isLoading ?
      <LoadingIcon /> :
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
                  <div id="fullName" style={{ textAlign: `center` }}>
                    <h3>{currentUser.first_name} {currentUser.last_name}</h3>
                  </div>
                  <div id="seeking" style={{ textAlign: `center` }}>
                    <p>Seeking Roommates? Yes/No</p>
                  </div>
                </Col>
                <Col>
                  <div id="bio" style={{ border: `1px solid black`, height: `100%` }}>
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
              <Button variant="secondary" onClick={handleOpenEdit}>Edit</Button>
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
                    properties.map(property => {
                      console.log(Number(property.peopleInterested) > 0);

                      return <Link
                        to={`/property/${property.id}/detail`}
                        style={{ color: `black`, textDecoration: `none` }}>
                        <Card
                          style={{ width: `275px`, height: `230px` }} key={property.id} className="propertyListing mb-3"
                        >
                          <div className="container">
                            <Image
                              url={PROPERTY_IMAGE}
                              alt="propertyimg"
                              className="w-100" />
                            <h6 className="my-0">{property.street_1}</h6>
                            {property.street_2 ? <h6 className="my-0 fw-light">Unit {property.street_2}</h6> : null}
                          </div>
                        </Card>
                      </Link>;
                    })
                  }

                </ScrollMenu>
              </Row>
            </div>
          </Modal.Footer>
        </Modal>
      </>
  );
}

export default ProfileModal;
