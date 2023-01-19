import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Card } from 'react-bootstrap';

export const SignUp = () => {

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

            <h6>Please create your account</h6><br />
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
    </div>
  );
};