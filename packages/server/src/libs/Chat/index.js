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
      last_message.message AS last_message,
      last_message.created_by AS last_message_user_id,
      last_message.created_at,
      STRING_AGG(users.first_name || ' ' || users.last_name, ', ') as users,
      COUNT(*) FILTER (WHERE chat_users.deleted_at IS NOT NULL) AS deleted_count,
      COUNT(*) AS total_count
    FROM chats
    JOIN chat_users ON chats.id = chat_users.chat_id
    JOIN users ON chat_users.user_id = users.id
    LEFT JOIN (
      SELECT message, created_by, chat_id, created_at
      FROM chat_messages cm
      WHERE cm.id = (
        SELECT MAX(id)
        FROM chat_messages
        WHERE chat_id = cm.chat_id
      )
    ) AS last_message ON chats.id = last_message.chat_id
    WHERE chat_users.user_id = ?
    GROUP BY chats.id, chats.title, last_message.message, last_message.created_by, last_message.created_at
    HAVING COUNT(*) FILTER (WHERE chat_users.deleted_at IS NOT NULL) < COUNT(*)
    ORDER BY last_message.created_at DESC;
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
      chat_title: chat.chat_title || chat.users,
      users: chatUsers.filter(user => user.id !== user_id),
      last_message: {
        user: lastMessageUser,
        message: chat.last_message,
        created_at: chat.created_at,
      },
      user_id, // the user making the request
    });
  }

  return chats;
};

exports.getChatByUsers = async ({ user_id, recipient_id }) => {
  const response = await knex.raw(`
  SELECT chat_id
  FROM chat_users
  WHERE user_id IN ( ?, ? )
  AND deleted_at IS null
  GROUP BY chat_id
  HAVING COUNT(DISTINCT user_id) = 2;
    `, [ user_id, recipient_id ]);

  if (response.rows.length === 0) {
    return null;
  }
  console.log(response);

  return response.rows[0].chat_id;
};

exports.getMessagesForChat = async ({ chat_id }) => {
  const { rows: messages } = await knex.raw(`
    SELECT 
      chat_messages.*,
      users.id,
      users.first_name,
      users.last_name,
      users.username,
      users.email
    FROM chat_messages
    JOIN users on chat_messages.created_by = users.id
    WHERE chat_messages.chat_id = ?
    ORDER BY chat_messages.created_at ASC;
  `, [ chat_id ]);

  return messages;
};

exports.sendMessage = async ({ message, chat_id, user_id }) => {
  const response = await knex.raw(`
    INSERT INTO chat_messages(chat_id, message, created_by)
    VALUES(?, ?, ?)
    RETURNING *;
  `, [ chat_id, message, user_id ]);

  const [ sentMessage ] = response.rows;

  const newMessage = {
    message: sentMessage.message,
    chat_id: sentMessage.chat_id,
    created_by: sentMessage.created_by,
    created_at: sentMessage.created_at,
  };

  return newMessage;
};

exports.getChatUsers = async ({ chat_id }) => {
  const { rows: users } = await knex.raw(`
    SELECT users.id, users.first_name, users.last_name
    FROM users
    JOIN chat_users ON users.id = chat_users.user_id
    WHERE chat_users.chat_id = ?;
  `, [ chat_id ]);

  return users;
};

exports.getChatById = async ({ chat_id }) => {
  const response = await knex.raw(`
    SELECT *
    FROM chats
    WHERE id = ?
  `, [ chat_id ]);

  return response.rows[0];
};

exports.createNewChat = async ({ created_by, title }) => {
  const response = await knex.raw(`
    INSERT INTO chats(created_by, title)
    VALUES(?, ?)
    RETURNING *;
  `, [ created_by, title ]);

  return response.rows[0];
};

exports.addUserToChat = async ({ chat_id, user_id }) => {
  await knex.raw(`
    INSERT INTO chat_users(chat_id, user_id)
    VALUES(?, ?);
  `, [ chat_id, user_id ]);
};

exports.isUserInChat = async ({ chat_id, user_id }) => {
  const response = await knex.raw(`
    SELECT *
    FROM chat_users
    WHERE chat_id = ?
    AND user_id = ?
    AND deleted_at IS NULL
    LIMIT 1;
  `, [ chat_id, user_id ]);

  return !!response.rows.length;
};

exports.removeUserFromChat = async ({ chat_id, user_id }) => {
  await knex.raw(`
    UPDATE chat_users
    SET deleted_at = NOW()
    WHERE chat_id = ?
    AND user_id = ?;
  `, [ chat_id, user_id ]);
};

exports.getMessageCreatorById = async ({ message_id }) => {
  const response = await knex.raw(`
    SELECT created_by
    FROM chat_messages
    WHERE id = ?
    LIMIT 1;
  `, [ message_id ]);

  return response.rows[0].created_by;
};

exports.editMessage = async ({ message_id, edited_message }) => {
  const response = await knex.raw(`
    UPDATE chat_messages
    SET message = ?,
    updated_at = NOW()
    WHERE message_id = ?
    RETURNING *;
  `, [ edited_message, message_id ]);

  return response.rows[0];
};

exports.getChatInfo = async ({ chat_id }) => {
  const response = await knex.raw(`
    SELECT 
      chats.id, 
      chats.title
    FROM chats
    WHERE chats.id = ?;
  `, [ chat_id ]);

  return response.rows[0];
};

exports.renameChat = async ({ chat_id, title }) => {
  await knex.raw(`
    UPDATE chats
    SET title = ?
    WHERE id = ?;
  `, [ title, chat_id ]);
};
