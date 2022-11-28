import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { LoadingIcon } from '../../shared/A-UI';
import { PropertyService } from 'shared/services';
import Select from 'react-select';

export const PropertyForm = () => {
  const { control, register, handleSubmit } = useForm();
  const [ states, setStates ] = useState();
  const [ isLoading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setStates(await PropertyService.getStates());
      }

      catch (err) {
        throw new Error(err);
      }
      finally {
        setLoading(false);
      }
    };

    document.title = `RoomRate - New Property`;
    fetchData();
  }, []);

  const createNewProperty = async (data) => {
    const formData = new FormData();
    for (const file of data.pictures) {
      formData.append(`pictures`, file);
    }
    formData.append(`data`, JSON.stringify(data));
    const newProperty = await PropertyService.createProperty(formData);

    console.log(newProperty);
  };

  return (
    isLoading ? <LoadingIcon /> : <>
      <div className="container">
        <h1>Register Your Property:</h1>
        <form onSubmit={handleSubmit(createNewProperty)}>
          <Form.Group>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="123 Main St."
              {...register(`address`, { required: true })}
            />
          </Form.Group>

          <Row>
            <Form.Group>
              <label htmlFor="addressTwo">Address 2</label>
              <input
                type="text"
                className="form-control"
                placeholder="Apartment, studio, or floor"
                {...register(`addressTwo`, { required: true })}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <label htmlFor="city">City: </label>
              <input type="text" className="form-control"{...register(`city`, { required: true })} />
            </Form.Group>

            <Form.Group as={Col}>
              <label htmlFor="state">State: </label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => <Select
                  {...field}
                  classNamePrefix="react-select"
                  options={states.map(state => ({ label: state.name, value: state.id }))}
                />}
                rules={{
                  required: `Please select a state`,
                }}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <label htmlFor="zipCode">Zip Code: </label>
              <input type="text" className="form-control"{...register(`zipCode`, { required: true, maxLength: 5 })} />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <label htmlFor="monthlyRent">Monthly Rent: </label>
              <input type="number" className="form-control"{...register(`monthlyRent`, { required: true })} />
            </Form.Group>

            <Form.Group as={Col}>
              <label htmlFor="bedrooms">Number of Bedrooms: </label>
              <input type="number" className="form-control"{...register(`bedrooms`, { required: true })} />
            </Form.Group>

            <Form.Group as={Col}>
              <label htmlFor="bathrooms">Number of Bathrooms: </label>
              <input type="number" className="form-control"{...register(`bathrooms`, { required: true })} />
            </Form.Group>
          </Row>
          <Form.Group as={Col}>
            <label htmlFor="description">A brief description of the property: </label>
            <textarea rows={5} className="form-control" {...register(`description`)} />
          </Form.Group>
          <b>Upload Pictures: </b>
          <input className="form-control" type="file" accept="image/*" multiple {...register(`pictures`)} />

          <br />
          <b>Policies: </b>
          <br />

          <Form.Group>
            <label htmlFor="internet">Internet Included: </label>
            <input type="checkbox"{...register(`internet`)} />
          </Form.Group>
          <Form.Group>
            <label htmlFor="campusWalk">Walkable to Campus: </label>
            <input type="checkbox"{...register(`campusWalk`)} />
          </Form.Group>
          <Form.Group>
            <label htmlFor="petsAllowed">Pets Allowed: </label>
            <input type="checkbox"{...register(`petsAllowed`)} />
          </Form.Group>
          <br /><br />

          <Button variant="primary" type="submit">Submit Property</Button>
        </form>
      </div>
    </>
  );
};