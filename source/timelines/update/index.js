import { DateTime } from "luxon";
import knex from "../../common/data/database.js";
import { getSpotifyTrack } from "../../common/utils/spotify.js";
import validateRequestBody from "./validateRequestBody.js";

const TIMELINES_TABLE = "timelines";

const updateTimeline = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  const insertPromises = [];
  const updatePromises = [];

  if (validatedRequestBody) {
    validatedRequestBody.timelines.forEach((timeline) => {
      if (timeline.id) {
        updatePromises.push(
          knex(TIMELINES_TABLE)
            .update({
              event_id: validatedRequestBody.eventId,
              time: timeline.time,
              description: timeline.description,
              spotify_track_id: timeline.trackId,
              name: timeline.name,
              // notes: validatedRequestBody.notes,
            })
            .where("id", timeline.id)
        );
      } else {
        insertPromises.push(
          knex(TIMELINES_TABLE).insert({
            event_id: validatedRequestBody.eventId,
            time: timeline.time,
            description: timeline.description,
            spotify_track_id: timeline.trackId,
            name: timeline.name,
            // notes: validatedRequestBody.notes,
          })
        );
      }
    });

    const existingTimeline = validatedRequestBody.timelines
      .filter((timeline) => timeline.id)
      .map((timeline) => timeline.id);

    await knex(TIMELINES_TABLE)
      .del()
      .where("event_id", validatedRequestBody.eventId)
      .whereNotIn("id", existingTimeline);

    await Promise.all(insertPromises);
    await Promise.all(updatePromises);

    const timelines = await knex(TIMELINES_TABLE)
      .where("event_id", validatedRequestBody.eventId)
      .orderBy("time", "ASC");

    const timelineOutput = [];

    for (const timeline of timelines) {
      timelineOutput.push({
        id: timeline.id,
        name: timeline.name,
        time: timeline.time,
        track: await getSpotifyTrack(
          timeline.spotify_track_id,
          request.context.spotifyToken
        ),
        instructions: timeline.instructions,
      });
    }

    response.status(200).json();
  }
};

export default updateTimeline;
