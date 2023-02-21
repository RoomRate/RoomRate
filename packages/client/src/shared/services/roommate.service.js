import { Axios } from "../utils/http.config.js";

export class RoommateService {
  static async getPosts() {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/roommate/post`,
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
}