import { Axios } from "../utils/http.config.js";

export class RoommateService {
  static async getPosts(filter) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/roommate/post`,
        params: { filter },
      });

      return response.data.data.posts;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async createPost(post) {
    try {
      await Axios({
        method: `POST`,
        url: `/roommate/post/new`,
        data: { post },
      });

      return;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async deletePost(id) {
    try {
      await Axios({
        method: `DELETE`,
        url: `/roommate/post/${id}`,
      });

      return;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async updatePost(id, post) {
    try {
      await Axios({
        method: `PUT`,
        url: `/roommate/post/${id}`,
        data: { post },
      });

      return;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async searchProperties(input) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/property/search?input=${input}`,
      });

      return response.data.data;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async getPostComments(id) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/roommate/post/comment/${id}`,
        params: { post_id: id },
      });

      return response.data.data.comments;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async addComment(comment) {
    try {
      await Axios({
        method: `POST`,
        url: `/roommate/post/comment/new`,
        data: { comment },
      });

      return;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async deleteComment(id) {
    try {
      await Axios({
        method: `DELETE`,
        url: `/roommate/post/comment/${id}`,
      });

      return;
    } catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }
}