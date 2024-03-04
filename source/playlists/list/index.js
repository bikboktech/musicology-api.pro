import knex from "../../common/data/database.js";

const PLAYLISTS_TABLE = "playlists";

const getPlaylistLists = async (request, response, next) => {
  try {
    const playlists = await knex(PLAYLISTS_TABLE)
      .select("playlists.*", "events.event_name as eventName")
      .join("events", "events.id", "=", "playlists.event_id");

    const playlistCount = await knex(PLAYLISTS_TABLE).count(
      "playlists.id as count"
    );

    response.status(200).json({
      data: playlists.map((playlist) => ({
        id: playlist.id,
        spotifyPlaylistId: playlist.spotify_playlist_id,
        playlistName: playlist.name,
        // playlistNotes: playlist.notes,
        eventName: playlist.eventName,
      })),
      count: playlistCount[0].count,
    });
  } catch (err) {
    next(err);
  }
};

export default getPlaylistLists;
