/** Express route definitions providing login related functions
 * @module module:auth/login
 * @requires express
 * @requires module:common/data/database
 * @requires module:jsonwebtoken
 * @requires module:bcrypt
*/

import knex from '../../common/data/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_EXPIRY_TIME_MINUTES = 60;

/**
 * Generates a (JWT) User Access Token
 *
 * @param {*} tokenData
 * @param {*} rememberMe
 */
const generateUserAccessToken = async (tokenData, rememberMe = false) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const tokenPayload = tokenData;

  if (rememberMe)
    return jwt.sign(tokenPayload, JWT_SECRET_KEY)

  const expiresIn = JWT_EXPIRY_TIME_MINUTES * 60;

  return jwt.sign(tokenPayload, JWT_SECRET_KEY, {
    expiresIn
  })
}

/**
 * Authenticates an account and serves a User Access Token to the frontend
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const login = async (request, response, next) => {
  const { email, password } = request.body;
  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  if (!isValidEmail) {
    response.status(406).json({ message: `Please provide a valid email` });
    return;
  }

  const user = await knex('accounts').where('email', email).first();

  if (!user) {
    response.status(404).json({ message: `User not found` });
    return;
  }

  console.log(user)

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    response.status(400).json({ message: "The provided password is invalid" });
    return;
  }
  const userAccessToken = await generateUserAccessToken(user);
  response.status(200).json(userAccessToken);
}

export default login;
