import knex from "../../common/data/database.js";
import Exception from "../../common/utils/exceptions.js";

const TIMELINES_TABLE = "timelines";

const getTimelineInfo = async (request, response) => {
  let timeline;

  if (request.params.eventId) {
    timeline = await knex(TIMELINES_TABLE)
      .where("timelines.event_id", request.params.eventId)
      .first();
  } else {
    timeline = await knex(TIMELINES_TABLE)
      .where("timelines.id", request.params.timelineId)
      .first();
  }

  if (!timeline) {
    return new Exception(404, `Timeline not found`).handle(
      request,
      response
    )
  }

  response.status(200).json({
    id: timeline.id,
    eventId: timeline.event_id,
    time: timeline.time,
    description: timeline.description,
    // notes: timeline.notes,
  });
};

export default getTimelineInfo;
