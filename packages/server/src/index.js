const express = require(`express`);
const config = require(`config`);
const helmet = require(`helmet`);
const morgan = require(`morgan`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);
const compression = require(`compression`);
// const Redis = require(`redis`);
// const passport = require(`passport`);
// const session = require(`express-session`);
// const RedisStore = require(`connect-redis`)(session);
// const duration = require(`parse-duration`);
const { v4 } = require(`uuid`);

const RouteLoader = require(`./utils/RouteLoader`);
// const ErrorHandler = require(`./utils/ErrorHandler`);

const app = express();
const port = config.get(`server.port`);

// const client = Redis.createClient({
//   legacyMode: true,
//   host: config.get(`redis.host`),
//   port: config.get(`redis.port`), 
//   tls: config.has(`redis.tls`) ? config.get(`redis.tls`) : undefined,
//   ttl: duration(config.get(`redis.ttl`), `sec`),
// });
// const store = new RedisStore({ client });
// client.connect();

// const sessionOptions = {
//   name: `sessionId`,
//   secret: config.get(`session.secret`),
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true },
//   store,
//   unset: `destroy`,
// };

// if (app.get(`env`) === `production`) {
//   app.set(`trust proxy`, 1);
//   sess.cookie.secure = true;
// }

// store.on(`error`, (err) => {
//   // eslint-disable-next-line no-console
//   console.trace(err);
//   // eslint-disable-next-line no-console
//   console.error(err.stack); 
// });

app.use((req, res, next) => {
  req.reqId = v4();
  next();
});

// app.use(session(sessionOptions));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, `../logs/access.log`), { flags: `a` });
app.use(morgan(`combined`, { stream: accessLogStream }));

RouteLoader({ app });
// app.use(ErrorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${ port }`);
});