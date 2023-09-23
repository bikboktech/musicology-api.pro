exports.up = async knex => {
 
  const permissionsTableExists = await knex.schema.hasTable('permissions');
  if (!permissionsTableExists) {
    await knex.schema.createTable('permissions', table => {
      table.increments('id').primary();
      table.varchar('codename', 128);
      table.varchar('name', 256);
    })
  }

  const accountTypesTableExists = await knex.schema.hasTable('account_types');
  if (!accountTypesTableExists) {
    await knex.schema.createTable('account_types', table => {
      table.increments('id').primary();
      table.varchar('name', 64);
      table.dateTime('created_at', 6)
        .notNullable()
        .defaultTo(knex.fn.now(6));
    })
  }

  const eventTypesTableExists = await knex.schema.hasTable('event_types');
  if (!eventTypesTableExists) {
    await knex.schema.createTable('event_types', table => {
      table.increments('id').primary();
      table.varchar('name', 64);
      table.dateTime('created_at', 6)
        .notNullable()
        .defaultTo(knex.fn.now(6));
    })
  }
}

exports.down = async knex => {
  await knex.schema.dropTable('permissions');
  await knex.schema.dropTable('account_types');
  await knex.schema.dropTable('event_types');
}
