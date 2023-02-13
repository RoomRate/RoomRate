import { Axios } from "shared/utils";

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