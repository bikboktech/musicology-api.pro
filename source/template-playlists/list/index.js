import knex from "../../common/data/database.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const getPlaylistLists = async (request, response, next) => {
  const playlists = await knex(TEMPLATE_PLAYLISTS_TABLE)
    .select(
      "template_playlists.*",
      "event_types.id as eventTypeId",
      "event_types.name as eventTypeName",
    )
    .leftJoin("event_types", "template_playlists.event_type_id", "=", "event_types.id");

  const playlistCount = await knex(TEMPLATE_PLAYLISTS_TABLE).count("template_playlists.id as count");

  response.status(200).json({
    data: playlists.map((playlist) => ({
      id: playlist.id,
      spotifyPlaylistId: playlist.spotify_playlist_id,
      playlistName: playlist.name,
      // playlistNotes: playlist.notes,
      eventType: {
        id: playlist.eventTypeId,
        name: playlist.eventTypeName
      }
    })),
    count: playlistCount[0].count,
  });
};

export default getPlaylistLists;
