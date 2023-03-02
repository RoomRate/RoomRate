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
      SELECT id, first_name, last_name, email, username
      FROM users
      WHERE uid = ?
      LIMIT 1;
    `, [ uid ]);

  return user.rows[0];
};

exports.updateUser = async ({ data }) => {
  console.log(`libs:`, data);
  await knex(`users`)
    .where({ id: data.uid })
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
    });
};

/*
exports.updateUser = async (data, uid) => {
  const updatedUser = await knex.update(`
    UPDATE users
    SET first_name = ?, last_name = ?
    WHERE id = ?;`, [ data.first_name, data.last_name, uid ]);

  return updatedUser.rows[0];
};
*/
