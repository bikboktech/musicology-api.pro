// Update with your config settings.
import * as dotenv from "dotenv";

dotenv.config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export default {
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "musicology",
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
