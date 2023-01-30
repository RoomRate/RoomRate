import React, { useState, useEffect } from "react";
import { Button, Carousel, Form } from "react-bootstrap";
import { PropertyService } from "../../shared/services";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Rating from "react-rating";
import { BsStarFill, BsStar } from "react-icons/bs";
import { useForm } from 'react-hook-form';
import { MarkerIcon } from "../../shared/A-UI";
import Lottie from 'lottie-react';
import loadingIcon from "assets/images/loadingIcon.json";

export const PropertyDetails = () => {
  const { register, reset, handleSubmit } = useForm();
  const { id } = useParams();
  const [ isLoading, setLoading ] = useState(true);
  const [ property, setProperty ] = useState();
  const [ reviews, setReviews ] = useState([]);
  const [ reviewRating, setReviewRating ] = useState(2.5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setProperty(await PropertyService.getPropertyDetails({ id }));
        setReviews(await PropertyService.getReviews({ id }));
      }
      catch (err) {
        throw new Error(err);
      }
      finally {
        setLoading(false);
      }
    };

    document.title = `RoomRate - Property Details`;
    fetchData();
  }, [ id ]);

  const submitReview = async (data) => {
    const review = {
      id,
      rating: reviewRating,
      message: data.review,
    };

    await PropertyService.createReview({ review });
    reset();
    setReviews(await PropertyService.getReviews({ id }));
  };

  return (
    isLoading ?
      <div className="d-flex justify-content-center" style={{ height: `75vh` }}>
        <div style={{ maxHeight: `300px`, maxWidth: `300px` }}>
          <Lottie animationData={loadingIcon} loop={true} />
        </div>
      </div> :
      <div>
        <h1>Property Details</h1>
        <br />
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div >
                <Carousel>
                  {
                    property.images?.map((image) =>
                      <Carousel.Item>
                        <img
                          src={`data:image/jpeg;base64, ${image}`}
                          className="d-block w-100"
                          alt="property_image" />
                      </Carousel.Item>)
                  }
                </Carousel>
              </div>
            </div>
            <div className="col-md-6">
              <h3>{property?.street_1} {property?.street_2 ? `,` : ``} {property?.street_2}</h3>
              <h4>{property?.bed} bed, {property?.bath} bath</h4>
              <p>Landlord: <Link to={`/user/${property.landlord_id}/detail`}>
                {`${property.first_name} ${property.last_name}`}
              </Link> </p>
              <p>Description: {property?.details}</p>
            </div>
          </div>
          <br /> <br />
          <div id="propertyMap" style={{ maxHeight: `90vh`, overflow: `hidden` }}>
            <h4>Map</h4>
            <MapContainer
              style={{ height: `40vh` }}
              center={[ property.lat, property.lng ]}
              zoom={20}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                icon={MarkerIcon}
                position={[ property?.lat, property?.lng ]}>
                <Popup>
                  <div>
                    <div className="tooltip-header">
                      {property?.name}
                    </div>
                    <hr />
                    {property?.street_1}<br />
                    {property?.street_2 ? <>{property?.street_2}<br /></> : ``}
                    {property?.city}, {property?.state_name} {property?.zip}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <br /> <br />
          <div id="reviews">
            <h4>Reviews</h4>
            {
              reviews.map(review =>
                <div className="mx-2 w-100 border-bottom">
                  <p className="fw-bold m-0">{`${review.first_name} ${review.last_name}`}</p>
                  <Rating
                    emptySymbol={<BsStar />}
                    fullSymbol={<BsStarFill />}
                    initialRating={review.rating}
                    readonly
                  />
                  <p>{review.message}</p>
                </div>)
            }
            <Form onSubmit={handleSubmit(submitReview)}>
              <div className="mb-4">
                <h4 className="mr-auto">Leave a review on this property</h4>
                <Rating
                  emptySymbol={<BsStar />}
                  fullSymbol={<BsStarFill />}
                  initialRating={2.5}
                  onChange={(value) => setReviewRating(value)}
                />
                <textarea
                  {...register(`review`)}
                  className="w-100 mt-2"
                  rows={6}
                  placeholder="Describe your experience..."
                />
                <Button variant="primary" type="submit">Submit</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
  );
};
