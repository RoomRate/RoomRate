import React, { useState, useEffect } from "react";
import { Button, Carousel, Card, Form, Modal } from "react-bootstrap";
import { PropertyService } from "../../shared/services";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { BsWifi, BsThermometerSun, BsThermometerSnow } from "react-icons/bs";
import { FaDog, FaWheelchair } from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";
import { MdLocalLaundryService, MdChair } from "react-icons/md";
import { GoZap } from "react-icons/go";
import { useForm } from 'react-hook-form';
import { MarkerIcon, InlineError } from "../../shared/A-UI";
import Lottie from 'lottie-react';
import loadingIcon from "../../assets/images/loadingIcon.json";
import { useAuth } from "../../shared/contexts/AuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Image } from 'react-extras';
import ReactTimeAgo from 'react-time-ago';
import 'swiper/css';
import StarRatings from "react-star-ratings";
import DEFAULT_PFP from '../../assets/images/DefaultPFP.png';
import 'swiper/scss';
import 'swiper/scss/scrollbar';

export const PropertyDetails = () => {
  const {
    formState: {
      errors,
    },
    register,
    reset,
    handleSubmit,
  } = useForm();
  const { id } = useParams();
  const [ isLoading, setLoading ] = useState(true);
  const [ property, setProperty ] = useState();
  const [ reviews, setReviews ] = useState([]);
  const [ reviewRating, setReviewRating ] = useState(3);
  const [ reviewModal, setReviewModal ] = useState(false);
  const { currentUser } = useAuth();

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

    await PropertyService.createReview({ review, user_id: currentUser.id });
    reset();
    setReviews(await PropertyService.getReviews({ id }));
    setReviewRating(3);
    setReviewModal(false);
  };

  const showReviewModal = () => setReviewModal(true);
  const hideReviewModal = () => setReviewModal(false);

  return (
    isLoading ?
      <div className="d-flex justify-content-center" style={{ height: `75vh` }}>
        <div style={{ maxHeight: `300px`, maxWidth: `300px` }}>
          <Lottie animationData={loadingIcon} loop={true} />
        </div>
      </div> :
      <div>
        <br />
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div>
                <Carousel variant="dark">
                  {
                    property.images?.map((image) =>
                      <Carousel.Item style={{ height: `400px` }}>
                        <img
                          src={`data:image/jpeg;base64, ${image}`}
                          className="d-block w-100"
                          style={{ width: `100%`, height: `100%`, objectFit: `contain` }}
                          alt="property_image" />
                      </Carousel.Item>)
                  }
                </Carousel>
              </div>
            </div>
            <div className="col-md-6  text-start">
              <div className="d-flex w-100 mb-2">
                <div>
                  <h4 className="mb-0">{property?.street_1}</h4>
                  {property.street_2 ? <h4 className="fw-light">Unit {property.street_2}</h4> : null}
                </div>
                <div className="text-end ms-auto">
                  <h4>${property.rate}</h4>
                </div>
              </div>
              <p className="mb-1">
                <span className="fw-bold">Rooms:</span> {property?.bed} bed, {property?.bath} bath
              </p>
              <p className="mb-1">
                <span className="fw-bold">Type:</span> {property?.propType}
              </p>
              <p className="mb-1">
                <span className="fw-bold">Landlord:</span> &nbsp;
                <Link to={`/user/${property.landlord_id}/detail`}>
                  {`${property.first_name} ${property.last_name}`}
                </Link>
              </p>
              <p className="mb-1"><span className="fw-bold">Description:</span> {property?.details}</p>
              <p className="mb-1"><span className="fw-bold">Amenities:</span></p>
              <div className="row">
                {
                  property?.policies?.heat ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <BsThermometerSun />
                        <p className="my-0">Central Heating</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.ac ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <BsThermometerSnow />
                        <p className="my-0">Air Conditioning</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.pets ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <FaDog />
                        <p className="my-0">Pets Allowed</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.internet ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <BsWifi />
                        <p className="my-0">Internet Included</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.parking ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <AiFillCar />
                        <p className="my-0">Parking Available</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.laundry ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <MdLocalLaundryService />
                        <p className="my-0">Laundry Available</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.utilities ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <GoZap />
                        <p className="my-0">Utilities Included</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.wheelchair ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <FaWheelchair />
                        <p className="my-0">Disabled-friendly</p>
                      </div>
                    </Card>
                  </div> : null
                }
                {
                  property?.policies?.furnished ? <div className="col-md-3 mb-1 py-1 px-1">
                    <Card>
                      <div className="text-center">
                        <MdChair />
                        <p className="my-0">Furnished</p>
                      </div>
                    </Card>
                  </div> : null
                }
              </div>
            </div>
          </div>
          <br />
          <div className="d-flex justify-content-center">
            {
              Number(property?.peopleInterested[0]?.count) > 0 ?
                <Button variant="danger" className="me-2" style={{ width: `30%` }}>
                  {/* eslint-disable-next-line max-len */}
                  Meet {property?.peopleInterested[0]?.count} more {Number(property?.peopleInterested[0]?.count) > 1 ? `people` : `person`} interested in this property
                </Button> : null
            }
            <Button variant="danger" style={{ width: `30%` }}>
              Looking for roommates for this property?
            </Button>
          </div>
          <br />
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
            <h4>What previous tenants say?</h4>
            {
              reviews.length > 0 ? <>
                <Card className="text-start w-100 my-2 py-2 px-4">
                  <div className="d-flex">
                    <div>
                      <h5>Overall Rating</h5>
                      <div className="d-flex">
                        <h5 className="fw-bold mt-1">
                          {Number(reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / reviews.length)}
                        </h5>
                      &nbsp;
                        <StarRatings
                          rating={Number(reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / reviews.length)}
                          starRatedColor="red"
                          numberOfStars={5}
                          starDimension="25px"
                          starSpacing="2px"
                          name="rating" />
                        &nbsp;
                        <h5 className="fw-light text-secondary mt-1">{reviews.length} reviews</h5>
                      </div>
                    </div>
                    <Button
                      className="btn-danger ms-auto h-50 mt-3"
                      onClick={showReviewModal}>
                      Write a review
                    </Button>
                  </div>
                </Card>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={10}>
                  {
                    reviews.map(review =>
                      <SwiperSlide>
                        <Card className="text-start">
                          <Card.Header className="pb-0 px-0">
                            <div className="d-flex w-100">
                              <div className="mx-2 mt-1">
                                <Image
                                  url={DEFAULT_PFP}
                                  fallbackUrl={DEFAULT_PFP}
                                  className="avatar rounded img-fluid"
                                  alt="user profile avatar"
                                  width={50} />
                              </div>
                              <div>
                                <p className="fw-bold m-0">{`${review.first_name} ${review.last_name}`}</p>
                                <div className="d-flex">
                                  <StarRatings
                                    rating={Number(review.rating)}
                                    starRatedColor="red"
                                    numberOfStars={5}
                                    starDimension="15px"
                                    starSpacing="2px"
                                    name="rating"
                                  />
                                  <ReactTimeAgo
                                    date={review.date}
                                    className="mt-1 ms-1" />
                                </div>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Text>
                            <p className="mx-2 mt-1">{review.message}</p>
                          </Card.Text>
                        </Card>
                      </SwiperSlide>)
                  }
                </Swiper>
              </> : <div>
                <Button className="btn-danger" onClick={showReviewModal}>Be the first to leave a review</Button>
              </div>
            }
            <Modal show={reviewModal} onHide={hideReviewModal}>
              <Modal.Header closeButton>
                <Modal.Title>Leave a review on this property</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit(submitReview)}>
                  <div>
                    <StarRatings
                      rating={reviewRating}
                      starRatedColor="red"
                      starEmptyColor="gray"
                      numberOfStars={5}
                      starDimension="30px"
                      starSpacing="2px"
                      changeRating={(value) => setReviewRating(value)}
                      isSelectable={true}
                      starHoverColor="red"
                    />
                    <textarea
                      {...register(`review`, { required: `Please enter your review` })}
                      className="w-100 mt-2"
                      rows={6}
                      placeholder="Describe your experience..."
                    />
                    <InlineError errors={errors} name="review" message="Please enter your review of the property" />
                  </div>
                  <div className="w-100 text-end">
                    <Button variant="danger" type="submit">Submit</Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
          <br /> <br />
        </div>
      </div>
  );
};
