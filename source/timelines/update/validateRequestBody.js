import { object, string, array } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const TIMELINES_TABLE = "timelines";
const EVENTS_TABLE = "events";

const SchemaUpdateTimelineInfo = object({
  description: string().required(),
  notes: string().nullable(),
  time: string().required(),
});

const validateRequestBody = async (request, response) => {
  const timeline = await knex(TIMELINES_TABLE)
    .where("id", request.params.timelineId)
    .first();

  if (!timeline) {
    return new Exception(404, `The selected timeline doesn't exist`).handle(
      request,
      response
    );
  }

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
    return await SchemaUpdateTimelineInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
