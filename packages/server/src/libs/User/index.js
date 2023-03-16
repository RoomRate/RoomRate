const knex = require(`../Database`);
const { BadRequestError } = require(`restify-errors`);
const { s3download, s3Upload } = require(`../../utils/S3`);
const { v4: uuidv4 } = require(`uuid`);

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
      SELECT id, first_name, last_name, email, username, bio, seeking, image_key
      FROM users
      WHERE uid = ?
      LIMIT 1;
    `, [ uid ]);

  return user.rows[0];
};

exports.uploadImages = async ({ images, user }) => {
  await Promise.all(images.map(async image => {
    image.key = uuidv4();
    await s3Upload({ file: image.buffer, imageKey: image.key, mimetype: image.mimetype });
    await knex(`users`)
      .where({ id: user.id })
      .update({
        image_key: image.key,
      });
  }));
};

exports.getUserImage = async ({ uid }) => {
  const userImageKey = await knex.raw(`
    SELECT image_key
    FROM users
    WHERE uid = ?
  `, [ uid ]);

  const imageKey = userImageKey.rows[0].image_key;

  const userImage = await s3download(imageKey);

  return userImage;
};

exports.updateUser = async ({ data }) => {
  const { uid, first_name, last_name, seeking, bio } = data;
  const userId = await knex(`users`)
    .where({ id: uid })
    .update({
      first_name,
      last_name,
      seeking: seeking.value,
      bio,
    }).returning(`id`);

  return userId;
};
