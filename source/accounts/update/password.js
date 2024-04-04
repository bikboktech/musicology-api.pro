import bcrypt from "bcryptjs";
import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const ACCOUNTS_TABLE = "accounts";
const RESET_TOKENS_TABLE = "reset_tokens"
const saltRounds = 12;

const updatePassword = async (request, response) => {
  const validatedData = await validateRequestBody(request, response);
  if (!validatedData) {
    return new Exception(
      400, `Error validating password reset request. Please try again.`
    ).handle(request, response);
  }

  const user = await getAccountFromToken(validatedData.token);
  if (user === undefined) {
    return new Exception(
      400, `Error validating password reset request. Please try again.`
    ).handle(request, response);
  }

  await knex(ACCOUNTS_TABLE)
    .update({
      password: await bcrypt.hash(validatedData.password.toString(), saltRounds),
    })
    .where("id", user.id);
  
  response.status(201).send();
};


const getAccountFromToken = async (token) => {
  const resetTokenUser = await knex(ACCOUNTS_TABLE)
    .select(
      `${ACCOUNTS_TABLE}.id as id`,
      `${ACCOUNTS_TABLE}.email as email`,
      `${ACCOUNTS_TABLE}.password as password`,
      `${RESET_TOKENS_TABLE}.token as token`,
      `${RESET_TOKENS_TABLE}.hash as hash`,
      `${RESET_TOKENS_TABLE}.expiry_time as expiry_time`,
      `${RESET_TOKENS_TABLE}.created_at as created_at`)
    .join(
      RESET_TOKENS_TABLE, 
      `${ACCOUNTS_TABLE}.id`,
      '=',
      `${RESET_TOKENS_TABLE}.account_id`)
    .where(`${RESET_TOKENS_TABLE}.token`, token)
    .first();

  if (!resetTokenUser)
    return undefined;

  console.log("User found")
  let hash = `${resetTokenUser.email}:${resetTokenUser.password}&token=${token}`;
  const tokenMatches = await bcrypt.compare(hash, resetTokenUser.hash);
  if (!tokenMatches)
    return undefined;
  return resetTokenUser;
}

export default updatePassword;
