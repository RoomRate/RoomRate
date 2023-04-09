import { Axios } from "../utils/http.config.js";
import { auth } from "../utils/firebase";

export class PropertyService {
  static async getPropertyList(filter) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/property/list?`,
        params: { filter },
      });

      return response.data.data.properties;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async getPropertyDetails({ id }) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/property/${id}/detail`,
      });

      return response.data.data.property;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async getPropertyThumbnail({ property_id }) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/property/${property_id}/thumbnail`,
        headers: {
          'Content-Type': `application/json`,
        },
      });

      return response.data;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async getReviews({ id }) {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/property/${id}/reviews`,
      });

      return response.data.data.reviews;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async createReview({ review, user_id }) {
    const user = auth.currentUser;
    const token = user && await user.getIdToken();

    try {
      await Axios({
        method: `POST`,
        url: `/property/review/new`,
        params: { review, user_id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async getStates() {
    try {
      const response = await Axios({
        method: `GET`,
        url: `/property/states`,
      });

      return response.data.data.states;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async createProperty(data) {
    const user = auth.currentUser;
    const token = user && await user.getIdToken();
    try {
      const response = await Axios({
        method: `POST`,
        url: `/property/new`,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: `multipart/form-data`,
        },
      });

      return response.data.data.id;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }

  static async getPropertiesForUser({ user_id }) {
    const user = auth.currentUser;
    const token = user && await user.getIdToken();

    try {
      const response = await Axios({
        method: `GET`,
        url: `/property/user/${user_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: `multipart/form-data`,
        },
      });

      return response.data;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }
}
