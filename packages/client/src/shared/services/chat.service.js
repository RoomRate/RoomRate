import { Axios } from "../utils/http.config.js";
import { auth } from "../utils/firebase";

export class ChatService {
  static async getChatsForUser({ user_id }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `GET`,
        url: `/chat/list?user_id=${user_id}`,
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to fetch chat list`);
    }
  }

  static async getMessagesForChat({ chat_id, user_id }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `GET`,
        url: `/chat/${chat_id}/messages?user_id=${user_id}`,
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to fetch chat messages`);
    }
  }

  static async sendMessage({ message, user_id, chat_id }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `POST`,
        url: `/chat/${chat_id}/message`,
        data: {
          user_id,
          message,
        },
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data.message;
    }
    catch (err) {
      throw new Error(`Failed to send message`);
    }
  }

  static async getChatUsers({ chat_id, user_id }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();
      // console.log(`getChatUsers`, chat_id, user_id);

      const response = await Axios({
        method: `GET`,
        url: `/chat/${chat_id}/users?user_id=${user_id}`,
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to get users in chat`);
    }
  }

  static async createNewChat({ created_by, recipient_id, title }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `POST`,
        url: `/chat/new`,
        data: {
          created_by,
          recipient_id,
          title,
        },
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to create new chat`);
    }
  }

  static async addUserToChat({ chat_id, user_id }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      await Axios({
        method: `POST`,
        url: `/chat/${chat_id}/user/${user_id}/add`,
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return;
    }
    catch (err) {
      throw new Error(`Failed to remove user from chat`);
    }
  }

  static async removeUserFromChat({ chat_id, user_id }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      await Axios({
        method: `DELETE`,
        url: `/chat/${chat_id}/user/${user_id}/remove`,
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return;
    }
    catch (err) {
      throw new Error(`Failed to remove user from chat`);
    }
  }

  static async editMessage({ chat_id, message_id, user_id, edited_message }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `PUT`,
        url: `/chat/${chat_id}/message/${message_id}/edit`,
        data: {
          edited_message,
          user_id,
        },
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    }
    catch (err) {
      throw new Error(`Failed to edit message`);
    }
  }

  static async getChatInfo({ chat_id, user_id }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `GET`,
        url: `/chat/${chat_id}/info?user_id=${user_id}`,
        data: {
          user_id,
        },
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (err) {
      throw new Error(`Failed to get chat info`);
    }
  }

  static async changeTitle({ chat_id, title }) {
    try {
      const user = auth.currentUser;
      const token = user && await user.getIdToken();

      const response = await Axios({
        method: `PUT`,
        url: `/chat/${chat_id}/title`,
        data: {
          title,
        },
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (err) {
      throw new Error(`Failed to rename chat`);
    }
  }
}
