const knex = require(`../Database`);
const { s3download } = require(`../../utils/S3`);

exports.getPosts = async ({ filter=  {}}) => {
  let posts = await knex(`roommate_posts`)
  .join(`users`, `users.id`, `roommate_posts.user_id`)
  .select(`users.first_name`, `users.last_name`, `users.image_key`, `roommate_posts.*`)
  .where((qb) => {
    if(filter.author) {
      qb.whereRaw(`CONCAT(users.first_name, ' ', users.last_name) like ?`, [`%${filter.author}%`]);
    }
    if(filter.property) {
      qb.where({ property_id: filter.property });
    }
    if(filter.search) {
      qb.where(`message`, `like`, `%${filter.search}%`);
    }
    if(filter.minDate) {
      qb.where(`posted_on`, `>=`, filter.minDate);
    }
    if(filter.maxDate) {
      qb.where(`posted_on`, `<=`, filter.maxDate);
    }
  })
    .orderBy(`posted_on`, `desc`);

  return await Promise.all(posts.map(async (post) => {
    // post.author = await knex(`users`).select(`id`, `first_name`, `last_name`).where({ id: post.user_id }).first()
    post.author = {
      id: post.id,
      user_id: post.user_id,
      first_name: post.first_name,
      last_name: post.last_name,
      userImage: await s3download(post.image_key),
    };
    post.property = await knex(`properties`).select(`id`, `street_1`, `street_2`).where({ id: post.property_id }).first()
    post.comments = await knex(`post_comments`).where({ post_id: post.id }).orderBy(`posted_on`, `desc`).then(async (comments) => 
    Promise.all(comments.map(async comment => {
      comment.author = await knex(`users`).select(`id`, `first_name`, `last_name`, `image_key`).where({ id: comment.user_id }).first()
      comment.author.userImage = await s3download(comment.author.image_key)
      return comment
    })))

    return post;
  }));
};

exports.createPost = async (post) => {
  await knex(`roommate_posts`).insert(
    {
      property_id: post?.property,
      title: post.title,
      message: post.message,
      user_id: post.author,
      posted_on: new Date(),
    },
  );
};

exports.deletePost = async (id) => {
  await knex(`roommate_posts`).where({ id }).del();
};

exports.updatePost = async (post) => {
  await knex(`roommate_posts`).where({ id: post.id }).update({ message: post.message });
};

exports.postComment = async (comment) => {
  await knex(`post_comments`).insert(
    {
      post_id: comment.post,
      message: comment.reply,
      user_id: comment.author,
      posted_on: new Date(),
    },
  );
};

exports.getComments = async (id) => {
  return await knex(`post_comments`).where({ post_id: id }).orderBy(`posted_on`, `desc`).then(async (comments) => 
  Promise.all(comments.map(async comment => {
    comment.author = await knex(`users`).select(`id`, `first_name`, `last_name`).where({ id: comment.user_id }).first()

    return comment
  })))
};

exports.deletePostComments = async (id) => {
  await knex(`post_comments`).where({ post_id: id }).del();
};

exports.deleteComment = async (id) => {
  await knex(`post_comments`).where({ id }).del();
};
