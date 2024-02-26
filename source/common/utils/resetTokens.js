import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import knex from "../../common/data/database.js";

const RESET_TOKENS_TABLE_NAME = "reset_tokens";
const tokenExpiryTime = 86400; // 24 hours in seconds
const saltRounds = 12;

const createResetToken = async (user) => {
  let resetToken = await knex(RESET_TOKENS_TABLE_NAME).where('account_id', user.id);
  if (resetToken) 
      await knex(RESET_TOKENS_TABLE_NAME).where('account_id', user.id).del();
  
  const token = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(`${user.email}:${user.password}&token=${token}`, saltRounds);
  await knex(RESET_TOKENS_TABLE_NAME).insert({
    'account_id': user.id,
    'hash': hash,
    'token': token,
    'expiry_time': tokenExpiryTime
  });
  return token;
}

export default createResetToken;