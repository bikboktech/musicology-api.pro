import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const TIMELINES_TABLE = "timelines";

const deleteTimelines = async (request, response, next) => {
  try {
    const validatedRequestBody = await validateRequestBody(request, response);

    if (validatedRequestBody) {
      await knex(TIMELINES_TABLE).whereIn("id", validatedRequestBody.ids).del();
    }

    response.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default deleteTimelines;
