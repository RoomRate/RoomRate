const config = require(`config`);
const _knex = require(`knex`);

let knex;
if (process.env.NODE_ENV === `test`) {
  knex = _knex({
    client: `pg`,
    connection: `:memory:`,
    pool: {
      min: 1,
      max: 1,
    },
    useNullAsDefault: true,
    debug: false,
  });

  knex.processFlag = `test`;
} else {
  const dialect = config.get(`database.dialect`) || process.env.DATABASE_DIALECT;
  const host = config.get(`database.host`) || process.env.DATABASE_HOST;
  const maxConnections = config.get(`database.maxConnections`) || process.env.DATABASE_MAX_CONNECTIONS;
  const minConnections = config.get(`database.minConnections`) || process.env.MIN_CONNECTIONS;
  const name = config.get(`database.name`) || process.env.DATABASE_NAME;
  const password = config.get(`database.PASSWORD`) || process.env.DATABASE_PASSWORD;
  const port = config.get(`database.port`) || process.env.DATABASE_PORT;
  const username = config.get(`database.username`) || process.env.DATABASE_USERNAME;

  knex = _knex({
    client: dialect,
    connection: {
      host,
      port,
      user: username,
      password,
      database: name,
      charset: `utf8`,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: minConnections || 2,
      max: maxConnections || 10,
    },
    debug: false,
  });
}

module.exports = knex;
