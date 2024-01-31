import bcrypt from 'bcryptjs';

import Exception from '../../common/utils/exceptions.js'
import knex from '../../common/data/database.js';

const ACCOUNTS_TABLE_NAME = "accounts";
const RESET_PASSWORD_TOKENS_TABLE_NAME = "reset_password_tokens"

const passwordResetRequest = async (request, response) => {
    const { email } = request.body;
    const { resetToken } = request.query;
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
  
    if (!isValidEmail) {
      return new Exception(
        406, `Please provide a valid email`
      ).handle(request, response);
    }
  
    const user = await knex(ACCOUNTS_TABLE_NAME).where('email', email).first();
  
    if (!user){
      return new Exception(
        404, `User not found`
      ).handle(request, response);
    }
  
    console.log("Login successful")
    const token = await knex(RESET_PASSWORD_TOKENS_TABLE_NAME).where('account_id', user.id).first();
    const tokenMatches = await bcrypt.compare(resetToken, token.hash);
    // let resetToken = crypto.randomBytes(32).toString('hex');
    // const hash = await bcrypt.hash(resetToken, saltRounds);
    if (!tokenMatches) {
        return new Exception(
          406, `The provided token is invalid`
        ).handle(request, response);
    }

    response.status(200).end();
  }
  
  export default passwordResetRequest;
  