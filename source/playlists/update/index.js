import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import Exception from "../../common/utils/exceptions.js";

const PLAYLISTS_TABLE = "playlists";

const updatePlaylist = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(PLAYLISTS_TABLE)
      .update({
        event_id: validatedRequestBody.eventId,
        spotify_playlist_id: validatedRequestBody.spotifyPlaylistId,
        name: validatedRequestBody.playlistName,
        // notes: validatedRequestBody.playlistNotes,
      })
      .where("id", request.params.playlistId);

      const playlist = await knex(PLAYLISTS_TABLE)
        .select(
          "playlists.*",
          "events.name as eventName"
        )
        .join("events", "events.event_id", "=", "playlists.event_id")
        .where("playlists.id", id)
        .first();

      response.status(203).json({
        id: playlist.id,
        spotifyPlaylistId: playlist.spotify_playlist_id,
        playlistName: playlist.name,
        // playlistNotes: playlist.notes,
        eventName: playlist.eventName,
      });
  }
};

export default updatePlaylist;