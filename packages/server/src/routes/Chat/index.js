const express = require(`express`);
const router = express.Router();
const { ResponseHandler } = require(`../../utils/ResponseHandler`);
const ChatService = require(`../../libs/Chat`);
const { VerifyToken } = require(`../../utils/Middleware/VerifyToken`);

router.get(`/list`, VerifyToken, async (req, res, next) => {
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

router.get(`/:user_id/and/:recipient_id`, VerifyToken, async (req, res, next) => {
  try {
    const { user_id, recipient_id } = req.params;

    const chat = await ChatService.getChatByUsers({ user_id, recipient_id });

    return ResponseHandler(
      res,
      `Successfully fetched chat`,
      chat,
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:chat_id/messages`, VerifyToken, async (req, res, next) => {
  try {
    const { chat_id } = req.params;
    const { user_id } = req.query;

    if (!await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`You have been removed from this chat`);
    }

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

router.get(`/:chat_id/users`, VerifyToken, async (req, res, next) => {
  try {
    const { chat_id } = req.params;
    const { user_id } = req.query;

    if (!await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`You have been removed from this chat`);
    }

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

router.post(`/:chat_id/message`, VerifyToken, async (req, res, next) => {
  try {
    const { message, user_id } = req.body;
    const { chat_id } = req.params;

    if (!await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`You have been removed from this chat`);
    }

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

router.put(`/:chat_id/message/:message_id/edit`, VerifyToken, async (req, res, next) => {
  try {
    const { edited_message, user_id } = req.body;
    const { chat_id, message_id } = req.params;

    if (!await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`You have been removed from this chat`);
    }

    if (user_id === await ChatService.getMessageCreatorById({ message_id })) {
      throw new Error(`You are not the owner of this message`);
    }

    const message = await ChatService.editMessage({ message_id, edited_message });

    return ResponseHandler(
      res,
      `Successfully edited message`,
      { message },
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:chat_id`, VerifyToken, async (req, res, next) => {
  try {
    const { chat_id } = req.params;
    const { user_id } = req.query;

    if (!await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`You have been removed from this chat`);
    }

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

router.post(`/new`, VerifyToken, async (req, res, next) => {
  try {

    const { created_by, recipient_id, title } = req.body;

    const chat = await ChatService.createNewChat({ created_by, title });

    await Promise.all([
      ChatService.addUserToChat({ chat_id: chat.id, user_id: created_by }),
      ChatService.addUserToChat({ chat_id: chat.id, user_id: recipient_id }),
    ]);

    return ResponseHandler(
      res,
      `Successfully created new chat`,
      chat,
    );
  } catch (err) {
    next(err);
  }
});

router.post(`/:chat_id/user/:user_id/add`, VerifyToken, async (req, res, next) => {
  try {
    const { chat_id, user_id } = req.params;

    if (await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`This user is already in this chat`);
      console.log(`all good`);
    }

    await ChatService.addUserToChat({ chat_id, user_id });

    return ResponseHandler(
      res,
      `Successfully added user to chat`,
      {},
    );
  } catch (err) {
    next(err);
  }
});

router.delete(`/:chat_id/user/:user_id/remove`, VerifyToken, async (req, res, next) => {
  try {
    const { chat_id, user_id } = req.params;

    if (!await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`This user has already been removed form this chat`);
    }

    await ChatService.removeUserFromChat({ chat_id, user_id });

    return ResponseHandler(
      res,
      `Successfully removed user from chat`,
      {},
    );
  } catch (err) {
    next(err);
  }
});

router.get(`/:chat_id/info`, VerifyToken, async (req, res, next) => {
  try {
    const { chat_id } = req.params;
    const { user_id } = req.query;

    if (!await ChatService.isUserInChat({ chat_id, user_id })) {
      throw new Error(`You have been removed from this chat`);
    }

    const chat = await ChatService.getChatInfo({ chat_id });
    const users = await ChatService.getChatUsers({ chat_id });
    const messages = await ChatService.getMessagesForChat({ chat_id });

    const chatInfo = {
      chat,
      users,
      messages,
    };

    return ResponseHandler(
      res,
      `Successfully got chat info`,
      chatInfo,
    );
  } catch (err) {
    next(err);
  }

});
router.put(`/:chat_id/title`, VerifyToken, async (req, res, next) => {
  try {
    const { chat_id } = req.params;
    const { title } = req.body;

    await ChatService.renameChat({ chat_id, title });

    return ResponseHandler(
      res,
      `Successfully renamed chat`,
      title,
    );
  } catch (err) {
    console.error(`Error updating chat title: ${ err.message }`);
    next(err);
  }
});

module.exports = router;
