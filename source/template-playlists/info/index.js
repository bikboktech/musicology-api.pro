import knex from "../../common/data/database.js";
import Exception from "../../common/utils/exceptions.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const getTemplatePlaylistInfo = async (request, response) => {
  const playlist = await knex(TEMPLATE_PLAYLISTS_TABLE)
    .select(
      "template_playlists.*",
      "event_types.id as eventTypeId",
      "event_types.name as eventTypeName"
    )
    .join("event_types", "event_types.id", "=", "template_playlists.event_type_id")
    .where("template_playlists.id", request.params.playlistId)
    .first();
  
  if (!playlist) {
    return new Exception(404, `Template Playlist not found`).handle(
      request,
      response
    )
  }

  response.status(200).json({
    id: playlist.id,
    spotifyPlaylistId: playlist.spotify_playlist_id,
    playlistName: playlist.name,
    // playlistNotes: playlist.notes,
    eventType: {
      id: playlist.eventTypeId,
      name: playlist.eventTypeName
    }
  });
};

export default getTemplatePlaylistInfo;
