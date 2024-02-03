exports.up = async (knex) => {
  const accountsTableExists = await knex.schema.hasTable("accounts");
  if (accountsTableExists) {
    await knex.schema.alterTable("accounts", (table) => {
      table.varchar("phone", 512).after("email");
    });
  }
};

exports.down = async (knex) => {
  const accountsTableExists = await knex.schema.hasTable("accounts");
  if (accountsTableExists) {
    await knex.schema.alterTable("accounts", (table) => {
      table.dropColumn("phone");
    });
  }
};
