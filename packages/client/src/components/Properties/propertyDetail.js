import React, { useState, useEffect } from "react";
import { PropertyService } from "../../shared/services";
import { useParams } from 'react-router-dom';
import { Image } from 'react-extras';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Rating from "react-rating";
import { BsStarFill, BsStar } from "react-icons/bs";
import { MarkerIcon } from "../../shared/A-UI";
import Lottie from 'lottie-react';
import PROPERTY_IMAGE from "assets/images/placeholderproperty.jpg";
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

    document.title = `Uni-Home - Property Details`;
    fetchData();
  }, [ id ]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

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
              <div className="justify-content-center" >
                <Image url={PROPERTY_IMAGE} alt="propertyimg" className="w-100" />
                <Slider {...settings}>
                  <div >
                    <h3 style={{ height: `50px`, backgroundColor: `#5f9ea0` }}>1</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px` }}>2</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px`, backgroundColor: `#5f9ea0` }}>3</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px` }}>4</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px`, backgroundColor: `#5f9ea0` }}>5</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px` }}>6</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px`, backgroundColor: `#5f9ea0` }}>7</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px` }}>8</h3>
                  </div>
                  <div>
                    <h3 style={{ height: `50px`, backgroundColor: `#5f9ea0` }}>9</h3>
                  </div>
                </Slider>
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