const express = require(`express`);
const router = express.Router();
const RoommateService = require(`../../libs/Roommate`);
const { ResponseHandler } = require(`../../utils/ResponseHandler`);

router.get(`/post`, async (req, res, next) => {
  try {
    const posts = await RoommateService.getPosts();

    ResponseHandler(
      res,
      `Got posts`,
      { posts },
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post(`/post/new`, async (req, res, next) => {
  try {
    await RoommateService.createPost(req.body.post);

    ResponseHandler(
      res,
      `Created post`,
      {},
    );
  } catch (err) {
    next(err);
  }
});

router.delete(`/post/:id`, async (req, res, next) => {
  try {
    await RoommateService.deletePost(req.params.id);

    ResponseHandler(
      res,
      `Deleted post`,
      {},
    );
  } catch (err) {
    next(err);
  }
});

router.put(`/post/:id`, async (req, res, next) => {
  try {
    await RoommateService.updatePost(req.params.id, req.body.post);

    ResponseHandler(
      res,
      `Updated post`,
      {},
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
