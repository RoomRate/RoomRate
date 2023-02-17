import { Axios } from "shared/utils";

export class PropertyService {
  static async getPropertyList({ all }) {
    try {
      const response = await Axios({
        method: `GET`,
        params: { all },
        url: `/property/list`,
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

  static async createReview({ review }) {
    try {
      await Axios({
        method: `POST`,
        url: `/property/review/new`,
        params: { review },
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
    try {
      console.log(data);
      const response = await Axios({
        method: `POST`,
        url: `/property/new`,
        data,
      });

      return response.data.data.id;
    }
    catch (err) {
      throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
    }
  }
}
