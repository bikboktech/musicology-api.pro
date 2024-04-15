import bcrypt from "bcryptjs";
import crypto from "crypto";
import knex from "../../common/data/database.js";
import notifyAccountCreated from "./utils.js";
import validateRequestBody from "./validateRequestBody.js";

const ACCOUNTS_TABLE = "accounts";
const ACCOUNT_TYPES_TABLE = "account_types";
const saltRounds = 12;

const updateAccount = async (request, response) => {
  const validatedRequestBody = await validateRequestBody(request, response);
  try {
    if (validatedRequestBody) {
      let accountId;
      if (Object.keys(request.params).includes("accountId")) {
        const existingAccount = await knex(ACCOUNTS_TABLE)
          .where("id", request.params.accountId)
          .first();
        await knex(ACCOUNTS_TABLE)
          .update({
            // account_type_id: validatedRequestBody.accountTypeId,
            full_name: validatedRequestBody.fullName,
            // password: bcrypt.hash(validatedRequestBody.password, saltRounds),
            email: validatedRequestBody.email,
            phone: validatedRequestBody.phone,
            active: validatedRequestBody.active,
          })
          .where("id", request.params.accountId);

        accountId = request.params.accountId;
        if (existingAccount.active == 0 && validatedRequestBody.active == 1) {
          await notifyAccountCreated(request, response, accountId);
        }
      } else {
        const tmpPassword = crypto.randomBytes(32).toString("hex");

        [accountId] = await knex(ACCOUNTS_TABLE).insert({
          account_type_id: validatedRequestBody.accountTypeId,
          full_name: validatedRequestBody.fullName,
          password: await bcrypt.hash(tmpPassword, saltRounds),
          email: validatedRequestBody.email,
          active: validatedRequestBody.active,
          phone: validatedRequestBody.phone,
        });

        if (validatedRequestBody.active) {
          await notifyAccountCreated(request, response, accountId);
        }
      }

      response.status(200).end();
    } else {
      throw new Error("Invalid Request");
    }
  } catch (error) {
    next(err);
  }
};

export default updateAccount;
