import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import Exception from '../../common/utils/exceptions.js'
import knex from '../../common/data/database.js';

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
  
    const user = await knex('accounts').where('email', email).first();
  
    if (!user){
      return new Exception(
        404, `User not found`
      ).handle(request, response);
    }
  
    console.log("Login successful")
    let token = await knex('tokens').where('account_id', user.id);
    if (token) 
        await knex('tokens').where('account_id', user.id).del();
    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, saltRounds);
    await knex('tokens').insert({
        'account_id': user.id,
        'hash': hash,
        'expiry_time': tokenExpiryTime
    });
    response.status(200).send(resetToken);
  }
  
  export default passwordReset;
  