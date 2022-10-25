const knex = require(`../Database`);
const bcrypt = require(`bcrypt`);
const { InvalidCredentialsError, BadRequestError } = require(`restify-errors`);

exports.login = async ({ username, password }) => {
  if (!username) {
    throw new BadRequestError(`No username provided`);
  }

  if (!password) {
    throw new BadRequestError(`No password provided`);
  }

  const user = await this.getUserByUsername({ username });

  if (!user) {
    throw new InvalidCredentialsError(`Invalid username or password`);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (isValidPassword) {
    return user;
  }

  throw new InvalidCredentialsError(`Invalid username or password`);
};

exports.getUserByUsername = async ({ username }) => {
  if (!username) {
    throw new BadRequestError(`No username provided`);
  }

  const user = await knex.raw(`
    SELECT first_name, last_name, email, username
    FROM users
    WHERE username = ?
    LIMIT 1;
  `, [ username ]);

  return user.rows[0];
};

exports.getUserById = async ({ id }) => {
  if (!id) {
    throw new BadRequestError(`No username provided`);
  }

  const user = await knex.raw(`
    SELECT first_name, last_name, email, username
    FROM users
    WHERE id = ?
    LIMIT 1;
  `, [ id ]);

  return user.rows[0];
};
