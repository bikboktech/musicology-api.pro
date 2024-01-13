exports.up = async (knex) => {
  // musicology.quotes definition
  const quotesTableExists = await knex.schema.hasTable("quotes");
  if (!quotesTableExists) {
    await knex.schema.createTable("quotes", (table) => {
      table.increments("id").primary();
      table.integer("event_type_id").unsigned();
      table.varchar("account_full_name", 512);
      table.varchar("account_email", 256);
      table.date("event_date");
      table.varchar("event_budget", 512);
      table.varchar("event_duration", 12);
      table.varchar("event_location", 512);
      table.integer("event_guest_count");
      table.boolean("is_active").notNullable().defaultTo(false);
      table.varchar("marketing_type", 1024);
      table.integer("updated_by").unsigned();
      table.dateTime("updated_at", 6);
      table.dateTime("created_at", 6).notNullable().defaultTo(knex.fn.now(6));
      table.foreign("event_type_id").references("id").inTable("event_types");
      table.foreign("updated_by").references("id").inTable("accounts");
    });
  }

  // musicology.event_accounts definition
  const eventAccountsTableExists = await knex.schema.hasTable("event_accounts");
  if (!eventAccountsTableExists) {
    await knex.schema.createTable("event_accounts", (table) => {
      table.increments("id").primary();
      table.integer("event_id").unsigned();
      table.integer("account_dj_id").unsigned();
      table.boolean("package_booked").notNullable().defaultTo(false);
      table.foreign("event_id").references("id").inTable("events");
      table.foreign("account_dj_id").references("id").inTable("accounts");
    });
  }

  // musicology.timelines definition
  const timelinesTableExists = await knex.schema.hasTable("timelines");
  if (!timelinesTableExists) {
    await knex.schema.createTable("timelines", (table) => {
      table.increments("id").primary();
      table.integer("event_id").unsigned();
      table.varchar("name", 256);
      table.time("time");
      table.varchar("spotify_track_id", 256);
      table.varchar("description", 2048);
      table.varchar("notes", 2048);
      table.foreign("event_id").references("id").inTable("events");
    });
  }

  // musicology.playlists definition
  const playlistsTableExists = await knex.schema.hasTable("playlists");
  if (!playlistsTableExists) {
    await knex.schema.createTable("playlists", (table) => {
      table.increments("id").primary();
      table.integer("event_id").unsigned();
      table.varchar("spotify_playlist_id", 256);
      table.varchar("name", 128);
      table.varchar("notes", 2048);
      table.foreign("event_id").references("id").inTable("events");
    });
  }

  // musicology.event_posts definition
  const eventPostsTableExists = await knex.schema.hasTable("event_posts");
  if (!eventPostsTableExists) {
    await knex.schema.createTable("event_posts", (table) => {
      table.increments("id").primary();
      table.integer("event_id").unsigned();
      table.integer("post_id").unsigned();
      table.foreign("event_id").references("id").inTable("events");
      table.foreign("post_id").references("id").inTable("posts");
    });
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTable("quotes");
  await knex.schema.dropTable("event_accounts");
  await knex.schema.dropTable("timelines");
  await knex.schema.dropTable("playlists");
  await knex.schema.dropTable("event_posts");
};
