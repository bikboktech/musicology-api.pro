import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const QUOTES_TABLE = "quotes";
const ACCOUNTS_TABLE = "accounts";

const deleteEvents = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(QUOTES_TABLE).whereIn("id", validatedRequestBody.ids).del();

    const unverifiedAccounts = await knex(QUOTES_TABLE)
      .select("account_id")
      .innerJoin("accounts", function () {
        this.on("quotes.account_id", "=", "accounts.id");
        this.on("accounts.active", "=", 1);
      })
      .whereIn("quotes.id", validatedRequestBody.ids);

    const unverifiedAccountIds = unverifiedAccounts.map(
      (unverifiedAccount) => unverifiedAccount.account_id
    );

    await knex(ACCOUNTS_TABLE).whereIn("id", unverifiedAccountIds).del();
  }

  response.status(204).end();
};

export default deleteEvents;
