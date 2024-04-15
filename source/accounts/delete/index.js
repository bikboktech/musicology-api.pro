import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const ACCOUNTS_TABLE = "accounts";
const RESET_TOKENS_TABLE = "reset_tokens";
const EVENTS_TABLE = "events";
const QUOTES_TABLE = "quotes";
const TIMELINES_TABLE = "timelines";
const PLAYLISTS_TABLE = "playlists";

const deleteAccounts = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(QUOTES_TABLE)
      .whereIn("account_id", validatedRequestBody.ids)
      .del();

    await knex(RESET_TOKENS_TABLE)
      .whereIn("account_id", validatedRequestBody.ids)
      .del();

    const event = await knex(EVENTS_TABLE)
      .whereIn("client_id", validatedRequestBody.ids)
      .orWhereIn("artist_id", validatedRequestBody.ids)
      .first();

    await knex(TIMELINES_TABLE).where("event_id", event.id).del();

    await knex(PLAYLISTS_TABLE).where("event_id", event.id).del();

    await knex(EVENTS_TABLE)
      .whereIn("client_id", validatedRequestBody.ids)
      .orWhereIn("artist_id", validatedRequestBody.ids)
      .del();

    await knex(ACCOUNTS_TABLE).whereIn("id", validatedRequestBody.ids).del();
  }

  response.status(204).end();
};

export default deleteAccounts;
