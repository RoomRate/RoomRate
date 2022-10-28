import { Axios } from "shared/utils";

export class ChatService {
    static async getChatsForUser() {
      try {
        const response = await Axios({
          method: `GET`,
          url: `/chat/list?user_id=${ 13 }`, //TODO Eventually we need to grab this from the auth strategy
        });

        return response.data.data;
      }
      catch (err) {
        throw new Error(`Failed to fetch chat list`);
      }
    }
  };