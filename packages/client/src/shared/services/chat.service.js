import { Axios } from "shared/utils";

export class ChatService {
  static async getChatsForUser() {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/chat/list?user_id=${13}`, // TODO Eventually we need to grab this from the auth strategy
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to fetch chat list`);
    }
  }

  static async getMessagesForChat({ chat_id }) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/chat/${chat_id}/messages`,
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to fetch chat messages`);
    }
  }

  static async sendMessage({ message, user_id, chat_id }) {
    try {
      const response = await Axios({
        method: `POST`,
        url: `/chat/${chat_id}/message`,
        data: {
          user_id,
          message,
        },
      });

      return response.data.data.message;
    }
    catch (err) {
      throw new Error(`Failed to send message`);
    }
  }

  static async getChatUsers({ chat_id }) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/chat/${chat_id}/users`,
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to get users in chat`);
    }
  }

  static async getChatById({ chat_id }) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/chat/${chat_id}`,
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to get chat info`);
    }
  }
}
