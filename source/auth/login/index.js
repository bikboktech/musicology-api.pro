import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const JWT_EXPIRY_TIME_MINUTES = 60;

const generateUserAccessToken = async (tokenData, rememberMe = false) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const tokenPayload = tokenData;

  if (rememberMe) return jwt.sign(tokenPayload, JWT_SECRET_KEY);

  const expiresIn = JWT_EXPIRY_TIME_MINUTES * 60;

  return jwt.sign(tokenPayload, JWT_SECRET_KEY, {
    expiresIn,
  });
};

const login = async (request, response) => {
  // response.status(200).json("ejla");
  const { email, password } = request.body;

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  if (!isValidEmail) {
    return new Exception(406, `Please provide a valid email`).handle(
      request,
      response
    );
  }

  const user = await knex("accounts")
    .select(
      "accounts.id",
      "accounts.full_name",
      "accounts.email",
      "accounts.password",
      "accounts.phone",
      "account_types.id as accountTypeId",
      "account_types.name as accountTypeName"
    )
    .innerJoin("account_types", function () {
      this.on("accounts.account_type_id", "=", "account_types.id");
    })
    .where("email", email)
    .first();

  if (!user) {
    return new Exception(404, `User not found`).handle(request, response);
  }

  console.log("Login successful");

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return new Exception(400, `The provided password is invalid`).handle(
      request,
      response
    );
  }

  const userData = {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    accountType: {
      id: user.accountTypeId,
      name: user.accountTypeName,
    },
  };

  const userAccessToken = await generateUserAccessToken(userData);

  console.log("Generated JWT");
  response.status(200).json(userAccessToken);
};

export default login;
