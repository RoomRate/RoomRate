import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Card } from 'react-bootstrap';

export const SignUp = () => {

  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <div style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, height: `100vh` }}>
      <Card style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, width: `44rem` }} >
        <div className="p-3 my-5 d-flex flex-column w-50">
          <div className="text-center">
            <h1>Sign Up:</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <br /><input
              placeholder="Name"
              className="form-control"
              required={true}
              {...register(`name`)}
            /><br />
            <input
              placeholder="Username"
              className="form-control"
              required={true}
              {...register(`userName`)}
            /><br />
            <input
              placeholder="E-mail"
              type="email"
              className="form-control"
              required={true}
              {...register(`email`)}
            /><br />
            <input
              placeholder="Password"
              type="password"
              className="form-control"
              required={true}
              {...register(`password`)}
            /><br />
            <input
              placeholder="Repeat password"
              type="password"
              className="form-control"
              required={true}
            /><br />

            <div className="text-center">
              <Button variant="primary" type="submit" className="text-center">REGISTER</Button>
            </div><br />
          </form>
        </div>
      </Card>
    </div>
  );
};