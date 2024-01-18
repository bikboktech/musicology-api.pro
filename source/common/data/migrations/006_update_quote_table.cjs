exports.up = async (knex) => {
  const quotesTableExists = await knex.schema.hasTable("quotes");
  if (quotesTableExists) {
    await knex.schema.alterTable("quotes", (table) => {
      table.varchar("extra_musician", 512).after("marketing_type");
      table.boolean("audio_support").defaultTo(0).after("marketing_type");
      table
        .varchar("natural_approach_interactions", 512)
        .after("marketing_type");
      table.varchar("reference_playlist_link", 512).after("marketing_type");
      table.dropColumn("account_full_name");
      table.dropColumn("account_email");
      table.integer("account_id").after("id").unsigned();
      table.foreign("account_id").references("id").inTable("accounts");
    });
  }
};

exports.down = async (knex) => {
  const quotesTableExists = await knex.schema.hasTable("quotes");
  if (quotesTableExists) {
    await knex.schema.alterTable("quotes", (table) => {
      table.dropForeign("account_id", "quotes_account_id_fk");
      table.dropColumn("extra_musician");
      table.dropColumn("audio_support");
      table.dropColumn("natural_approach_interactions");
      table.dropColumn("reference_playlist_link");
      table.dropColumn("account_id");
      table.varchar("account_full_name", 512);
      table.varchar("account_email", 256);
    });
  }
};
