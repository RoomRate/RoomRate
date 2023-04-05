import React, { useState } from 'react';
import { Button, Card, CloseButton, Dropdown, Modal } from "react-bootstrap";
import { RoommateService } from "../../shared/services";
import { Image } from 'react-extras';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import DEFAULT_PFP from '../../assets/images/DefaultPFP.png';
import '../../scss/roommate_finder.scss';
import { CustomToggle } from "../../shared/A-UI";
import { useForm } from "react-hook-form";
import { useAuth } from '../../shared/contexts/AuthContext';
import { ProfileModal } from '../Users/ProfileModal';

export const PostDetailModal = ({ post, show, onHide }) => {
  const { register, handleSubmit, reset } = useForm();
  const [ comments, setComments ] = useState(post.comments);
  const { currentUser } = useAuth();
  const [ showModal, setShowModal ] = useState(false);

  function handleOpenModal() {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
              <p className="my-0"><Link onClick={handleOpenModal}>
                {post.author.first_name} {post.author.last_name}
              </Link>
                &nbsp; posted <ReactTimeAgo date={post.posted_on} /></p>
              {showModal &&
                <ProfileModal id={post.author.user_id} onClose={handleCloseModal}>
                  <h1>Modal Content</h1>
                </ProfileModal>}
            </Card.Text>
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="d-flex pb-2 mb-2 border-bottom" >
          <div className="mt-2">
            <Image
              url={DEFAULT_PFP}
              fallbackUrl={DEFAULT_PFP}
              className="avatar rounded img-fluid"
              alt="user profile avatar"
              width={50} />
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
            comments.map(c => <div className="d-flex">
              <div className="mr-4">
                <Image
                  url={DEFAULT_PFP}
                  fallbackUrl={DEFAULT_PFP}
                  className="avatar rounded img-fluid me-2"
                  alt="user profile avatar"
                  width={40} />
              </div>
              <div className="w-auto mb-2 mx-2 reply">
                <p className="my-0 fw-bold">
                  <Link>
                    {c.author.first_name} {c.author.last_name}
                  </Link>
                  &nbsp;posted <ReactTimeAgo date={c.posted_on} />
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