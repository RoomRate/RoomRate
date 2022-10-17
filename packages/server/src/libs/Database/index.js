const { Pool } = require(`pg`);
const config = require(`config`);

const pool = new Pool({
  host: config.get(`database.host`),
  user: config.get(`database.user`),
  password: config.get(`database.password`),
  database: config.get(`database.name`),
  port: config.get(`database.port`),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on(`error`, (err) => {
  // eslint-disable-next-line no-console
  console.error(`Unexpected error on idle client`, err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
