import knex from 'knex';
import database from './knexfile.js';

export default knex(database);