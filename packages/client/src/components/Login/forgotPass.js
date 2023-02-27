import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Card } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export const ForgotPassword = () => {
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(`Enter a valid email`),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(formSchema),
  });
  const onSubmit = (data) => {
    console.log({ data });
    reset();
  };

  return (
    <div className="parent" style={{ width: `100%` }}>

      <div className="child"
        style={{ float: `left`, display: `flex`, justifyContent: `left`, width: `44rem`, height: `94vh` }}>
        <img src={require(`../../assets/images/clifton.jpg`)} alt="clifton" />
      </div>

      <div className="child" style={{ display: `flex`, justifyContent: `right` }}>
        <Card
          style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, width: `47rem`, height: `94vh` }} >
          <div className="p-3 my-5 d-flex flex-column w-50">
            <div className="text-center">
              <img src={require(`../../assets/images/RoomRateLogoRed.png`)} alt="logo" width={300} />
            </div>

            <h4>Forgot your password?</h4>
            <h6>Please enter your email address to retrieve password</h6><br />
            <form onSubmit={handleSubmit(onSubmit)}>
              <br />
              <input
                placeholder="E-mail"
                type="email"
                className={`form-control ${errors.email ? `is-invalid` : ``}`}
                {...register(`email`)}
              />
              <div className="invalid-feedback">{errors.email?.message}</div><br />
              <div className="text-center">
                <Button variant="primary" type="submit" className="text-center">RESET PASSWORD</Button>
              </div><br />
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};