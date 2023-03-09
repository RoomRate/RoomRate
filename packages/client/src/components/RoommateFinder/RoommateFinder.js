import React, { useState, useEffect } from "react";
import { Button, Card, Dropdown } from "react-bootstrap";
import Lottie from 'lottie-react';
import { RoommateService } from "../../shared/services";
import { useForm } from "react-hook-form";
import { Image } from 'react-extras';
import { TfiCommentAlt } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import AsyncSelect from 'react-select/async';
import ReactTimeAgo from 'react-time-ago';
import loadingIcon from '../../assets/images/loadingIcon.json';
import DEFAULT_PFP from '../../assets/images/DefaultPFP.png';
import '../../scss/roommate_finder.scss';
import { CustomToggle } from "../../shared/A-UI";
import { PostDetailModal } from "./PostDetailModal";
import { useAuth } from '../../shared/contexts/AuthContext';

export const RoommateFinder = ({ property }) => {
  const [ isLoading, setLoading ] = useState(true);
  const [ posts, setPosts ] = useState([]);
  const [ newPostProperty, setNewPostProperty ] = useState(property ? property.id : null);
  const { register, handleSubmit, reset } = useForm();
  const [ showPostModal, setShowPostModal ] = useState(false);
  const [ postDetail, setPostDetail ] = useState(null);
  const { currentUser } = useAuth();

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
    post.property = newPostProperty;
    post.author = currentUser.id;
    await RoommateService.createPost(post);
    setPosts(await RoommateService.getPosts());
    reset();
  };

  const deletePost = async (id) => {
    await RoommateService.deletePost(id);
    setPosts(await RoommateService.getPosts());
  };

  const propertySearch = async (input) => {
    const properties = await RoommateService.searchProperties(input);

    return properties.map(p => ({ value: p.id, label: `${p.street_1}${p.street_2 ? `, Unit ${p.street_2}` : ``}` }));
  };

  const handlePropertyChange = (_property) => {
    setNewPostProperty(_property.value);
  };

  const showPostDetailModal = (post) => {
    setPostDetail(post);
    setShowPostModal(true);
  };
  const hidePostDetailModal = () => setShowPostModal(false);

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
                  <div className="d-flex mb-2">
                    <input
                      className="w-100 me-2"
                      placeholder="Title"
                      {...register(`title`, { required: true })}
                      defaultValue="Looking for roommates"
                    />
                    <span className="mt-2">for</span>
                    <AsyncSelect
                      className="w-100 ms-2"
                      cacheOptions
                      noOptionsMessage={() => `Search for property...`}
                      loadOptions={debounce(propertySearch, 100, { leading: true })}
                      defaultValue={
                        property ? {
                          // eslint-disable-next-line max-len
                          label: `${property.street_1}${property.street_2 ? `, Unit ${property.street_2}` : ``}`, value: property.id,
                        } : null
                      }
                      onChange={handlePropertyChange}
                    />
                  </div>
                  <textarea
                    className="w-100"
                    placeholder="Create post"
                    {...register(`message`)}
                  />
                </form>
                <div className="d-flex align-items-center">
                  <Button
                    className="btn-primary align-self-center"
                    form="newPost"
                    type="submit"
                    variant="danger"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          {
            posts.map(post => <>
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
                              {post.property.street_1}, Unit {post.property.street_2}
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
                    {
                      currentUser?.id === post.author.id &&
                        <Dropdown className="ms-auto">
                          <Dropdown.Toggle as={CustomToggle} />
                          <Dropdown.Menu>
                            <Dropdown.Item>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => deletePost(post.id)}>Delete</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                    }
                  </div>
                </Card.Body>
                {
                  <Card.Footer className="d-flex bg-white justify-content-center">
                    <button
                      className="btn btn-stealth"
                      onClick={() => showPostDetailModal(post)}
                    ><TfiCommentAlt /> {post.comments.length > 0 ? post.comments.length === 1 ?
                        `${post.comments.length} Reply` : `${post.comments.length} Replies` :
                        `No Replies`}</button>
                  </Card.Footer>
                }
              </Card>
            </>)
          }
        </div>
      </div>
      {showPostModal && <PostDetailModal post={postDetail} show={showPostModal} onHide={hidePostDetailModal} /> }
    </div>;
};