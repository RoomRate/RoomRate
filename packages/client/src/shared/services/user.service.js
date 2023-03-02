import { Axios } from "../utils/http.config.js";
import { auth } from "../utils/firebase";

export class UserService {
  static async addUserFromFirebase({ uid, email, firstName, lastName }) {
    try {
      await Axios({
        method: `POST`,
        url: `/user/new`,
        data: {
          uid,
          email,
          firstName,
          lastName,
        },
      });

      return;
    }
    catch (err) {
      throw new Error(`Failed to add user to firebase`);
    }
  }

  static async getUserFromFirebaseUid({ uid }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `GET`,
        url: `/user/uid/${uid}`,
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    }
    catch (err) {
      throw new Error(`Failed to fetch user details using firebase uid`);
    }
  }

  static async updateUser(data) {
    console.log(`user service:`, data);
    const user = auth.currentUser;
    const token = user && await user.getIdToken();
    try {
      const response = await Axios({
        method: `PUT`,
        url: `/user/update/`,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: `multipart/form-data`,
        },
      });

      return response.data;
    }
    catch (err) {
      console.log(err);
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }
}
