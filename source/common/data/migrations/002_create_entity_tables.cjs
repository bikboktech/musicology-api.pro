exports.up = async (knex) => {
  // musicology.permission_sets definition
  const permissionSetsTableExists = await knex.schema.hasTable(
    "permission_sets"
  );
  if (!permissionSetsTableExists) {
    await knex.schema.createTable("permission_sets", (table) => {
      table.increments("id").primary();
      table.integer("permission_id").unsigned();
      table.integer("account_type_id").unsigned();
      table.boolean("permission_grant");
      table.foreign("permission_id").references("id").inTable("permissions");
      table
        .foreign("account_type_id")
        .references("id")
        .inTable("account_types");
    });
  }

  // musicology.accounts definition
  const accountsTableExists = await knex.schema.hasTable("accounts");
  if (!accountsTableExists) {
    await knex.schema.createTable("accounts", (table) => {
      table.increments("id").primary();
      table.integer("account_type_id").unsigned();
      table.varchar("full_name", 512);
      table.varchar("email", 256);
      table.varchar("password", 2048);
      table.boolean("active");
      table.integer("updated_by").unsigned();
      table.dateTime("updated_at", 6);
      table.dateTime("created_at", 6).notNullable().defaultTo(knex.fn.now(6));
      table
        .foreign("account_type_id")
        .references("id")
        .inTable("account_types");
    });

    await knex.schema.alterTable("accounts", (table) => {
      table.foreign("updated_by").references("id").inTable("accounts");
    });
  }

  // musicology.events definition
  const eventsTableExists = await knex.schema.hasTable("events");
  if (!eventsTableExists) {
    await knex.schema.createTable("events", (table) => {
      table.increments("id").primary();
      table.varchar("event_name", 128);
      table.integer("client_id").unsigned();
      table.integer("artist_id").unsigned();
      table.integer("event_type_id").unsigned();
      table.date("date");
      table.integer("guest_count");
      table.varchar("location", 128);
      table.varchar("venue_name", 128);
      table.varchar("venue_contact", 256);
      table.integer("duration");
      table.varchar("additional_artists", 512);
      table.varchar("additional_info", 512);
      table.integer("updated_by").unsigned();
      table.dateTime("updated_at", 6);
      table.dateTime("created_at", 6).notNullable().defaultTo(knex.fn.now(6));
      table.foreign("client_id").references("id").inTable("accounts");
      table.foreign("artist_id").references("id").inTable("accounts");
      table.foreign("event_type_id").references("id").inTable("event_types");
      table.foreign("updated_by").references("id").inTable("accounts");
    });
  }

  // musicology.posts definition
  const postsTableExists = await knex.schema.hasTable("posts");
  if (!postsTableExists) {
    await knex.schema.createTable("posts", (table) => {
      table.increments("id").primary();
      table.integer("account_author_id").unsigned();
      table.integer("in_reply_to_post_id").unsigned();
      table.varchar("title", 256);
      table.text(`text`);
      table.dateTime("updated_at", 6);
      table.dateTime("created_at", 6).notNullable().defaultTo(knex.fn.now(6));
      table.foreign("account_author_id").references("id").inTable("accounts");
    });

    await knex.schema.alterTable("posts", (table) => {
      table.foreign("in_reply_to_post_id").references("id").inTable("posts");
    });
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTable("permission_sets");
  await knex.schema.dropTable("accounts");
  await knex.schema.dropTable("events");
  await knex.schema.dropTable("posts");
};
