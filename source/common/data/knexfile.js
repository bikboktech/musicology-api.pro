// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export default {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    database: "musicology",
    user: "root",
    password: "password",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: "./migrations",
    loadExtensions: [".cjs"],
  },
  seeds: {
    directory: "./seeds",
  },
};
