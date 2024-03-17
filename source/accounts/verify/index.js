import knex from "../../common/data/database.js";
import notifyAccountCreated from "./utils.js";

const ACCOUNTS_TABLE = "accounts";

const verifyAccount = async (request, response, next) => {
  const accountId = request.params.accountId;
  await knex(ACCOUNTS_TABLE)
    .update({ active: 1 })
    .where("id", accountId);
  
  await notifyAccountCreated(request, response, accountId);
  
  response.status(204);
};

export default verifyAccount;
