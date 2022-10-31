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

router.get(`/:chat_id/messages`, async (req, res, next) => {
  try {
    const { chat_id } = req.params;

    const messages = await ChatService.getMessagesForChat({ chat_id });

    return ResponseHandler(
      res,
      `Successfully fetched chat messages`,
      messages,
    );
  } catch (err) {
    next(err);
  }
});

router.post(`/:chat_id/message`, async (req, res, next) => {
  try {
    const { message, user_id } = req.body;
    const { chat_id } = req.params;

    const sentMessage = await ChatService.sendMessage({ message, chat_id, user_id });

    return ResponseHandler(
      res,
      `Successfully sent message`,
      { message: sentMessage },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:chat_id/users`, async (req, res, next) => {
  try {
    const { chat_id } = req.params;

    const users = await ChatService.getChatUsers({ chat_id });

    return ResponseHandler(
      res,
      `Successfully sent message`,
      users,
    );
  } catch (err) {
    next(err);
  }
});

router.post(`/:chat_id/message`, async (req, res, next) => {
  try {
    const { message, user_id } = req.body;
    const { chat_id } = req.params;

    const sentMessage = await ChatService.sendMessage({ message, chat_id, user_id });

    return ResponseHandler(
      res,
      `Successfully sent message`,
      { message: sentMessage },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:chat_id`, async (req, res, next) => {
  try {
    const { chat_id } = req.params;

    const chat = await ChatService.getChatById({ chat_id });

    return ResponseHandler(
      res,
      `Successfully got chat info`,
      chat,
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
