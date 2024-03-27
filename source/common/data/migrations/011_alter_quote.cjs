exports.up = async (knex) => {
  const quotesTableExists = await knex.schema.hasTable("quotes");
  if (quotesTableExists) {
    await knex.schema.alterTable("quotes", (table) => {
      table.varchar("hours_of_entertainment", 512).after("extra_musician");
    });
  }
};

exports.down = async (knex) => {
  const quotesTableExists = await knex.schema.hasTable("quotes");
  if (quotesTableExists) {
    await knex.schema.alterTable("quotes", (table) => {
      table.dropColumn("hours_of_entertainment");
    });
  }
};
