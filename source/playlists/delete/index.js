import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const PLAYLISTS_TABLE = "playlists";

const deletePlaylists = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(PLAYLISTS_TABLE).whereIn("id", validatedRequestBody.ids).del();
  }

  response.status(204).end();
};

export default deletePlaylists;
