const knex = require(`../Database`);
const bcrypt = require(`bcrypt`);
const { InvalidCredentialsError, BadRequestError } = require(`restify-errors`);

exports.login = async ({ email, password }) => {
  if (!email) {
    throw new BadRequestError(`No username provided`);
  }

  if (!password) {
    throw new BadRequestError(`No password provided`);
  }

  const user = await this.getUserByEmail({ email });

  if (!user) {
    throw new InvalidCredentialsError(`Invalid username or password`);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (isValidPassword) {
    return user;
  }

  throw new InvalidCredentialsError(`Invalid email or password`);
};

exports.getUserByEmail = async ({ email }) => {
  if (!email) {
    throw new BadRequestError(`No email provided`);
  }

  const user = await knex.raw(`
    SELECT first_name, last_name, email, username, password
    FROM users
    WHERE email = ?
    LIMIT 1;
  `, [ email ]);

  return user.rows[0];
};

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
