import { array, object, number } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const QUOTES_TABLE = "quotes";

const SchemaDeleteQuotes = object({
  ids: array().of(number().positive().required()).required(),
});

const validateRequestBody = async (request, response) => {
  let validatedBody = null;
  try {
    validatedBody = await SchemaDeleteQuotes.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }

  if (validatedBody !== null) {
    const events = await knex(QUOTES_TABLE).whereIn("id", validatedBody.ids);
    if (events.length == 0) {
      return new Exception(404, `The selected quotes do not exist`).handle(
        request,
        response
      );
    }
    return validatedBody;
  }
};

export default validateRequestBody;
