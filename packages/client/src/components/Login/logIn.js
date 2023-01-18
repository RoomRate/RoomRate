import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Card } from 'react-bootstrap';

export const LogIn = () => {

  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <div style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, height: `100vh` }}>
      <Card style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, width: `44rem` }} >
        <div className="p-3 my-5 d-flex flex-column w-50">
          <div className="text-center">
            <h1>Sign In:</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
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

            <div className="d-flex justify-content-between mx-3 mb-4">
              <label>
                <input type="checkbox"{...register(`remember`)} />
                &nbsp;Remember me
              </label>
              <a href="!#">Forgot password?</a>
            </div>

            <div className="text-center">
              <Button variant="primary" type="submit" className="text-center">SIGN IN</Button>
            </div><br />

            <div className="text-center">
              <p>Not a member? <a href="signup">Register</a></p>
            </div>

          </form>
        </div>
      </Card>
    </div>
  );
};