exports.up = async (knex) => {
  const eventsTableExists = await knex.schema.hasTable("events");
  if (eventsTableExists) {
    await knex.schema.alterTable("events", (table) => {
      table.varchar("contract_id", 256).after("additional_info");
      table.varchar("contract_url", 512).after("additional_info");
      table.boolean("contract_signed").defaultTo(0).after("additional_info");
    });
  }
};

exports.down = async (knex) => {
  const eventsTableExists = await knex.schema.hasTable("events");
  if (eventsTableExists) {
    await knex.schema.alterTable("events", (table) => {
      table.dropColumn("contract_id");
      table.dropColumn("contract_url");
      table.dropColumn("contract_signed");
    });
  }
};
