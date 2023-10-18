import knex from "../../common/data/database.js";

const TIMELINES_TABLE = "timelines";

const getTimelineLists = async (request, response, next) => {
  const timelines = await knex(TIMELINES_TABLE)
    .select(
      "timelines.*",
      "events.event_name as eventName"
    )
    .join("events", "events.id", "=", "timelines.event_id");

  const playlistCount = await knex(TIMELINES_TABLE).count("timelines.id as count");

  response.status(200).json({
    data: timelines.map((timeline) => ({
      id: timeline.id,
      eventName: timeline.eventName,
      time: timeline.time,
      description: timeline.description,
      // notes: timeline.notes,
    })),
    count: playlistCount[0].count,
  });
};

export default getTimelineLists;
