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
  if (validatedRequestBody) {
    let accountId;
    if (Object.keys(request.params).includes("accountId")) {
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
    } else {
      const tmpPassword = crypto.randomBytes(32).toString('hex');
      
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

    const account = await knex(ACCOUNTS_TABLE).where("id", accountId).first();

    const accountType = await knex(ACCOUNT_TYPES_TABLE)
      .where("id", account.account_type_id)
      .first();

    response.status(200).json({
      id: account.id,
      fullName: account.full_name,
      email: account.email,
      active: account.active,
      accountTypeName: accountType.name,
    });
  }
};

export default updateAccount;
