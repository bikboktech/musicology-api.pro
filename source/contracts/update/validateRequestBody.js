import { object, boolean } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const SchemaUpdateContract = object({
  signed: boolean().required(),
});

const validateRequestBody = async (request, response) => {
  const event = await knex(EVENTS_TABLE)
    .where("contract_id", request.params.contractId)
    .first();

  if (!event) {
    return new Exception(404, `This contract doesn't exist`).handle(
      request,
      response
    );
  }

  try {
    return await SchemaUpdateContract.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
