/** Express route definitions providing events management related functions
 * @module module:events/eventTypes
 * @requires express
 * @requires module:common/data/database
*/

import knex from "../../common/data/database.js";

/**
 * Selects and returns all Event Types
 *
 * @param {*} request
 * @param {*} response
 */

const EVENT_TYPES_TABLE = 'event_types';

const getEventTypes = async (request, response) => {
  const eventTypes = await knex(EVENT_TYPES_TABLE);
  response.status(200).json(eventTypes);
};

export default getEventTypes;