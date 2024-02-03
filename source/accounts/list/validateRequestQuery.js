import { object, array, bool } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const ACCOUNT_TYPES_TABLE = "account_types";
const ACCOUNTS_TABLE = "accounts";

const SchemaListAccountsQuery = object({
  accountTypeId: array().nullable(),
  accountType: array().nullable(),
  active: array().of(bool()).required(),
});

const validateRequestQuery = async (request, response) => {
  let qs = {};

  // Filter /accounts by client provided accountTypeId
  if (Object.keys(request.query).includes("accountTypeId")) {
    qs.accountTypeId = [request.query.accountTypeId];
  }
  // Filter /accounts by all accountTypeIds
  else {
    const accountTypeIds = await knex(ACCOUNT_TYPES_TABLE).select("id");
    qs.accountTypeId = accountTypeIds.map((accountTypeId) => accountTypeId.id);
  }

  // Filter /accounts by client provided accountTypeName
  if (Object.keys(request.query).includes("accountType")) {
    const accountTypeId = await knex(ACCOUNT_TYPES_TABLE)
      .select("id")
      .where("name", request.query.accountType)
      .first();
    if (!accountTypeId)
      // resolve missing account type
      return new Exception(
        404,
        `The selected account type "${request.query.accountType}" doesn't exist`
      ).handle(request, response);
    qs.accountTypeId = [accountTypeId.id];
  }

  // Filter /accounts by client provided active
  if (Object.keys(request.query).includes("active"))
    qs.active = [request.query.active];
  // Filter /accounts by all active (both true and false)
  else {
    qs.active = [true, false];
  }

  const accountType = await knex(ACCOUNT_TYPES_TABLE).whereIn(
    "id",
    qs.accountTypeId
  );

  if (accountType.length == 0) {
    return new Exception(
      404,
      `The selected account type "${accountType}" doesn't exist`
    ).handle(request, response);
  }

  try {
    return await SchemaListAccountsQuery.validate(qs);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestQuery;
