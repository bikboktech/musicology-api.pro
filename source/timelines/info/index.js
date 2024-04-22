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
    response.status(200).json({});
  } else {
    const timelineOutput = [];

    for (const timeline of timelines) {
      const track = await getSpotifyTrack(
        timeline.spotify_track_id,
        request.context.spotifyToken
      );

      timelineOutput.push({
        id: timeline.id,
        name: timeline.name,
        time: timeline.time,
        track,
        instructions: timeline.description,
      });
    }

    response.status(200).json(timelineOutput);
  }
};

export default getTimelineInfo;
