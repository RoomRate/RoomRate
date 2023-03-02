import React, { useState, useEffect } from "react";
import { Button, Card, Dropdown } from "react-bootstrap";
import Lottie from 'lottie-react';
import { RoommateService } from "../../shared/services";
import { useForm } from "react-hook-form";
import { Image } from 'react-extras';
import { BsThreeDots } from "react-icons/bs";
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import loadingIcon from '../../assets/images/loadingIcon.json';
import DEFAULT_PFP from '../../assets/images/DefaultPFP.png';

export const RoommateFinder = () => {
  const [ isLoading, setLoading ] = useState(true);
  const [ posts, setPosts ] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setPosts(await RoommateService.getPosts());
      }
      catch (err) {
        throw new Error(err);
      }
      finally {
        setLoading(false);
      }
    };

    document.title = `RoomRate - Roommate Finder`;
    fetchData();
  }, []);

  const createPost = async (post) => {
    await RoommateService.createPost(post);
    setPosts(await RoommateService.getPosts());
    reset();
  };

  const deletePost = async (id) => {
    await RoommateService.deletePost(id);
    setPosts(await RoommateService.getPosts());
  };

  return isLoading ?
    <div className="d-flex justify-content-center" style={{ height: `75vh` }}>
      <div style={{ maxHeight: `300px`, maxWidth: `300px` }}>
        <Lottie animationData={loadingIcon} loop={true} />
      </div>
    </div> :
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <h4>Filters</h4>
          <div className="text-start">
            <div className="d-flex mb-2">
              <label htmlFor="Author" className="me-auto">Author:</label>
              <input />
            </div>
            <div className="d-flex mb-2">
              <label htmlFor="Price" className="me-auto">Price:</label>
              <input />
            </div>
            <div className="d-flex mb-2">
              <label htmlFor="Property Type" className="me-auto">Property:</label>
              <input />
            </div>
            <div className="d-flex mb-2">
              <label htmlFor="Search" className="me-auto">Search:</label>
              <input />
            </div>
            <div className="d-flex">
              <Button className="ms-auto">Apply</Button>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <Card className="w-100 my-2 text-start">
            <Card.Body>
              <div className="d-flex mb-n1" >
                <div className="mt-2">
                  <Image
                    url={DEFAULT_PFP}
                    fallbackUrl={DEFAULT_PFP}
                    className="avatar rounded img-fluid"
                    alt="user profile avatar"
                    width={50} />
                </div>
                <form id="newPost" onSubmit={handleSubmit(createPost)} className="w-100 mx-2">
                  <textarea
                    className="w-100"
                    placeholder="Create post"
                    {...register(`message`)}
                  />
                </form>
                <div>
                  <Button className="btn-primary mt-2" form="newPost" type="submit">Post</Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          {
            posts.map(post => {
              console.log(post);

              return <>
                <Card className="w-100 my-2 text-start">
                  <Card.Body>
                    <div className="d-flex">
                      <div className="mr-4">
                        <Image
                          url={DEFAULT_PFP}
                          fallbackUrl={DEFAULT_PFP}
                          className="avatar rounded img-fluid me-2"
                          alt="user profile avatar"
                          width={50} />
                      </div>
                      <div className="w-100 mx-2">
                        <p className="my-0 fw-bold">{post.title}
                          {
                            post.property ?
                              <span className="text-dark"> for <Link to={`/property/${post.property.id}/detail`}>
                                {post.property.street_1} {post.property.street_2}
                              </Link>
                              </span> :
                              null
                          }
                        </p>
                        <Card.Text>
                          <p>{post.message}</p>
                          <p className="my-0"><Link to={`user/${post.author.id}`}>
                            {post.author.first_name} {post.author.last_name}
                          </Link>
                          &nbsp; posted <ReactTimeAgo date={post.posted_on} /></p>
                        </Card.Text>
                      </div>
                      <Dropdown className="ms-auto">
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu>
                          <Dropdown.Item>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => deletePost(post.id)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Body>
                </Card>
              </>; })
          }
        </div>
      </div>
    </div>;
};

const CustomToggle = React.forwardRef(({ onClick }, ref) =>
  <BsThreeDots
    className="m-2"
    href="a"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />);
