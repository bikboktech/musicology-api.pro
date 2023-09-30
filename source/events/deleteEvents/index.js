import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const EVENTS_TABLE = "events";

const deleteEvents = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(EVENTS_TABLE).whereIn("id", validatedRequestBody.ids).del();
  }

  response.status(204).end();
};

export default deleteEvents;
