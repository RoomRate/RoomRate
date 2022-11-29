import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { PropertyService } from "../../shared/services";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Rating from "react-rating";
import { BsStarFill, BsStar } from "react-icons/bs";
import { MarkerIcon } from "../../shared/A-UI";
import Lottie from 'lottie-react';
import loadingIcon from "assets/images/loadingIcon.json";

export const PropertyDetails = () => {
  const { id } = useParams();
  const [ isLoading, setLoading ] = useState(true);
  const [ property, setProperty ] = useState();
  const [ reviews, setReviews ] = useState([]);

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

  return (
    isLoading ?
      <div className="d-flex justify-content-center align-items-center" style={{ height: `75vh` }}>
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
              <div className="justify-content-center h-100" >
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
              <h3>{property?.street1} {property?.street2 ? `,` : ``} {property?.street2}</h3>
              <h4>{property?.bed} bed, {property?.bath} bath</h4>
              <p>Landlord: <Link to={`/user/${property.landlord.id}/detail`}>{property.landlord.name}</Link> </p>
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
                    {property?.street1}<br />
                    {property?.street2 ? <>{property?.street2}<br /></> : ``}
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
                  <p className="fw-bold m-0">{review.name}</p>
                  <Rating
                    emptySymbol={<BsStar />}
                    fullSymbol={<BsStarFill />}
                    initialRating={review.rating}
                    readonly
                  />
                  <p>{review.review}</p>
                </div>)
            }
          </div>
        </div>
      </div>
  );
};
