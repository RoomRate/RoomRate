const express = require(`express`);
const config = require(`config`);
const helmet = require(`helmet`);
const morgan = require(`morgan`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);

const RouteLoader = require(`./utils/RouteLoader`);

const app = express();
const port = config.get(`server.port`);
const accessLogStream = fs.createWriteStream(path.join(__dirname, `../logs/access.log`), { flags: `a` });

app.use(cors());
app.use(helmet());
app.use(morgan(`combined`, { stream: accessLogStream }));

RouteLoader({ app });

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${ port }`);
});