import bcrypt from "bcryptjs";
import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const ACCOUNTS_TABLE = "accounts";
const saltRounds = 12;

const updatePassword = async (request, response) => {
  const validatedData = await validateRequestBody(request, response);
  if (validatedData) {
    await knex(ACCOUNTS_TABLE)
      .update({
        password: await bcrypt.hash(validatedData.password.toString(), saltRounds),
      })
      .where("id", request.params.accountId);
    response.status(201).send();
  }
};

export default updatePassword;
