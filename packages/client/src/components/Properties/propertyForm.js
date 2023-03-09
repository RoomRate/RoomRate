import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { PropertyService } from '../../shared/services';
import Select from 'react-select';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import CurrencyInput from 'react-currency-input-field';
import { useAuth } from '../../shared/contexts/AuthContext';

const GooglePlacesAutocompleteComponent = ({ error, ...field }) =>
  <div>
    <GooglePlacesAutocomplete
      apiKey="AIzaSyDBKcovwh0tZ7C_MZ8y44SY_CDuKc2fEsM"
      selectProps={{
        ...field,
        isClearable: true,
      }}
    />
    {error && <div style={{ color: `red` }}>{error.message}</div>}
  </div>;

export const PropertyForm = () => {
  const { control, register, handleSubmit, reset } = useForm();
  const [ pic, setPic ] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  function uploadSingleFile(e) {
    const files = [ ...e.target.files ];
    setPic(files);
  }

  function deleteFile(e) {
    const s = pic.filter((item, index) => index !== e);
    setPic(s);
  }

  const bedrooms = [
    { value: `studio`, label: `Studio` },
    { value: 1.0, label: 1.0 },
    { value: 2.0, label: 2.0 },
    { value: 3.0, label: 3.0 },
    { value: 4.0, label: 4.0 },
    { value: 5.0, label: 5.0 },
    { value: 6.0, label: 6.0 },
  ];

  const bathrooms = [
    { value: 1.0, label: 1.0 },
    { value: 2.0, label: 2.0 },
    { value: 3.0, label: 3.0 },
    { value: 4.0, label: 4.0 },
    { value: 5.0, label: 5.0 },
    { value: 6.0, label: 6.0 },
  ];

  const propertyType = [
    { value: `Full House`, label: `Full House` },
    { value: `Split House`, label: `Split House` },
    { value: `Apartment`, label: `Apartment` },
    { value: `Sublease`, label: `Sublease` },
  ];

  document.title = `RoomRate - New Property`;

  const createNewProperty = async (data) => {
    const formData = new FormData();
    data.policies = {};
    data.policies.heat = data.heat;
    data.policies.ac = data.ac;
    data.policies.pets = data.pets;
    data.policies.internet = data.internet;
    data.policies.parking = data.parking;
    data.policies.laundry = data.laundry;
    data.policies.utilities = data.utilities;
    data.policies.wheelchair = data.wheelchair;
    data.policies.furnished = data.furnished;
    data.landlord_id = currentUser.id;

    delete data.heat;
    delete data.ac;
    delete data.pets;
    delete data.internet;
    delete data.parking;
    delete data.laundry;
    delete data.utilities;
    delete data.wheelchair;
    delete data.furnished;

    for (const file of pic) {
      formData.append(`pictures`, file);
    }
    formData.append(`data`, JSON.stringify(data));
    const newId = await PropertyService.createProperty(formData);
    reset();

    return navigate(`/property/${newId}/detail`);

  };

  return (
    <>
      <div style={{
        width: `50%`, marginLeft: `auto`, marginRight: `auto`, textAlign: `left`,
        height: `100%`, border: `1px solid DarkGray`,
        borderRadius: `10px`, marginTop: `1%`, marginBottom: `1%`,
      }}>
        <br /><h2 style={{ textAlign: `center` }}><b> List Your Property For Everyone To See </b></h2>
        <form style={{
          marginTop: `2%`, marginLeft: `15%`, marginRight: `15%`,
        }} onSubmit={handleSubmit(createNewProperty)}>
          <Row>
            <Form.Group as={Col}>
              <label htmlFor="address">Street Address</label>
              <Controller
                name="address"
                rules={{
                  required: `This is a required field`,
                }}
                control={control}
                render={({ field, fieldState }) =>
                  <GooglePlacesAutocompleteComponent
                    {...field}
                    error={fieldState.error}
                  />}
              />
            </Form.Group>
            <Col xs={2}>
              <label htmlFor="unit">Unit/Apt#</label>
              <input
                type="text"
                className="form-control"
                {...register(`unitNo`)}
              />
            </Col>
          </Row><br />

          <Row>
            <Form.Group as={Col}>
              <label htmlFor="type">Property Type</label>
              <Controller
                name="propType"
                control={control}
                render={({ field }) => <Select
                  {...field}
                  classNamePrefix="react-select"
                  options={propertyType}
                />}
                rules={{
                  required: `Please Select`,
                }}
              /><br />
            </Form.Group>
            <Form.Group as={Col}>
              <label htmlFor="price">Monthly Price</label>
              <CurrencyInput
                placeholder="$"
                className="form-control"
                decimalsLimit={2}
                intlConfig={{ locale: `en-US`, currency: `USD` }}
                {...register(`price`, { required: true })}
              />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <label htmlFor="beds">Bedrooms</label>
              <Controller
                name="bed"
                control={control}
                render={({ field }) => <Select
                  {...field}
                  classNamePrefix="react-select"
                  options={bedrooms}
                />}
                rules={{
                  required: `Please Select`,
                }}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <label htmlFor="baths">Bathrooms</label>
              <Controller
                name="bath"
                control={control}
                render={({ field }) => <Select
                  {...field}
                  classNamePrefix="react-select"
                  options={bathrooms}
                />}
                rules={{
                  required: `Please Select`,
                }}
              /><br />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group>
              <label htmlFor="description">Brief description of the property: </label>
              <textarea rows={5} className="form-control" {...register(`description`, { required: true })} /><br />
            </Form.Group>
          </Row>

          <Row>
            <p>Check what policies apply:</p>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`pets`)} />
              <label htmlFor="pets">&nbsp;Pets Allowed</label>
            </Form.Group>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`heat`)} />
              <label htmlFor="heat">&nbsp;Central Heating</label>
            </Form.Group>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`ac`)} />
              <label htmlFor="ac">&nbsp;Air Conditioning</label>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`internet`)} />
              <label htmlFor="internet">&nbsp;Internet Included</label>
            </Form.Group>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`parking`)} />
              <label htmlFor="parking">&nbsp;Parking</label>
            </Form.Group>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`laundry`)} />
              <label htmlFor="laundry">&nbsp;Laundry Onsite</label>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`utilities`)} />
              <label htmlFor="utilities">&nbsp;Utilities Included</label>
            </Form.Group>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`wheelchair`)} />
              <label htmlFor="wheelchair">&nbsp;Wheelchair Accessible</label>
            </Form.Group>
            <Form.Group as={Col}>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`furnished`)} />
              <label htmlFor="furnished">&nbsp;Pre-furnished</label>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group>
              <div className="form-group preview">
                {pic.length > 0 &&
                  pic.map((item, index) =>
                    <div key={item}>
                      <img src={URL.createObjectURL(item)} alt="" style={{ width: `100px` }} />
                      <button type="button" className="btn-close" onClick={() => deleteFile(index)}>
                        <span className="icon-cross" />
                        <span className="visually-hidden">Close</span>
                      </button>
                    </div>)}

              </div>
              <div className="form-group">
                <br /><input
                  type="file"
                  className="form-control"
                  onChange={uploadSingleFile}
                  multiple="multiple"
                />
              </div>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group>
              <br /><label htmlFor="verified">I would like to verify this property is mine:&nbsp;</label>
              <input type="checkbox" className="toggle-switch-checkbox"{...register(`verified`)} />
            </Form.Group>
          </Row>

          <div style={{ textAlign: `center` }}>
            <br /><Button type="submit" style={{
              width: `50%`,
            }}>Add My Property</Button><br /><br />
            <p>By clicking Add My Property above, I agree that I will provide
              accurate and non discriminatory information and I will comply with
              the RoomRate.homes <a href=" ">Terms and Conditions</a>. </p>
          </div>

        </form>
      </div>
    </>
  );
};