import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Row } from "react-bootstrap";
// import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
// import EdiText from 'react-editext';

function ProfileModal({ onClose }) {
  return (
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
                <div id="profilePic" style={{ textAlign: `center`, border: `1px solid black` }}>
                  <img src={require(`../../assets/images/blank-profile-picture.webp`)}
                    className="rounded-circle" style={{ width: `200px`, height: `200px` }}
                    alt="Avatar" />
                </div>
                <br />
                <div id="fullName" style={{ border: `1px solid black`, textAlign: `center` }}>
                  <h3>Full Name</h3>
                </div>
                <div id="seeking" style={{ border: `1px solid black`, textAlign: `center` }}>
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
            <Button variant="secondary">
              Edit
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="container horizontal-scrollable">
            <p>Properties:</p>
            <Row>
              <ScrollMenu
                arrowLeft={<div style={{ fontSize: `30px` }}>{` < `}</div>}
                arrowRight={<div style={{ fontSize: `30px` }}>{` > `}</div>}>
                <div style={{ width: `200px`, height: `150px`, border: `1px solid black` }} />
                <div style={{ width: `200px`, height: `150px`, border: `1px solid black` }} />
                <div style={{ width: `200px`, height: `150px`, border: `1px solid black` }} />
                <div style={{ width: `200px`, height: `150px`, border: `1px solid black` }} />
                <div style={{ width: `200px`, height: `150px`, border: `1px solid black` }} />
              </ScrollMenu>
            </Row>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

/*
return (
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
        <Modal.Title>Modal Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  </>
);*/

export default ProfileModal;
