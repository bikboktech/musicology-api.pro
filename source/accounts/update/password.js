import bcrypt from "bcryptjs";
import knex from "../../common/data/database.js";
import validateUpdatePassword from "./validateRequestBody.js";

const ACCOUNTS_TABLE = "accounts";
const saltRounds = 12;

const updatePassword = async (request, response) => {
  const validatedData = await validateUpdatePassword(request, response);
  if (validatedData) {
    await knex(ACCOUNTS_TABLE)
      .update({
        password: bcrypt.hash(validatedData.password, saltRounds),
      })
      .where("id", request.params.accountId);

    response.status(201);
  }
};

export default updatePassword;
