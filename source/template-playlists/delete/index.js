import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const deleteTemplatePlaylists = async (request, response, next) => {
  try {
    const validatedRequestBody = await validateRequestBody(request, response);

    if (validatedRequestBody) {
      await knex(TEMPLATE_PLAYLISTS_TABLE)
        .whereIn("id", validatedRequestBody.ids)
        .del();
    }

    response.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default deleteTemplatePlaylists;
