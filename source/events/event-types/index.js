import knex from "../../common/data/database.js";

const EVENT_TYPES_TABLE = "event_types";

const getEventTypes = async (request, response, next) => {
  try {
    const eventTypes = await knex(EVENT_TYPES_TABLE).catch((err) =>
      console.log("Error happened: ", err)
    );
    response.status(200).json(
      eventTypes.map((eventType) => ({
        id: eventType.id,
        name: eventType.name,
      }))
    );
  } catch (err) {
    next(err);
  }
};

export default getEventTypes;
