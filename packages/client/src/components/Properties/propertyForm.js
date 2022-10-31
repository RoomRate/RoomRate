import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export const PropertyForm = () => {
    const { register, handleSubmit } = useForm();

    return (
        <>
            <div className="container">
                <h1>Register Your Property:</h1>
                <form onSubmit={handleSubmit((data) => {
                    console.log(data);
                })}>

                    <Row>
                        <Form.Group as={Col}>
                            <label>Property Name: </label>
                            <input type="text" className="form-control"{...register("propertyName", { required: true })} />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col}>
                            <label>Owner: </label>
                            <input type="text" className="form-control"{...register("owner", { required: true })} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <label>Email: </label>
                            <input type="text" className="form-control"{...register("email", { required: true })} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <label>Phone Number: </label>
                            <input type="text" className="form-control"{...register("phoneNumber", { required: true })} />
                        </Form.Group>
                    </Row>

                    <Form.Group>
                        <label>Address</label>
                        <input type="text" className="form-control" placeholder="123 Main St."{...register("address", { required: true })} />
                    </Form.Group>

                    <Row>
                        <Form.Group>
                            <label>Address 2</label>
                            <input type="text" className="form-control" placeholder="Apartment, studio, or floor"{...register("addressTwo", { required: true })} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col}>
                            <label>City: </label>
                            <input type="text" className="form-control"{...register("city", { required: true })} />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <label>State: </label>
                            <Form.Select defaultValue="Choose..."{...register("state", { required: true })} >
                                <option>Choose...</option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District Of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <label>Zip Code: </label>
                            <input type="text" className="form-control"{...register("zipCode", { required: true, maxLength: 5 })} />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col}>
                            <label>Monthly Rent: </label>
                            <input type="number" className="form-control"{...register("monthlyRent", { required: true })} />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <label>Number of Bedrooms: </label>
                            <input type="number" className="form-control"{...register("bedrooms", { required: true })} />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <label>Number of Bathrooms: </label>
                            <input type="number" className="form-control"{...register("bathrooms", { required: true })} />
                        </Form.Group>
                    </Row>

                    <b>Upload Pictures: </b>
                    <input className="form-control" type="file" multiple {...register("pictures")}></input>

                    <br />
                    <b>Policies: </b>
                    <br />

                    <Form.Group>
                        <label>Internet Included: </label>
                        <input type="checkbox"{...register("internet")} />
                    </Form.Group>
                    <Form.Group>
                        <label>Walkable to Campus: </label>
                        <input type="checkbox"{...register("campusWalk")} />
                    </Form.Group>
                    <Form.Group>
                        <label>Pets Allowed: </label>
                        <input type="checkbox"{...register("petsAllowed")} />
                    </Form.Group>
                    <br /><br />
                    
                    <Button variant="primary" type="submit">Submit Property</Button>
                </form>
            </div>
        </>

    );

}