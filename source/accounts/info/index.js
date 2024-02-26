import knex from "../../common/data/database.js";

const ACCOUNTS_TABLE = "accounts";

const getAccountInfo = async (request, response, next) => {
  const account = await knex(ACCOUNTS_TABLE)
    .select("accounts.*", "account_types.name as accountTypeName")
    .where(`${ACCOUNTS_TABLE}.id`, request.params.accountId)
    .join(
      "account_types",
      `${ACCOUNTS_TABLE}.account_type_id`,
      "=",
      "account_types.id"
    )
    .first();

  response.status(200).json({
    id: account.id,
    fullName: account.full_name,
    email: account.email,
    active: account.active,
    phone: account.phone,
    accountTypeName: account.accountTypeName,
  });
};

export default getAccountInfo;
