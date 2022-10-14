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
const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const bcrypt = require(`bcrypt`);

const UserService = require(`./libs/User`);
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

passport.use(new LocalStrategy(async (username, password, cb) => {
  const user = await UserService.getUserByUsername({ username });

  if (!user) {
    return cb(null, false);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (isValidPassword) {
    return cb(null, user);
  } 

  return cb(null, false);
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = UserService.getUserById({ id });

  if (err) { 
    return cb(err); 
  }

  cb(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

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