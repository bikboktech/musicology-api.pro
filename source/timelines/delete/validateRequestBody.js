import { array, object, number } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const TIMELINES_TABLE = 'timelines';

const SchemaDeleteTimelineInfo = object({
  ids: array().of(number().positive().required()).required(),
});


const validateRequestBody = async (request, response) => {
  let validatedBody = null;
  try {
    validatedBody = await SchemaDeleteTimelineInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  } 
  
  if (validatedBody !== null) {
    const timelines = await knex(TIMELINES_TABLE).whereIn("id", validatedBody.ids);
    if (timelines.length == 0) {
      return new Exception(404, `The selected timelines do not exist`).handle(
        request,
        response
      );
    }
    return validatedBody;
  }

};

export default validateRequestBody;
