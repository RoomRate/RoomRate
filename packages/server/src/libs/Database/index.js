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
  const database = config.get(`database`);
  const {
    dialect,
    host,
    maxConnections,
    minConnections,
    name,
    password,
    port,
    username,
  } = database;

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
