const knex = require(`../Database`);
const { BadRequestError } = require(`restify-errors`);

exports.getChatsForUser = async ({ user_id }) => {
  if (!user_id) {
    throw new BadRequestError(`No user id provided`);
  }

  user_id = parseInt(user_id);
  const chats = [];

  const { rows: chatInfo } = await knex.raw(`
    SELECT 
      chats.id AS chat_id,
      chats.title AS chat_title,
      chat_messages.message AS last_message,
      chat_messages.created_by AS last_message_user_id
    FROM chats
    JOIN chat_users ON chats.id = chat_users.chat_id
    JOIN chat_messages ON chats.id = chat_messages.chat_id
    WHERE chat_users.user_id = ?
    AND chat_messages.id = (
      SELECT id
      FROM chat_messages
      WHERE chat_id = chats.id
      ORDER BY created_at DESC
      LIMIT 1
    );
  `, [ user_id ]);

  for (const chat of chatInfo) {
    const { rows: chatUsers } = await knex.raw(`
      SELECT 
        users.id,
        users.first_name,
        users.last_name
      FROM users
      JOIN chat_users on users.id = chat_users.user_id
      WHERE chat_users.chat_id = ?;
    `, [ chat.chat_id ]);

    const lastMessageUser = chatUsers.find(user => user.id === chat.last_message_user_id);

    chats.push({
      chat_id: chat.chat_id,
      chat_title: chat.chat_title,
      users: chatUsers.filter(user => user.id !== user_id),
      last_message: {
        user: lastMessageUser,
        message: chat.last_message,
      },
      user_id, // the user making the request
    });
  }

  return chats;
};
