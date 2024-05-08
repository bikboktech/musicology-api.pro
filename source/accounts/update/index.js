import bcrypt from "bcryptjs";
import crypto from "crypto";
import knex from "../../common/data/database.js";
import notifyAccountCreated from "./utils.js";
import validateRequestBody from "./validateRequestBody.js";
import createSubscriber from "../../common/utils/mailerlite.js";

const ACCOUNTS_TABLE = "accounts";
const EVENTS_TABLE = "events";
const CLIENT_ACCOUNT_TYPE_ID = 3;
const MAILERLITE_GROUP_NAME = "NEW CLIENTS";
const saltRounds = 12;

const updateAccount = async (request, response, next) => {
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
          if (existingAccount.account_type_id == CLIENT_ACCOUNT_TYPE_ID) {
            const event = await knex(EVENTS_TABLE)
              .where("client_id", accountId)
              .orderBy("created_at", "desc")
              .first();
            await createSubscriber(MAILERLITE_GROUP_NAME, validatedRequestBody, event.date);
          }
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
          if (validatedRequestBody.accountTypeId == CLIENT_ACCOUNT_TYPE_ID) {
            const event = await knex(EVENTS_TABLE)
              .where("client_id", accountId)
              .orderBy("created_at", "desc")
              .first();
            await createSubscriber(MAILERLITE_GROUP_NAME, validatedRequestBody, event.date);
          }
          await notifyAccountCreated(request, response, accountId);
        }
      }

      const account = await knex(ACCOUNTS_TABLE)
        .select(
          "accounts.*",
          "account_types.id as accountTypeId",
          "account_types.name as accountTypeName"
        )
        .where(`${ACCOUNTS_TABLE}.id`, accountId)
        .join(
          "account_types",
          `${ACCOUNTS_TABLE}.account_type_id`,
          "=",
          "account_types.id"
        )
        .first();

      response.status(200).json({
        id: account.id,
        fullName: account.full_name,
        email: account.email,
        active: account.active,
        phone: account.phone,
        accountType: {
          id: account.accountTypeId,
          name: account.accountTypeName,
        },
      });
    } else {
      throw new Error("Invalid Request");
    }
  } catch (error) {
    next(error);
  }
};

export default updateAccount;
