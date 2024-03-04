import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const EVENTS_TABLE = "events";

const updateContract = async (request, response, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export default updateContract;
