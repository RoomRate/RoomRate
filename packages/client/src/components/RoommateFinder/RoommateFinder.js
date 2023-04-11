import React, { useCallback, useState, useEffect } from "react";
import { Button, Card, Dropdown } from "react-bootstrap";
import Lottie from 'lottie-react';
import { RoommateService } from "../../shared/services";
import { useForm } from "react-hook-form";
import { TfiCommentAlt } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import AsyncSelect from 'react-select/async';
import ReactTimeAgo from 'react-time-ago';
import loadingIcon from '../../assets/images/loadingIcon.json';
import '../../scss/roommate_finder.scss';
import { CustomToggle } from "../../shared/A-UI";
import { PostDetailModal } from "./PostDetailModal";
import { useAuth } from '../../shared/contexts/AuthContext';
import { ProfileModal } from '../Users/ProfileModal';
import { DebounceInput } from 'react-debounce-input';
import { useLocation } from 'react-router-dom';
import defaultPFP from '../../assets/images/blank-profile-picture.webp';
import { UserService } from '../../shared/services';

export const RoommateFinder = () => {
  const location = useLocation();
  const property = location.state?.property || null;
  const propertyFilter = location.state?.propertyFilter || null;
  const [ isLoading, setLoading ] = useState(true);
  const [ isPostLoading, setPostLoading ] = useState(false);
  const [ posts, setPosts ] = useState([]);
  const [ newPostProperty, setNewPostProperty ] = useState(property ? property.id : null);
  const { register, handleSubmit, reset } = useForm();
  const [ showPostModal, setShowPostModal ] = useState(false);
  const [ postDetail, setPostDetail ] = useState(null);
  const { currentUser } = useAuth();
  const [ showModal, setShowModal ] = useState([]);
  const [ filter, setFilter ] = useState(propertyFilter ? { property: propertyFilter.id } : {});
  const [ userImage, setUserImage ] = useState(null);
  document.title = `RoomRate - Roommate Finder`;

  useEffect(() => {
    setShowModal(posts.map(_ => false));
  }, [ posts ]);

  const handleOpenModal = (index) => {
    const newShowModal = [ ...showModal ];
    newShowModal[index] = true;
    setShowModal(newShowModal);
  };

  const handleCloseModal = (index) => {
    const newShowModal = [ ...showModal ];
    newShowModal[index] = false;
    setShowModal(newShowModal);
  };

  const fetchData = useCallback(async () => {
    try {
      setPostLoading(true);
      const fetchedPosts = await RoommateService.getPosts(filter);
      setPosts(fetchedPosts);
      if (currentUser) {
        const pfp = await UserService.getUserImage({ id: currentUser.id });
        setUserImage(pfp || null);
      }
    }
    catch (err) {
      throw new Error(err);
    }
    finally {
      setPostLoading(false);
      setLoading(false);
    }
  }, [ filter, currentUser ]);

  useEffect(() => {
    fetchData();
  }, [ fetchData ]);

  const createPost = async (post) => {
    post.property = newPostProperty;
    post.author = currentUser.id;
    await RoommateService.createPost(post);
    fetchData();
    reset();
  };

  const deletePost = async (id) => {
    await RoommateService.deletePost(id);
    fetchData();
  };

  const propertySearch = async (input) => {
    const properties = await RoommateService.searchProperties(input);

    return properties.map(p => ({ value: p.id, label: `${p.street_1}${p.street_2 ? `, Unit ${p.street_2}` : ``}` }));
  };

  const handlePropertyChange = (_property) => {
    if (_property) {
      setNewPostProperty(_property.value);
    } else {
      setNewPostProperty(null);
    }
  };

  const showPostDetailModal = (post) => {
    setPostDetail(post);
    setShowPostModal(true);
  };
  const hidePostDetailModal = () => setShowPostModal(false);

  const filterChange = (e) => {
    const _filter = filter;
    _filter[e.target.name] = e.target.value.trim();
    setFilter(_filter);
    fetchData();
  };

  const selectFilterChange = (v, { name }) => {
    if (v) {
      const _filter = filter;
      _filter[name] = v.value;
      setFilter(_filter);
      fetchData();
    }
    else {
      const _filter = filter;
      delete _filter[name];
      setFilter(_filter);
      fetchData();
    }
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
              <div className="col-md-3">
                <label htmlFor="Author" className="me-auto">Author:</label>
              </div>
              <div className="col-md-8 offset-md-1">
                <DebounceInput
                  className="w-100"
                  debounceTimeout={300}
                  id="author"
                  name="author"
                  onChange={filterChange} />
              </div>
            </div>
            <div className="d-flex mb-2">
              <div className="col-md-3">
                <label htmlFor="Property Type" className="me-auto">Property:</label>
              </div>
              <div className="col-md-8 offset-md-1">
                <AsyncSelect
                  className="w-100"
                  name="property"
                  cacheOptions
                  noOptionsMessage={() => `Search for property...`}
                  loadOptions={debounce(propertySearch, 100, { leading: true })}
                  defaultValue={
                    propertyFilter ? {
                      // eslint-disable-next-line max-len
                      label: `${propertyFilter.street_1}${propertyFilter.street_2 ? `, Unit ${propertyFilter.street_2}` : ``}`, value: propertyFilter.id,
                    } : null
                  }
                  onChange={selectFilterChange}
                  isClearable
                />
              </div>
            </div>
            <div className="d-flex mb-2">
              <div className="col-md-3">
                <label htmlFor="Search" className="me-auto">Message:</label>
              </div>
              <div className="col-md-8 offset-md-1">
                <DebounceInput
                  className="w-100"
                  debounceTimeout={300}
                  id="search"
                  name="search"
                  onChange={filterChange} />
              </div>
            </div>
            <div className="d-flex mb-2">
              <div className="col-md-3">
                <label htmlFor="Date" className="me-auto">Date:</label>
              </div>
              <div className="d-flex col-md-8 offset-md-1">
                <input type="date"
                  className="w-100"
                  name="minDate"
                  onChange={filterChange} />
                -
                <input type="date"
                  className="w-100"
                  name="maxDate"
                  onChange={filterChange} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <Card className="w-100 my-2 text-start">
            {
              currentUser ?
                <Card.Body>
                  <div className="d-flex mb-n1" >
                    <div className="mt-2">
                      <img
                        src={userImage ? `data:image/jpeg;base64, ${userImage}` :
                          defaultPFP}
                        className="rounded-circle"
                        style={{ width: `50px`, height: `50px`, border: `1px solid black` }}
                        alt="user_image"
                      />
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
                          isClearable
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
                </Card.Body> :
                <Card.Body>
                  <div className="d-flex justify-content-center" >
                    <div className="my-4">
                      <p>
                        <a className="fw-bold" href="/login">Log in</a>
                          &nbsp;or&nbsp;
                        <a className="fw-bold" href="/login/signup">Sign Up</a>
                          &nbsp;to create a post!
                      </p>
                    </div>
                  </div>
                </Card.Body>
            }
          </Card>
          {
            isPostLoading ?
              <div className="d-flex justify-content-center" style={{ height: `75vh` }}>
                <div style={{ maxHeight: `300px`, maxWidth: `300px` }}>
                  <Lottie animationData={loadingIcon} loop={true} />
                </div>
              </div> :
              posts.length ?
                posts.map((post, index) => <>
                  <Card className="w-100 my-2 text-start">
                    <Card.Body>
                      <div className="d-flex">
                        <div className="mr-4">
                          <img
                            src={post.author.userImage ? `data:image/jpeg;base64, ${post.author.userImage}` :
                              defaultPFP}
                            className="avatar rounded-circle img-fluid me-2"
                            style={{ width: `50px`, height: `50px`, border: `1px solid black` }}
                            alt="user_image"
                          />
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
                            <p className="my-0"><Link onClick={() => handleOpenModal(index)}>
                              {post.author.first_name} {post.author.last_name}
                            </Link>
                              &nbsp; posted <ReactTimeAgo date={post.posted_on} /></p>
                            {showModal[index] &&
                              <ProfileModal id={post.author.user_id} onClose={() => handleCloseModal(index)}>
                                <h1>Modal Content</h1>
                              </ProfileModal>}
                          </Card.Text>
                        </div>
                        {
                          currentUser?.id === post.author.user_id &&
                            <Dropdown className="ms-auto">
                              <Dropdown.Toggle as={CustomToggle} />
                              <Dropdown.Menu>
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
                </>) : `No posts found`
          }
        </div>
      </div>
      {showPostModal && <PostDetailModal post={postDetail} show={showPostModal} onHide={hidePostDetailModal} />}
    </div>;
};