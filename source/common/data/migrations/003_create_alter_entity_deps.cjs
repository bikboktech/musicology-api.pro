exports.up = async knex => {
  // musicology.quotes definition
  const quotesTableExists = await knex.schema.hasTable('quotes');
  if (!quotesTableExists) {
    await knex.schema.createTable('quotes', table => {
      table.increments('id').primary();
      table.varchar('account_full_name', 512);
      table.varchar('account_email', 256);
      table.varchar('account_password', 2048);
      table.varchar('account_marketing_type', 256);
      table.integer('event_type_id').unsigned();
      table
        .foreign('event_type_id')
        .references('id')
        .inTable('event_types');
      table.date('event_date');
      table.varchar('event_location', 512);
      table.integer('event_guest_count');
      table.integer('event_duration');
      table.dateTime('created_at', 6)
        .notNullable()
        .defaultTo(knex.fn.now(6));
      table.dateTime('updated_at', 6);
      table.integer('updated_by').unsigned();
      table
        .foreign('updated_by')
        .references('id')
        .inTable('accounts');
    })
  }
  
  // musicology.event_accounts definition
  const eventAccountsTableExists = await knex.schema.hasTable('event_accounts');
  if (!eventAccountsTableExists) {
    await knex.schema.createTable('event_accounts', table => {
      table.increments('id').primary();
      table.boolean('package_booked');
      table.integer('account_dj_id').unsigned();
      table
        .foreign('account_dj_id')
        .references('id')
        .inTable('accounts');
      table.integer('event_id').unsigned();
      table
        .foreign('event_id')
        .references('id')
        .inTable('events');
    })
  }

  // musicology.timelines definition
  const timelinesTableExists = await knex.schema.hasTable('timelines');
  if (!timelinesTableExists) {
    await knex.schema.createTable('timelines', table => {
      table.increments('id').primary();
      table.time('time');
      table.varchar('description', 2048);
      table.varchar('notes', 2048);
      table.integer('event_id').unsigned();
      table
        .foreign('event_id')
        .references('id')
        .inTable('events');
    })
  }

  // musicology.playlists definition
  const playlistsTableExists = await knex.schema.hasTable('playlists');
  if (!playlistsTableExists) {
    await knex.schema.createTable('playlists', table => {
      table.increments('id').primary();
      table.varchar('name', 128);
      table.varchar('notes', 2048);
      table.varchar('spotify_playlist_id', 256);
      table.integer('event_id').unsigned();
      table
        .foreign('event_id')
        .references('id')
        .inTable('events');
    })
  }

  // musicology.event_posts definition
  const eventPostsTableExists = await knex.schema.hasTable('event_posts');
  if (!eventPostsTableExists) {
    await knex.schema.createTable('event_posts', table => {
      table.increments('id').primary();
      table.integer('event_id').unsigned();
      table
        .foreign('event_id')
        .references('id')
        .inTable('events');
      table.integer('post_id').unsigned();
      table
        .foreign('post_id')
        .references('id')
        .inTable('posts');
    })
  }

  const accountsUpdatedByExists = await knex.schema.hasColumn('accounts', 'id');
  if (!accountsUpdatedByExists) {
    knex.schema.alterTable('accounts', table => {
      table.integer('updated_by').unsigned();
      table
        .foreign('updated_by')
        .references('id')
        .inTable('accounts');
    })
  }
  const eventsUpdatedByExists = await knex.schema.hasColumn('events', 'id');
  if (!eventsUpdatedByExists) {
    knex.schema.alterTable('events', table => {
      table.integer('updated_by').unsigned();
      table
        .foreign('updated_by')
        .references('id')
        .inTable('accounts');
    })
  }
  const accountsIdExists = await knex.schema.hasColumn('accounts', 'id');
  if (!accountsIdExists) {
    knex.schema.alterTable('posts', table => {
      table.integer('account_author_id').unsigned();
      table
        .foreign('account_author_id')
        .references('id')
        .inTable('accounts');
    })
  }
  const postsIdExists = await knex.schema.hasColumn('posts', 'id');
  if (!postsIdExists) {
    knex.schema.alterTable('posts', table => {
      table.integer('in_reply_to_post_id').unsigned();
      table
        .foreign('in_reply_to_post_id')
        .references('id')
        .inTable('posts');
    })
  }
}

exports.down = async knex => {
  await knex.schema.dropTable('event_accounts');
  await knex.schema.dropTable('timelines');
  await knex.schema.dropTable('playlists');
  await knex.schema.dropTable('event_posts');
  await knex.schema.table('event_accounts').dropColumn('')
}

