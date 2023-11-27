import { object, string, number, array } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const SchemaCreateTimelineInfo = object({
  eventId: number().positive().required(),
  timelines: array().of(
    object({
      id: number(),
      time: string().required(),
      description: string(),
      trackId: string(),
      notes: string().nullable(),
    })
  ),
});

const validateRequestBody = async (request, response) => {
  console.log(request.body, "aaaaaaaaaaaaaaaaaaaaaaaa");
  const event = await knex(EVENTS_TABLE)
    .where("id", request.body.eventId)
    .first();

  if (!event) {
    return new Exception(404, `The selected event doesn't exist`).handle(
      request,
      response
    );
  }

  try {
    return await SchemaCreateTimelineInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
