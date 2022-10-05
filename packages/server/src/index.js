const express = require(`express`);
const config = require(`config`);
const helmet = require(`helmet`);
const morgan = require(`morgan`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);
const compression = require(`compression`);
const session = require(`express-session`);
const MongoStore = require(`connect-mongo`);
const duration = require(`parse-duration`);
const { v4 } = require(`uuid`);
// const passport = require(`passport`);

const RouteLoader = require(`./utils/RouteLoader`);
// const ErrorHandler = require(`./utils/ErrorHandler`);

const app = express();
const port = config.get(`server.port`);

app.use((req, res, next) => {
  req.reqId = v4();
  next();
});

app.use(session({
  name: `sessionId`,
  secret: config.get(`session.secret`),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  unset: `destroy`,
  store: MongoStore.create({
    mongoUrl: config.get(`mongodb.url`),
    ttl: duration(config.get(`mongodb.ttl`), `sec`),
    autoRemove: `native` 
  })
}));

if (app.get(`env`) === `production`) {
  app.set(`trust proxy`, 1);
  sess.cookie.secure = true;
}
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