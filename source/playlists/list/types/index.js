import knex from "../../../common/data/database.js";

const EVENT_TYPES_TABLE = "event_types";

const getEventTypes = async (request, response) => {
  const eventTypes = await knex(EVENT_TYPES_TABLE);
  response
    .status(200)
    .json(
      eventTypes.map((eventType) => ({
        id: eventType.id,
        name: eventType.name,
      }))
    );
};

export default getEventTypes;
