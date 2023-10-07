exports.up = async knex => {
  const accountTypesHasUpdatedAt = await knex.schema.hasColumn('account_types', 'updated_at');
  if (!accountTypesHasUpdatedAt) {
    await knex.schema.alterTable('account_types', table => {
      table.dateTime('updated_at', 6);
    })
  }
  const accountTypesHasUpdatedBy = await knex.schema.hasColumn('account_types', 'updated_by');
  if (!accountTypesHasUpdatedBy) {
    await knex.schema.alterTable('account_types', table => {
      table.integer('updated_by').unsigned();
      table.foreign('updated_by').references('id').inTable('accounts');
    })
  }
  const eventTypesHasCreatedBy = await knex.schema.hasColumn('event_types', 'created_by');
  if (!eventTypesHasCreatedBy) {
    await knex.schema.alterTable('event_types', table => {
      table.integer('created_by').unsigned();
      table.foreign('created_by').references('id').inTable('accounts');
    })
  }
  const eventTypesHasUpdatedAt = await knex.schema.hasColumn('event_types', 'updated_at');
  if (!eventTypesHasUpdatedAt) {
    await knex.schema.alterTable('event_types', table => {
      table.dateTime('updated_at', 6);
    })
  }
  const eventTypesHasUpdatedBy = await knex.schema.hasColumn('event_types', 'updated_by');
  if (!eventTypesHasUpdatedBy) {
    await knex.schema.alterTable('event_types', table => {
      table.integer('updated_by').unsigned();
      table.foreign('updated_by').references('id').inTable('accounts');
    })
  }
  const eventsHasCreatedBy = await knex.schema.hasColumn('events', 'created_by');
  if (!eventsHasCreatedBy) {
    await knex.schema.alterTable('events', table => {
      table.integer('created_by').unsigned();
      table.foreign('created_by').references('id').inTable('accounts');
    })
  }
  const eventAccountsHasCreatedAt = await knex.schema.hasColumn('event_accounts', 'created_at');
  if (!eventAccountsHasCreatedAt) {
    await knex.schema.alterTable('event_accounts', table => {
      table.dateTime('created_at', 6).notNullable().defaultTo(knex.fn.now(6));
    })
  }
  const eventAccountsHasCreatedBy = await knex.schema.hasColumn('event_accounts', 'created_by');
  if (!eventAccountsHasCreatedBy) {
    await knex.schema.alterTable('event_accounts', table => {
      table.integer('created_by').unsigned();
      table.foreign('created_by').references('id').inTable('accounts');
    })
  }
  const eventAccountsHasUpdatedAt = await knex.schema.hasColumn('event_accounts', 'updated_at');
  if (!eventAccountsHasUpdatedAt) {
    await knex.schema.alterTable('event_accounts', table => {
      table.dateTime('updated_at', 6);
    })
  }
  const eventAccountsHasUpdatedBy = await knex.schema.hasColumn('event_accounts', 'updated_by');
  if (!eventAccountsHasUpdatedBy) {
    await knex.schema.alterTable('event_accounts', table => {
      table.integer('updated_by').unsigned();
      table.foreign('updated_by').references('id').inTable('accounts');
    })
  }
  const timelinesHasCreatedAt = await knex.schema.hasColumn('timelines', 'created_at');
  if (!timelinesHasCreatedAt) {
    await knex.schema.alterTable('timelines', table => {
      table.dateTime('created_at', 6).notNullable().defaultTo(knex.fn.now(6));
    })
  }
  const timelinesHasCreatedBy = await knex.schema.hasColumn('timelines', 'created_by');
  if (!timelinesHasCreatedBy) {
    await knex.schema.alterTable('timelines', table => {
      table.integer('created_by').unsigned();
      table.foreign('created_by').references('id').inTable('accounts');
    })
  }
  const timelinesHasUpdatedAt = await knex.schema.hasColumn('timelines', 'updated_at');
  if (!timelinesHasUpdatedAt) {
    await knex.schema.alterTable('timelines', table => {
      table.dateTime('updated_at', 6);
    })
  }
  const timelinesHasUpdatedBy = await knex.schema.hasColumn('timelines', 'updated_by');
  if (!timelinesHasUpdatedBy) {
    await knex.schema.alterTable('timelines', table => {
      table.integer('updated_by').unsigned();
      table.foreign('updated_by').references('id').inTable('accounts');
    })
  }
  const playlistsHasCreatedAt = await knex.schema.hasColumn('playlists', 'created_at');
  if (!playlistsHasCreatedAt) {
    await knex.schema.alterTable('playlists', table => {
      table.dateTime('created_at', 6).notNullable().defaultTo(knex.fn.now(6));
    })
  }
  const playlistsHasCreatedBy = await knex.schema.hasColumn('playlists', 'created_by');
  if (!playlistsHasCreatedBy) {
    await knex.schema.alterTable('playlists', table => {
      table.integer('created_by').unsigned();
      table.foreign('created_by').references('id').inTable('accounts');
    })
  }
  const playlistsHasUpdatedAt = await knex.schema.hasColumn('playlists', 'updated_at');
  if (!playlistsHasUpdatedAt) {
    await knex.schema.alterTable('playlists', table => {
      table.dateTime('updated_at', 6);
    })
  }
  const playlistsHasUpdatedBy = await knex.schema.hasColumn('playlists', 'updated_by');
  if (!playlistsHasUpdatedBy) {
    await knex.schema.alterTable('playlists', table => {
      table.integer('updated_by').unsigned();
      table.foreign('updated_by').references('id').inTable('accounts');
    })
  }
  
}


exports.down = async knex => {
  await knex.schema.alterTable('account_types', table => {
    table.dropColumn('created_by')
  });
  await knex.schema.alterTable('account_types', table => {
    table.dropColumn('updated_at')
  });
  await knex.schema.alterTable('account_types', table => {
    table.dropColumn('updated_by')
  });
  await knex.schema.alterTable('event_types', table => {
    table.dropColumn('created_by')
  });
  await knex.schema.alterTable('event_types', table => {
    table.dropColumn('updated_at')
  });
  await knex.schema.alterTable('event_types', table => {
    table.dropColumn('updated_by')
  });
  await knex.schema.alterTable('events', table => {
    table.dropColumn('created_by')
  });
  await knex.schema.alterTable('event_accounts', table => {
    table.dropColumn('created_at')
  });
  await knex.schema.alterTable('event_accounts', table => {
    table.dropColumn('created_by')
  });
  await knex.schema.alterTable('event_accounts', table => {
    table.dropColumn('updated_at')
  });
  await knex.schema.alterTable('event_accounts', table => {
    table.dropColumn('updated_by')
  });
  await knex.schema.alterTable('timelines', table => {
    table.dropColumn('created_at')
  });
  await knex.schema.alterTable('timelines', table => {
    table.dropColumn('created_by')
  });
  await knex.schema.alterTable('timelines', table => {
    table.dropColumn('updated_at')
  });
  await knex.schema.alterTable('timelines', table => {
    table.dropColumn('updated_by')
  });
  await knex.schema.alterTable('playlists', table => {
    table.dropColumn('created_at')
  });
  await knex.schema.alterTable('playlists', table => {
    table.dropColumn('created_by')
  });
  await knex.schema.alterTable('playlists', table => {
    table.dropColumn('updated_at')
  });
  await knex.schema.alterTable('playlists', table => {
    table.dropColumn('updated_by')
  });
}

  