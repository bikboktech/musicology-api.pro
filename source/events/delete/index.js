import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const EVENTS_TABLE = "events";
const PLAYLISTS_TABLE = "playlists";
const TIMELINES_TABLE = "timelines";

const deleteEvents = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(TIMELINES_TABLE)
      .whereIn("event_id", validatedRequestBody.ids)
      .del();

    await knex(PLAYLISTS_TABLE)
      .whereIn("event_id", validatedRequestBody.ids)
      .del();

    await knex(EVENTS_TABLE).whereIn("id", validatedRequestBody.ids).del();
  }

  response.status(204).end();
};

export default deleteEvents;
