import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button } from "react-bootstrap";
import { Card } from 'react-bootstrap';
import { useAuth } from "shared/contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const { currentUser, createAccount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(`/`);
    }
  }, [ currentUser, navigate ]);

  const formSchema = Yup.object().shape({
    name: Yup.string().required(`Enter first and last name`),
    email: Yup.string()
      .email()
      .required(`E-mail is required`),
    password: Yup.string()
      .required(`Password is mandatory`)
      .min(8, `Password must be at least 8 characters long`),
    confirmPwd: Yup.string()
      .required(`Password is mandatory`)
      .oneOf([ Yup.ref(`password`) ], `Passwords do not match`),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;

      await createAccount(email, password);

      reset();
      navigate(`/`);
    } catch (err) {
      console.log(`Failed to register`);
    }
  };

  return (
    <div className="parent" style={{
      width: `100%`, position: `absolute`, overflow: `hidden`,
    }}>

      <div className="child" style={{
        float: `left`, display: `flex`, justifyContent: `left`, width: `44rem`, height: `94vh`,
      }}>
        <img src={require(`../../assets/images/clifton.jpg`)} alt="clifton" />
      </div>

      <div className="child" style={{ display: `flex`, justifyContent: `right` }}>
        <Card
          style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, width: `47rem`, height: `94vh` }} >
          <div className="p-3 my-5 d-flex flex-column w-50">
            <div className="text-center">
              <img src={require(`../../assets/images/roomratepic.png`)} alt="logo" width={300} />
            </div>

            <h6>Please create your account</h6><br />
            <form onSubmit={handleSubmit(onSubmit)}>
              <br />
              <br /><input
                id="fullName"
                type="text"
                placeholder="Name"
                className={`form-control ${errors.name ? `is-invalid` : ``}`}
                {...register(`name`)}
              />
              <div className="invalid-feedback">{errors.name?.message}</div><br />
              <input
                placeholder="E-mail"
                type="email"
                className={`form-control ${errors.email ? `is-invalid` : ``}`}
                {...register(`email`)}
              />
              <div className="invalid-feedback">{errors.email?.message}</div><br />
              <input
                name="password"
                placeholder="Password"
                type="password"
                className={`form-control ${errors.password ? `is-invalid` : ``}`}
                {...register(`password`)}
              />
              <div className="invalid-feedback">{errors.password?.message}</div><br />
              <input
                name="confirmPwd"
                placeholder="Repeat password"
                type="password"
                className={`form-control ${errors.confirmPwd ? `is-invalid` : ``}`}
                {...register(`confirmPwd`)}
              />
              <div className="invalid-feedback">{errors.confirmPwd?.message}</div><br />

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