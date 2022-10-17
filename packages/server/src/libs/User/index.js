const bcrypt = require(`bcrypt`);

const testUser = {
  id: 1,
  username: `cheese`,
  password: `$2a$10$qCAOuXFxJoSoV5x0GDNPeexumwyLgCn06RAsiA4QaDl0vlrVU/.FS`,
};

exports.login = async ({ username, password }) => {
  try {
    const user = await this.getUserByUsername({ username });

    if (!user) {
      throw new Error(`Could not find user`);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      return user;
    }

    throw new Error(`Invalid username or password`);
  } catch (err) {
    throw new Error(`An error occurred when attempting to login`);
  }
};

exports.getUserByUsername = async ({ username }) => {
  try {
    const user = testUser;

    if (!user) {
      throw new Error(`Could not find user`);
    }

    return user;
  } catch (err) {
    throw new Error(`Failed to fetch user by username`);
  }
};

exports.getUserById = async ({ id }) => {
  try {
    const user = testUser;

    if (!user) {
      throw new Error(`Could not find user`);
    }

    return user;
  } catch (err) {
    throw new Error(`Failed to fetch user by id`);
  }
};
