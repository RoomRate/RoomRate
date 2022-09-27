const axios = require(`axios`).default;
const config = require(`config`);

const URL = config.get(`server.url`);

it(`Ping the server`, async () => {
  await axios
    .get(`${ URL }/ping`)
    .then(response => {
      expect(response.status).toBe(200);
      expect(response.data).toBe(`pong`);
    });
});