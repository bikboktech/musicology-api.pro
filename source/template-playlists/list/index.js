import knex from "../../common/data/database.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const getPlaylistLists = async (request, response, next) => {
  const query = knex(TEMPLATE_PLAYLISTS_TABLE)
    .select(
      "template_playlists.*",
      "event_types.id as eventTypeId",
      "event_types.name as eventTypeName"
    )
    .leftJoin(
      "event_types",
      "template_playlists.event_type_id",
      "=",
      "event_types.id"
    );

  const playlistCount = await knex(TEMPLATE_PLAYLISTS_TABLE).count(
    "template_playlists.id as count"
  );

  if (request.query.search) {
    query.where((builder) =>
      builder
        .orWhere("template_playlists.name", "like", `%${request.query.search}%`)
        .orWhere("event_types.name", "like", `%${request.query.search}%`)
    );
  }

  if (request.query.sortField && request.query.sortDirection) {
    query.orderBy(request.query.sortField, request.query.sortDirection);
  }

  if (request.query.limit) {
    query.limit(request.query.limit);
  } else {
    query.limit(5);
  }

  if (request.query.offset) {
    query.offset(request.query.offset);
  }

  const playlists = await query;

  response.status(200).json({
    data: playlists.map((playlist) => ({
      id: playlist.id,
      spotifyPlaylistId: playlist.spotify_playlist_id,
      playlistName: playlist.name,
      // playlistNotes: playlist.notes,
      eventType: {
        id: playlist.eventTypeId,
        name: playlist.eventTypeName,
      },
    })),
    count: playlistCount[0].count,
  });
};

export default getPlaylistLists;
