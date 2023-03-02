import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";
// import EdiText from 'react-editext';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { UserService } from '../../shared/services';

function EditProfileModal({ onClose }) {
  const { register, control, handleSubmit, reset } = useForm();
  /*
  const onSubmit = (data) => {
    console.log(`clicked`, data);
    reset();
    onClose();
  };
*/
  const seeking = [
    { value: `yes`, label: `yes` },
    { value: `no`, label: `no` },
  ];

  const updateUserProfile = async (data) => {
    const formData = new FormData();
    formData.append(`data`, JSON.stringify(data));
    await UserService.updateUser(formData);
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        className="modal"
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}
        onHide={onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Form onSubmit={handleSubmit(updateUserProfile)}>
              <Row>
                <Form.Group>
                  <label htmlFor="pic">Profile Picture:</label>
                  <input
                    className="form-control" type="file" name="pic" accept="image/*" {...register(`profile_pic`)}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <label htmlFor="first_name">First Name:</label>
                  <input className="form-control" type="text" name="first_name" {...register(`first_name`)} />
                </Form.Group>
                <Form.Group as={Col}>
                  <label htmlFor="last_name">Last Name:</label>
                  <input className="form-control" type="text" name="last_name" {...register(`last_name`)} />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group>
                  <label htmlFor="seeking">Are you seeking roommates?</label>
                  <Controller
                    name="seeking"
                    control={control}
                    render={({ field }) => <Select
                      {...field}
                      classNamePrefix="react-select"
                      options={seeking}
                    />}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group>
                  <label htmlFor="bio">Bio:</label>
                  <textarea rows={5} className="form-control" name="bio" {...register(`bio`)} />
                </Form.Group>
              </Row>
              <br /><div style={{ textAlign: `right` }}>
                <Button variant="primary" type="submit">Save</Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditProfileModal;