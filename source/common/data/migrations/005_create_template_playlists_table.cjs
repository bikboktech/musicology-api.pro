exports.up = async knex => {
    // musicology.template_playlists definition
    const templatePlaylistsTableExists = await knex.schema.hasTable('template_playlists');
    if (!templatePlaylistsTableExists) {
      await knex.schema.createTable('template_playlists', table => {
        table.increments('id').primary();
        table.integer('event_type_id').unsigned();
        table.varchar('spotify_playlist_id', 256);
        table.varchar('name', 128);
        table.varchar('notes', 2048);
        table.integer("created_by").unsigned();
        table.integer("updated_by").unsigned();
        table.dateTime("updated_at", 6);
        table.dateTime("created_at", 6).notNullable().defaultTo(knex.fn.now(6));
        table.foreign('event_type_id').references('id').inTable('event_types');
        table.foreign("created_by").references("id").inTable("accounts");
        table.foreign("updated_by").references("id").inTable("accounts");
      })
    }
  }
  
  exports.down = async knex => {
    await knex.schema.dropTable('template_playlists');
  }
  
  