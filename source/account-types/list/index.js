
import knex from "../../common/data/database.js";

const ACCOUNT_TYPES_TABLE = "account_types";

const getAccountTypeList = async (request, response, next) => {
  const accountTypes = await knex(ACCOUNT_TYPES_TABLE);

  const accountTypesCount = await knex(ACCOUNT_TYPES_TABLE).count("id as count");

  response.status(200).json({
    data: accountTypes.map((accountType) => ({
      id: accountType.id,
      name: accountType.name
    })),
    count: accountTypesCount[0].count
  });
};

export default getAccountTypeList;
