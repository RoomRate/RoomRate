const testUser = {
  id: 1,
  username: `cheese`,
  password: `$2a$10$qCAOuXFxJoSoV5x0GDNPeexumwyLgCn06RAsiA4QaDl0vlrVU/.FS`,
};

exports.login = async ({ username, password }) => {
  
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