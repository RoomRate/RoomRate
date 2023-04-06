import React, { useState, useEffect } from 'react';
import { Button, Card, CloseButton, Dropdown, Modal } from "react-bootstrap";
import { RoommateService } from "../../shared/services";
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import '../../scss/roommate_finder.scss';
import { CustomToggle } from "../../shared/A-UI";
import { useForm } from "react-hook-form";
import { useAuth } from '../../shared/contexts/AuthContext';
import { ProfileModal } from '../Users/ProfileModal';
import defaultPFP from '../../assets/images/blank-profile-picture.webp';
import { UserService } from '../../shared/services';

export const PostDetailModal = ({ post, show, onHide }) => {
  const { register, handleSubmit, reset } = useForm();
  const [ comments, setComments ] = useState(post.comments);
  const { currentUser } = useAuth();
  const [ showAuthorModal, setShowAuthorModal ] = useState(false);
  const [ userImage, setUserImage ] = useState(null);
  const [ showModal, setShowModal ] = useState([]);

  useEffect(() => {
    setShowModal(comments.map(_ => false));
  }, [ comments ]);

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

  function handleOpenAuthorModal() {
    setShowAuthorModal(true);
  }

  const handleCloseAuthorModal = () => {
    setShowAuthorModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pfp = await UserService.getUserImage({ id: currentUser.id });
        setUserImage(pfp || null);
      }

      catch (err) {
        throw new Error(err);
      }
    };
    fetchData();
  }, [ currentUser.id ]);

  const deleteComment = async (id) => {
    await RoommateService.deleteComment(id);
  };

  const addComment = async (comment) => {
    comment.author = currentUser.id;
    comment.post = post.id;
    await RoommateService.addComment(comment);
    reset();
    setComments(await RoommateService.getPostComments(post.id));
  };

  return <Modal show={show} onHide={onHide} size="xl">
    <Card className="w-100 text-start">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <Modal.Title className="w-100 ms-5 text-center">
            {post.author.first_name} {post.author.last_name}'s Post
          </Modal.Title>
          <CloseButton onClick={onHide} />
        </div>
      </Card.Header>
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
              <p className="my-0"><Link onClick={handleOpenAuthorModal}>
                {post.author.first_name} {post.author.last_name}
              </Link>
                &nbsp; posted <ReactTimeAgo date={post.posted_on} /></p>
              {showAuthorModal &&
                <ProfileModal id={post.author.user_id} onClose={handleCloseAuthorModal}>
                  <h1>Modal Content</h1>
                </ProfileModal>}
            </Card.Text>
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="d-flex pb-2 mb-2 border-bottom" >
          <div className="mt-2">
            <img
              src={userImage ? `data:image/jpeg;base64, ${userImage}` :
                defaultPFP}
              className="rounded-circle"
              style={{ width: `50px`, height: `50px`, border: `1px solid black` }}
              alt="user_image"
            />
          </div>
          <form id="newReply" onSubmit={handleSubmit(addComment)} className="w-100 mx-2">
            <textarea
              className="w-100"
              placeholder="Create post"
              {...register(`reply`, { required: true })}
            />
          </form>
          <div className="d-flex align-items-center">
            <Button
              className="btn-primary align-self-center"
              form="newReply"
              type="submit"
              variant="danger"
            >
              Reply
            </Button>
          </div>
        </div>
        <div className="d-flex reply-container" />
        {
          comments.length > 0 ?
            comments.map((c, index) => <div className="d-flex">
              <div className="mr-4">
                <img
                  src={c.author.userImage ? `data:image/jpeg;base64, ${c.author.userImage}` :
                    defaultPFP}
                  className="avatar rounded-circle img-fluid me-2"
                  style={{ width: `40px`, height: `40px`, border: `1px solid black` }}
                  alt="user_image"
                />
              </div>
              <div className="w-auto mb-2 mx-2 reply">
                <p className="my-0 fw-bold">
                  <Link onClick={() => handleOpenModal(index)}>
                    {c.author.first_name} {c.author.last_name}
                  </Link>
                  &nbsp;posted <ReactTimeAgo date={c.posted_on} />
                  {showModal[index] &&
                    <ProfileModal id={c.author.id} onClose={() => handleCloseModal(index)}>
                      <h1>Modal Content</h1>
                    </ProfileModal>}
                </p>
                <Card.Text>
                  <p>{c.message}</p>
                </Card.Text>
              </div>
              <Dropdown className="reply-option">
                <Dropdown.Toggle as={CustomToggle} />
                <Dropdown.Menu>
                  <Dropdown.Item>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => deleteComment(c.id)}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>) :
            <div className="d-flex justify-content-center">
              <h5>No replies yet</h5>
            </div>
        }
      </Card.Footer>
    </Card>
  </Modal>;
};