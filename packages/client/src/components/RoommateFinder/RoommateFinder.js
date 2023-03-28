import React, { useCallback, useState, useEffect } from "react";
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
import { ProfileModal } from '../Users/ProfileModal';
import { DebounceInput } from 'react-debounce-input';

export const RoommateFinder = ({ property, propertyFilter }) => {
  const [ isLoading, setLoading ] = useState(true);
  const [ isPostLoading, setPostLoading ] = useState(false);
  const [ posts, setPosts ] = useState([]);
  const [ newPostProperty, setNewPostProperty ] = useState(property ? property.id : null);
  const { register, handleSubmit, reset } = useForm();
  const [ showPostModal, setShowPostModal ] = useState(false);
  const [ postDetail, setPostDetail ] = useState(null);
  const { currentUser } = useAuth();

  const [ showModal, setShowModal ] = useState([]);

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

  const [ filter, setFilter ] = useState({});
  document.title = `RoomRate - Roommate Finder`;

  const fetchData = useCallback(async () => {
    try {
      setPostLoading(true);
      setPosts(await RoommateService.getPosts(filter));
    }
    catch (err) {
      throw new Error(err);
    }
    finally {
      setPostLoading(false);
      setLoading(false);
    }
  }, [ filter ]);

  useEffect(() => {
    fetchData();
  }, [ fetchData ]);

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

  const filterChange = (e) => {
    const _filter = filter;
    _filter[e.target.name] = e.target.value.trim();
    setFilter(_filter);
    fetchData();
  };

  const selectFilterChange = ({ value }, { name }) => {
    const _filter = filter;
    _filter[name] = value;
    setFilter(_filter);
    fetchData();
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
                      label: `${property.street_1}${property.street_2 ? `, Unit ${property.street_2}` : ``}`, value: property.id,
                    } : null
                  }
                  onChange={selectFilterChange}
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
            isPostLoading ?
              <div className="d-flex justify-content-center" style={{ height: `75vh` }}>
                <div style={{ maxHeight: `300px`, maxWidth: `300px` }}>
                  <Lottie animationData={loadingIcon} loop={true} />
                </div>
              </div> :
              posts.map((post, index) => <>
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
      {showPostModal && <PostDetailModal post={postDetail} show={showPostModal} onHide={hidePostDetailModal} />}
    </div>;
};