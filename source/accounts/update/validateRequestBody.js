import { object, string, number, ref, bool } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const ACCOUNT_TYPES_TABLE = "account_types";

const SchemaCreateAccount = object({
  accountId: number().nullable(),
  accountTypeId: number().nullable(),
  fullName: string().required(),
  email: string().required(),
  password: string()
    .min(8, "Password must have at least 8 characters")
    .matches(/[0-9]/, "Your password must have at least 1 digit character")
    .matches(/[a-z]/, "Your password must have at least 1 lowercase character")
    .matches(/[A-Z]/, "Your password must have at least 1 uppercase character"),
  phone: string().nullable(),
  confirmPassword: string()
    .nullable()
    .oneOf([ref("password")], "Passwords does not match"),
  active: bool(),
});

const SchemaUpdatePassword = object({
  accountId: number().required(),
  password: string().required(),
});

const validateRequestBody = async (request, response) => {
  const accountTypeId = request.body.accountTypeId;
  if (accountTypeId !== undefined) {
    const accountType = await knex(ACCOUNT_TYPES_TABLE)
      .where("id", accountTypeId)
      .first();

    if (!accountType) {
      return new Exception(
        404,
        `The selected account type "${accountType}" doesn't exist`
      ).handle(request, response);
    }
  }

  try {
    if (accountTypeId !== undefined)
      return await SchemaCreateAccount.validate(request.body);
    else
      return await SchemaUpdatePassword.validate({...request.body, ...request.params});
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
