import { Axios } from "shared/utils";

export class PropertyService {
    static async getPropertyList({ all }) {
      try {
        const response = await Axios({
          method: `GET`,
          params: { all },
          url: `/property/list`
        });

        return response.data.data.properties;
      }
      catch (err) {
        throw new Error(`${err.response.statusText} - ${err.response.data.message}`);
      }
    }
  };