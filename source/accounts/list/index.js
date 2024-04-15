import knex from "../../common/data/database.js";
import validateRequestQuery from "./validateRequestQuery.js";

const ACCOUNTS_TABLE = "accounts";

const getAccountList = async (request, response, next) => {
  const validatedRequestQuery = await validateRequestQuery(request, response);
  if (validateRequestQuery) {
    const query = knex(ACCOUNTS_TABLE)
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

    if (request.query.search) {
      query.where((builder) =>
        builder
          .orWhere("accounts.full_name", "like", `%${request.query.search}%`)
          .orWhere("accounts.email", "like", `%${request.query.search}%`)
          .orWhere("accounts.phone", "like", `%${request.query.search}%`)
      );
    }

    if (request.query.sortField && request.query.sortDirection) {
      query.orderBy(request.query.sortField, request.query.sortDirection);
    }

    const countQuery = query.clone().count("accounts.id as count");
    const accountsCount = await countQuery;

    if (request.query.limit) {
      query.limit(request.query.limit);
    } else {
      query.limit(5);
    }

    if (request.query.offset) {
      query.offset(request.query.offset);
    }

    const accounts = await query;

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
