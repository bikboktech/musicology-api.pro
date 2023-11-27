import { DateTime } from "luxon";
import knex from "../../common/data/database.js";
import Exception from "../../common/utils/exceptions.js";
import { getSpotifyTrack } from "../../common/utils/spotify.js";

const TIMELINES_TABLE = "timelines";

const getTimelineInfo = async (request, response) => {
  const timelines = await knex(TIMELINES_TABLE).where(
    "timelines.event_id",
    request.params.eventId
  );

  if (!timelines) {
    return new Exception(404, `Timeline not found`).handle(request, response);
  }

  const timelineOutput = await Promise.all(
    timelines.map(async (timeline) => ({
      id: timeline.id,
      name: timeline.name,
      time: timeline.time,
      track: await getSpotifyTrack(
        timeline.spotify_track_id,
        request.context.spotifyToken
      ),
      instructions: timeline.instructions ?? "",
    }))
  );

  response.status(200).json(timelineOutput);
};

export default getTimelineInfo;
