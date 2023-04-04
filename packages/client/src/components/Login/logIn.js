import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
import { Card } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuth } from "../../shared/contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";

export const LogIn = () => {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(`Enter a valid email`),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (currentUser) {
      navigate(`/`);
    }
  }, [ currentUser, navigate ]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const { email, password } = data;

      await login(email, password);
      reset();
    } catch (err) {
      console.log(err);
      console.log(`Invalid username or password`);
    }
  };

  return (
    <div className="parent" style={{ width: `100%` }}>

      <div className="child"
        style={{
          float: `left`, display: `flex`, justifyContent: `left`, width: `44rem`, height: `94vh`,
        }}>
        <img src={require(`../../assets/images/clifton.jpg`)} alt="clifton" />
      </div>

      <div className="child" style={{ display: `flex`, justifyContent: `right` }}>
        <Card style={{
          display: `flex`, justifyContent: `center`, alignItems: `center`, width: `47rem`, height: `94vh`,
        }} >
          <div className="p-3 my-5 d-flex flex-column w-50">
            <div className="text-center">
              <img src={require(`../../assets/images/RoomRateLogoRed.png`)} alt="logo" width={300} />
            </div>

            <h6>Please login to your account</h6><br />
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                placeholder="E-mail"
                type="email"
                className={`form-control ${errors.email ? `is-invalid` : ``}`}
                {...register(`email`)}
              />
              <div className="invalid-feedback">{errors.email?.message}</div><br />
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
                <a href="login/password">Forgot password?</a>
              </div>

              <div className="text-center">
                <Button variant="primary" type="submit" className="text-center">SIGN IN</Button>
              </div><br />

              <div className="text-center">
                <p>Not a member? <a href="login/signup">Register</a></p>
              </div>

            </form>
          </div>
        </Card>
      </div>
    </div>

  );
};