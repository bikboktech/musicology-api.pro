import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import Exception from "../../common/utils/exceptions.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const createTemplatePlaylist = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    const [id] = await knex(TEMPLATE_PLAYLISTS_TABLE).insert({
      event_type_id: validatedRequestBody.eventTypeId,
      spotify_playlist_id: validatedRequestBody.spotifyPlaylistId,
      name: validatedRequestBody.playlistName,
      // notes: validatedRequestBody.playlistNotes,
      created_by: validatedRequestBody.createdBy
    });

    const playlist = await knex(TEMPLATE_PLAYLISTS_TABLE)
      .select(
        "template_playlists.*",
        "event_types.id as eventTypeId",
        "event_types.name as eventTypeName",
      )
      .where("template_playlists.id", id)
      .leftJoin("event_types", "template_playlists.event_type_id", "=", "event_types.id")
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

export default createTemplatePlaylist;
