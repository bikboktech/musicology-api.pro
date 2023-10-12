import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const updateTemplatePlaylist = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(TEMPLATE_PLAYLISTS_TABLE)
      .update({
        event_id: validatedRequestBody.eventId,
        spotify_playlist_id: validatedRequestBody.spotifyPlaylistId,
        name: validatedRequestBody.playlistName,
        // notes: validatedRequestBody.playlistNotes,
      })
      .where("id", request.params.playlistId);

      const playlist = await knex(TEMPLATE_PLAYLISTS_TABLE)
        .select(
          "template_playlists.*",
          "event_types.id as eventTypeId",
          "event_types.name as eventTypeName"
        )
        .join("event_types", "event_types.id", "=", "template_playlists.event_type_id")
        .where("template_playlists.id", request.params.playlistId)
        .first();

      response.status(203).json({
        id: playlist.id,
        spotifyPlaylistId: playlist.spotify_playlist_id,
        playlistName: playlist.name,
        // playlistNotes: playlist.notes,
        eventType: {
          id: playlist.eventTypeId,
          name: playlist.eventTypeName
        }
      });
  }
};

export default updateTemplatePlaylist;
