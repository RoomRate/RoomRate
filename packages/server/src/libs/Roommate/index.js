const knex = require(`../Database`);

exports.getPosts = async () => {
  let posts = await knex(`roommate_posts`)
    .orderBy(`posted_on`, `desc`)
    .limit(10);

  return await Promise.all(posts.map(async (post) => {
    post.author = await knex(`users`).select(`id`, `first_name`, `last_name`).where({ id: post.user_id }).first()
    post.property = await knex(`properties`).select(`id`, `street_1`, `street_2`).where({ id: post.property_id }).first()
    post.comments = await knex(`post_comments`).where({ post_id: post.id }).orderBy(`posted_on`, `desc`).limit(3).then(async (comments) => 
      Promise.all(comments.map(async comment => {
        comment.author = await knex(`users`).select(`id`, `first_name`, `last_name`).where({ id: comment.user_id }).first()

        return comment
      })))
  
    return post;
  }));
};

exports.createPost = async (post) => {
  await knex(`roommate_posts`).insert(
    {
      property_id: post?.property_id,
      message: post.message,
      user_id: 13,
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
