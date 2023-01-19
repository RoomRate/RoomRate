import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Card } from 'react-bootstrap';

export const LogIn = () => {

  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <div className="parent" style={{ width: `100%` }}>

      <div className="child"
        style={{ float: `left`, display: `flex`, justifyContent: `left`, width: `44rem`, height: `100vh` }}>
        <img src={require(`../../assets/images/clifton.jpg`)} alt="clifton" />
      </div>

      <div className="child" style={{ display: `flex`, justifyContent: `right` }}>
        <Card
          style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, width: `42rem`, height: `100vh` }} >
          <div className="p-3 my-5 d-flex flex-column w-50">
            <div className="text-center">
              <img src={require(`../../assets/images/roomratepic.png`)} alt="logo" width={300} />
            </div>

            <h6>Please login to your account</h6><br />
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
    </div>
  );
};