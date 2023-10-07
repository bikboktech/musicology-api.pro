import knex from "../../common/data/database.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const getTemplatePlaylistInfo = async (request, response) => {
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
};

export default getTemplatePlaylistInfo;
