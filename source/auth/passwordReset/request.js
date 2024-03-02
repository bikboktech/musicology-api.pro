import bcrypt from 'bcryptjs';

import Exception from '../../common/utils/exceptions.js'
import knex from '../../common/data/database.js';

const ACCOUNTS_TABLE_NAME = "accounts";
const RESET_TOKENS_TABLE_NAME = "reset_tokens"

const passwordResetRequest = async (request, response) => {
    const { token } = request.query;

    const resetTokenUser = await knex(ACCOUNTS_TABLE_NAME)
      .select(
        `${ACCOUNTS_TABLE_NAME}.id as id`,
        `${ACCOUNTS_TABLE_NAME}.email as email`,
        `${ACCOUNTS_TABLE_NAME}.password as password`,
        `${RESET_TOKENS_TABLE_NAME}.token as token`,
        `${RESET_TOKENS_TABLE_NAME}.hash as hash`,
        `${RESET_TOKENS_TABLE_NAME}.expiry_time as expiry_time`,
        `${RESET_TOKENS_TABLE_NAME}.created_at as created_at`)
      .join(
        RESET_TOKENS_TABLE_NAME, 
        `${ACCOUNTS_TABLE_NAME}.id`,
        '=',
        `${RESET_TOKENS_TABLE_NAME}.account_id`)
      .where(`${RESET_TOKENS_TABLE_NAME}.token`, token)
      .first();
  
    if (!resetTokenUser){
      return new Exception(
        404, `User not found`
      ).handle(request, response);
    }
  
    console.log("User found")
    let hash = `${resetTokenUser.email}:${resetTokenUser.password}&token=${token}`;
    const tokenMatches = await bcrypt.compare(hash, resetTokenUser.hash);
    if (!tokenMatches) {
      return new Exception(
        406, `The provided token is invalid`
      ).handle(request, response);
    }
    response.status(200).end();
  }
  
  export default passwordResetRequest;
  