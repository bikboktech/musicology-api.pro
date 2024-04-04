import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const ACCOUNTS_TABLE = "accounts";
const RESET_TOKENS_TABLE = "reset_tokens";
const EVENTS_TABLE = "events";
const QUOTES_TABLE = "quotes";

const deleteAccounts = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(QUOTES_TABLE)
      .whereIn("account_id", validatedRequestBody.ids)
      .del();

    await knex(RESET_TOKENS_TABLE)
      .whereIn("account_id", validatedRequestBody.ids)
      .del();

    await knex(EVENTS_TABLE)
      .whereIn("client_id", validatedRequestBody.ids)
      .orWhereIn("artist_id", validatedRequestBody.ids)
      .del();

    await knex(ACCOUNTS_TABLE).whereIn("id", validatedRequestBody.ids).del();
  }

  response.status(204).end();
};

export default deleteAccounts;
