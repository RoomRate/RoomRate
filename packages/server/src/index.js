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
const cookieParser = require(`cookie-parser`);

const UserService = require(`./libs/User`);
const RouteLoader = require(`./utils/RouteLoader`);
const { ErrorHandler } = require(`./utils/ErrorHandler`);

const app = express();
const port = process.env.port || config.get(`server.port`) || 3000;

if (process.env.PRODUCTION) {
  app.use(express.static(path.resolve(__dirname, `../../client/build`)));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser(config.get(`session.secret`) || process.env.SESSION_SECRET));

app.use((req, res, next) => {
  req.reqId = v4();
  next();
});

app.use(session({
  name: `sessionId`,
  secret: config.get(`session.secret`) || process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true },
  unset: `destroy`,
  store: MongoStore.create({
    mongoUrl: config.get(`mongodb.url`) || process.env.MONGODB_URL,
    ttl: duration(config.get(`mongodb.ttl`) || process.env.MONGODB_TTL, `sec`),
    autoRemove: `native`,
  }),
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
  cb(null, user);
});

passport.deserializeUser(async (req, user, done) => {
  try {
    const _user = await UserService.getUserById({ id: user.id });

    done(null, _user);
  } catch (err) {
    return done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, `../logs/access.log`), { flags: `a` });
app.use(morgan(`combined`, { stream: accessLogStream }));

RouteLoader({ app });
app.use(ErrorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${ port }`);
});
