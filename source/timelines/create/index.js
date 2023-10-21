import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const TIMELINES_TABLE = "timelines";

const createTimeline = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    const [id] = await knex(TIMELINES_TABLE).insert({
      event_id: validatedRequestBody.eventId,
      time: validatedRequestBody.time,
      description: validatedRequestBody.description,
      // notes: validatedRequestBody.notes,
    });

    const timeline = await knex(TIMELINES_TABLE)
      .select(
        "timelines.*",
        "events.event_name as eventName"
      )
      .where("timelines.id", id)
      .join("events", "events.id", "=", "timelines.event_id")
      .first();
  

    response.status(203).json({
      id: timeline.id,
      eventName: timeline.eventName,
      time: timeline.time,
      description: timeline.description,
      // notes: timeline.notes,
    });
  }
};

export default createTimeline;
