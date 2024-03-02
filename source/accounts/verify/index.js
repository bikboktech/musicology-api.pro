import knex from "../../common/data/database.js";
import notifyAccountCreated from "./utils.js";

const ACCOUNTS_TABLE = "accounts";

const verifyAccount = async (request, response, next) => {
  const accountId = request.body.accountId;
  await knex(ACCOUNTS_TABLE)
    .update({ active: true })
    .where("id", accountId);
  
  await notifyAccountCreated(accountId);
  
  response.status(204);
};

export default verifyAccount;
