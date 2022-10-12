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

function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, `sha512`).toString(`hex`);
  return hash === hashVerify;
}

passport.use(new LocalStrategy(
  function(username, password, cb) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) { return cb(null, false); }
              
        // Function defined at bottom of app.js
        const isValid = validPassword(password, user.hash, user.salt);
              
        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {   
        cb(err);
      });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
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