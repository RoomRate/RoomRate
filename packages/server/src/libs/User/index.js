const knex = require(`../Database`);
const bcrypt = require(`bcrypt`);
const { UnauthorizedError, InvalidCredentialsError, BadRequestError } = require(`restify-errors`);

const testUser = {
  id: 1,
  username: `cheese`,
  password: `$2a$10$qCAOuXFxJoSoV5x0GDNPeexumwyLgCn06RAsiA4QaDl0vlrVU/.FS`,
};

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

  // const user = await knex(`users`)
  //   .whereRaw(`LOWER(username) = ?`, [ username.toLowerCase() ])
  //   .first();

  const user = testUser;

  return user;
};

exports.getUserById = async ({ id }) => {
  if (!id) {
    throw new BadRequestError(`No username provided`);
  }

  const user = testUser;

  if (!user) {
    throw new UnauthorizedError(`Invalid username or password`);
  }

  return user;
};
