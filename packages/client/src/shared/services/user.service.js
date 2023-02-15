import { Axios } from "../utils/http.config.ts";

export class UserService {
  static async login({ email, password, remember }) {
    try {
      await Axios({
        method: `POST`,
        url: `/user/login`,
        data: {
          email,
          password,
          remember,
        },
      });

      return;
    }
    catch (err) {
      throw new Error(`Failed to login`);
    }
  }
}