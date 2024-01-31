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
    .required("Please enter a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/[0-9]/, "Your password must have at least 1 digit character")
    .matches(/[a-z]/, "Your password must have at least 1 lowercase character")
    .matches(/[A-Z]/, "Your password must have at least 1 uppercase character"),
  confirmPassword: string()
    .nullable()
    .oneOf([ref("password")], "Passwords does not match"),
  active: bool().required()
});

const validateRequestBody = async (request, response) => {
  const accountType = await knex(ACCOUNT_TYPES_TABLE)
    .where("id", request.body.accountTypeId)
    .first();

  if (!accountType) {
    return new Exception(404, `The selected account type "${accountType}" doesn't exist`).handle(
      request,
      response
    );
  }

  try {
    return await SchemaCreateAccount.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
