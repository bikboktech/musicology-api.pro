exports.up = async knex => {

  // musicology.permission_sets definition
  const permissionSetsTableExists = await knex.schema.hasTable('permission_sets');
  if (!permissionSetsTableExists) {
    await knex.schema.createTable('permission_sets', table => {
      table.increments('id').primary();
      table.boolean('permission_grant');
      table.integer('permission_id').unsigned();
      table
        .foreign('permission_id')
        .references('id')
        .inTable('permissions');
      table.integer('account_type_id').unsigned();
      table
        .foreign('account_type_id')
        .references('id')
        .inTable('account_types');
    })
  }
  // musicology.accounts definition
  const accountsTableExists = await knex.schema.hasTable('accounts');
  if (!accountsTableExists) {
    await knex.schema.createTable('accounts', table => {
      table.increments('id').primary();
      table.varchar('full_name', 512);
      table.varchar('email', 256);
      table.varchar('password', 2048);
      table.boolean('active');
      table.dateTime('created_at', 6)
        .notNullable()
        .defaultTo(knex.fn.now(6));
      table.dateTime('updated_at', 6);
      table.integer('account_type_id').unsigned();
      table
        .foreign('account_type_id')
        .references('id')
        .inTable('account_types');
    })
  }

  // musicology.events definition
  const eventsTableExists = await knex.schema.hasTable('events');
  if (!eventsTableExists) {
    await knex.schema.createTable('events', table => {
      table.increments('id').primary();
      table.integer('account_type_id').unsigned();
      table
        .foreign('account_type_id')
        .references('id')
        .inTable('account_types');
      table.date('date');
      table.time('time');
      table.integer('guest_count');
      table.varchar('location', 128);
      table.varchar('venue_name', 128);
      table.varchar('venue_contact', 256);
      table.integer('duration');
      table.varchar('additional_artists', 512);
      table.dateTime('created_at', 6)
        .notNullable()
        .defaultTo(knex.fn.now(6));
      table.dateTime('updated_at', 6);
    })
  }
  
  // musicology.posts definition
  const postsTableExists = await knex.schema.hasTable('posts');
  if (!postsTableExists) {
    await knex.schema.createTable('posts', table => {
      table.increments('id').primary();
      table.varchar('title', 256);
      table.text(`text`);
      table
        .dateTime('created_at', 6)
        .notNullable()
        .defaultTo(knex.fn.now(6));
      table.dateTime('updated_at', 6);
    })
  }
}

exports.down = async knex => {
  await knex.schema.dropTable('permission_sets');
  await knex.schema.dropTable('accounts');
  await knex.schema.dropTable('events');
  await knex.schema.dropTable('posts');
}
