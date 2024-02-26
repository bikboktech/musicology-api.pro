exports.up = async (knex) => {
  await knex.schema.createTable("reset_tokens", (table) => {
    table.integer("account_id").unsigned().notNullable();
    table.varchar("hash", 512).notNullable();
    table.integer("expiry_time").defaultTo(86400); // 24 hours
    table.dateTime("created_at", 6).notNullable().defaultTo(knex.fn.now(6));
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('reset_tokens');
};
