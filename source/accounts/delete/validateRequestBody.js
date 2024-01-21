import { array, object, number } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const ACCOUNTS_TABLE = 'accounts';

const SchemaDeleteAccount = object({
  ids: array().of(number().positive().required()).required(),
});


const validateRequestBody = async (request, response) => {
  let validatedBody = null;
  try {
    validatedBody = await SchemaDeleteAccount.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  } 
  
  if (validatedBody !== null) {
    const accounts = await knex(ACCOUNTS_TABLE).whereIn("id", validatedBody.ids);
    if (accounts.length == 0) {
      return new Exception(404, `The selected ${ACCOUNTS_TABLE} do not exist`).handle(
        request,
        response
      );
    }
    return validatedBody;
  }

};

export default validateRequestBody;
