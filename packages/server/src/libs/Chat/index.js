const knex = require(`../Database`);
const { BadRequestError } = require(`restify-errors`);

exports.getChatsForUser = async ({ user_id }) => {
  // if (!user_id) {
  //   throw new BadRequestError(`No user id provided`);
  // }
  user_id = 1;

  try {
    const userChats = knex(`chats`)
      .select(`*`)
      .whereRaw(`? = ANY(user_ids)`, [ user_id ]);

    const chatMembers = knex(`users`)
      .select(`*`);

    console.log(userChats);
  } catch (err) {
    console.log(err);
  }
  /*
    Needed information:
      - Chat members names OR title of the chat
      - The most recent message sent in the chat (and who sent it)
      - Whether or not you have opened the most recent message
  */

  // const chats = await knex.raw(`
  //   SELECT
  //     chats.recipient
  //   FROM chats
  //   JOIN users ON chats.user_id = users.id
  //   JOIN chat_messages ON chats.id = chat_messages.chat_id
  //   WHERE ? IN chats.user_ids
  //   AND
  // `, [ user_id ]);
};
