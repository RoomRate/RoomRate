const express = require(`express`);
const config = require(`config`);

const RouteLoader = require(`./src/utils/RouteLoader`);

const app = express();
const port = config.get(`port`);

RouteLoader({ app });

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${ port }`);
})