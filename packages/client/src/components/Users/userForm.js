import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export const UserForm = () => {
  const { register, handleSubmit } = useForm();

  return (
    <>
      <div className="container">
        <h1>Create Your Profile:</h1>
        <form onSubmit={handleSubmit(() => {
        })}>

          <Row>
            <Form.Group as={Col}>
              <label htmlFor="firstName">First Name: </label>
              <input type="text" className="form-control"{...register(`firstName`, { required: true })} />
            </Form.Group>

            <Form.Group as={Col}>
              <label htmlFor="lastName">Last Name: </label>
              <input type="text" className="form-control"{...register(`lastName`, { required: true })} />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <label htmlFor="userEmail">Email: </label>
              <input type="text" className="form-control"{...register(`userEmail`, { required: true })} />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <label htmlFor="aboutMe">About Me: </label>
              <textarea className="form-control"{...register(`aboutMe`)} />
            </Form.Group>
          </Row>

          <br />
          <Row>
            <Form.Check
              type="switch"
              label="Seeking Roommates"
              {...register(`seekingRoommates`)}
            />
          </Row>

          <Button variant="danger" type="submit">Submit Profile</Button>
        </form>
      </div>
    </>
  );
};