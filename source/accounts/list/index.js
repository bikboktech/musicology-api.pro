import knex from "../../common/data/database.js";
import validateRequestQuery from "./validateRequestQuery.js";

const ACCOUNTS_TABLE = "accounts";

const getAccountList = async (request, response, next) => {
  const validatedRequestQuery = await validateRequestQuery(request, response);
  if (validateRequestQuery) {
    const accounts = await knex(ACCOUNTS_TABLE)
      .select("accounts.*", "account_types.name as accountTypeName")
      .whereIn(
        `${ACCOUNTS_TABLE}.account_type_id`,
        validatedRequestQuery.accountTypeId
      )
      .whereIn(`${ACCOUNTS_TABLE}.active`, validatedRequestQuery.active)
      .join(
        "account_types",
        `${ACCOUNTS_TABLE}.account_type_id`,
        "=",
        "account_types.id"
      );

    const accountsCount = await knex(ACCOUNTS_TABLE)
      .whereIn(
        `${ACCOUNTS_TABLE}.account_type_id`,
        validatedRequestQuery.accountTypeId
      )
      .whereIn(`${ACCOUNTS_TABLE}.active`, validatedRequestQuery.active)
      .count("accounts.id as count");

    response.status(200).json({
      data: accounts.map((account) => ({
        id: account.id,
        accountTypeName: account.accountTypeName,
        fullName: account.full_name,
        email: account.email,
        phone: account.phone,
        active: account.active,
      })),
      count: accountsCount[0].count,
    });
  }
};

export default getAccountList;
