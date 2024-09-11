// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

export default {
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    dateStrings: true,
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
