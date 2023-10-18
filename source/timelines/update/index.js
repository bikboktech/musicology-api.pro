import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const TIMELINES_TABLE = "timelines";

const updateTimeline = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(TIMELINES_TABLE)
      .update({
        time: validatedRequestBody.time,
        description: validatedRequestBody.description,
        // notes: validatedRequestBody.notes,
      })
      .where("id", request.params.timelineId);

    response.status(200).json({
      id: request.params.timelineId,
      time: validatedRequestBody.time,
      eventId: validatedRequestBody.eventId,
      description: validatedRequestBody.description,
      // notes: validatedRequestBody.notes,
    });
  }
};

export default updateTimeline;
