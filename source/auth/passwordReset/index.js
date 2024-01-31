import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import Exception from '../../common/utils/exceptions.js'
import knex from '../../common/data/database.js';
import sendEmail from '../../common/utils/email.js';

const ACCOUNTS_TABLE_NAME = "accounts";
const RESET_PASSWORD_TOKENS_TABLE_NAME = "reset_password_tokens"
const tokenExpiryTime = 86400; // 24 hours in seconds
const saltRounds = 12;

const passwordReset = async (request, response) => {
  const { email } = request.body;
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
  const resetToken = await createDbResetToken(user);
  const emailTextMessage = `http://localhost:8080/accounts/password-reset/request?resetToken=${resetToken.hash}`

  sendEmail([email], '', 'Password reset', emailTextMessage, null)
    .then(function (data) {
      console.log(data.MessageId);
      response.status(204).send("OK");
    })
    .catch(function (err) {
      console.error(err, err.stack);
      response.status(502).send(err);
    });
}


const createDbResetToken = async (user) => {
  let token = await knex(RESET_PASSWORD_TOKENS_TABLE_NAME).where('account_id', user.id);
  if (token) 
      await knex(RESET_PASSWORD_TOKENS_TABLE_NAME).where('account_id', user.id).del();
  let resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, saltRounds);
  const [tokenId] = await knex(RESET_PASSWORD_TOKENS_TABLE_NAME).insert({
      'account_id': user.id,
      'hash': hash,
      'expiry_time': tokenExpiryTime
  });
  return await knex(RESET_PASSWORD_TOKENS_TABLE_NAME).where('id', tokenId).first();
}
  
export default passwordReset;