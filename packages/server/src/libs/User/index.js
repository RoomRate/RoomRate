const knex = require(`../Database`);
const { BadRequestError } = require(`restify-errors`);

exports.getUserById = async ({ id }) => {
  if (!id) {
    throw new BadRequestError(`No id provided`);
  }

  const user = await knex.raw(`
    SELECT first_name, last_name, email, username
    FROM users
    WHERE id = ?
    LIMIT 1;
  `, [ id ]);

  return user.rows[0];
};

exports.addUserFromFirebase = async ({ uid, email, firstName, lastName }) => {
  const user = await knex.raw(`
    INSERT INTO users(uid, email, username, first_name, last_name)
    VALUES (?, ?, ?, ?, ?);
  `, [ uid, email, email, firstName, lastName ]);

  return user.rows[0];
};

exports.getUserFromFirebaseUid = async ({ uid }) => {
  const user = await knex.raw(`
      SELECT id, first_name, last_name, email, username, bio, seeking
      FROM users
      WHERE uid = ?
      LIMIT 1;
    `, [ uid ]);

  return user.rows[0];
};

exports.updateUser = async (data) => {
  const { uid, first_name, last_name } = data;
  await knex(`users`)
    .where({ id: uid })
    .update({
      first_name,
      last_name,
      seeking: data.seeking.value,
      bio: data.bio,
    });
};
