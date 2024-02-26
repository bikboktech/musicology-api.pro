exports.up = async (knex) => {
  await knex.schema.alterTable("reset_tokens", (table) => {
    table.foreign("account_id").references("id").inTable("accounts");
    table.varchar("token", 512).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable("reset_tokens", (table) => {
    table.dropForeign("account_id");
    table.dropColumn("token");
  });
};
