import { Axios } from "shared/utils";

export class UserService {
  static async login({ username, password }) {
    try {
      const response = await Axios({
        method: `POST`,
        data: {
          username,
          password,
        },
        url: `/user/login`, // TODO Eventually we need to grab this from the auth strategy
      });

      return response.data.data;
    }
    catch (err) {
      console.log(err);
      throw new Error(`Failed to login`);
    }
  }
}