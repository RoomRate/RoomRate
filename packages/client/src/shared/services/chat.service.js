import { Axios } from "shared/utils";

const user_id = 1; // we change this once we get the auth provider setup

export class ChatService {
    static async getChatsForUser() {
      try {
        const response = await Axios({
          method: `GET`,
          url: `/chat/list`,
          data: {
            user_id,
          }
        });

        return response.data.data.properties;
      }
      catch (err) {
        throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
      }
    }
  };