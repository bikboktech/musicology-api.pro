import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const EVENTS_TABLE = "events";

const updateContract = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(EVENTS_TABLE)
      .update({
        contract_signed: validatedRequestBody.signed,
      })
      .where("contract_id", request.params.contractId);

    response.status(200).json({
      signed: validatedRequestBody.signed,
    });
  }
};

export default updateContract;
