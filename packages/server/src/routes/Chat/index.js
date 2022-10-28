const express = require(`express`);
const router = express.Router();
const { ResponseHandler } = require(`../../utils/ResponseHandler`);
const ChatService = require(`../../libs/Chat`);

router.get(`/list`, async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const chats = await ChatService.getChatsForUser({ user_id });

    return ResponseHandler(
      res,
      `Successfully fetched chats for user`,
      chats,
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
