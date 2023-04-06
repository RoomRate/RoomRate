const express = require(`express`);
const config = require(`config`);
const helmet = require(`helmet-csp`);
const morgan = require(`morgan`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);
const compression = require(`compression`);
const session = require(`express-session`);
const MongoStore = require(`connect-mongo`);
const duration = require(`parse-duration`);
const { v4 } = require(`uuid`);
const cookieParser = require(`cookie-parser`);

const RouteLoader = require(`./utils/RouteLoader`);
const { ErrorHandler } = require(`./utils/ErrorHandler`);
const { setUpWebSocketServer } = require(`./utils/WebSocketServer`);

const app = express();
const port = process.env.PORT || config.get(`server.port`) || 3000;

if (process.env.PRODUCTION) {
  app.use(express.static(path.resolve(__dirname, `../../client/build`)));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());
// app.use(helmet({
//   directives: {
//     defaultSrc: [ `'self'`, `https://*.firebaseio.com` ],
//     // eslint-disable-next-line max-len
//     scriptSrc: [ `'self'`, `https://apis.google.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com` ],
//   },
// }));
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
  cookie: { secure: process.env.PRODUCTION || false },
  unset: `destroy`,
  store: MongoStore.create({
    mongoUrl: config.get(`mongodb.url`) || process.env.MONGODB_URL,
    ttl: duration(config.get(`mongodb.ttl`) || process.env.MONGODB_TTL, `sec`),
    autoRemove: `native`,
  }),
}));

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, `../logs/access.log`), { flags: `a` });
app.use(morgan(`combined`, { stream: accessLogStream }));

RouteLoader({ app });
app.use(ErrorHandler);

app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, `../../client/build/index.html`));
});

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${ port }`);
});

setUpWebSocketServer({ server });
