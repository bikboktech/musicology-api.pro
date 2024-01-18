import { object, bool } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const QUOTES_TABLE = "quotes";

const SchemaUpdateQuoteInfo = object({
  approved: bool().required(),
});

const validateRequestBody = async (request, response) => {
  const quote = await knex(QUOTES_TABLE)
    .where("id", request.params.quoteId)
    .first();

  if (!quote) {
    return new Exception(404, `This quote doesn't exist`).handle(
      request,
      response
    );
  }

  try {
    return await SchemaUpdateQuoteInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
