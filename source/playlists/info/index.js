import knex from "../../common/data/database.js";

const PLAYLISTS_TABLE = "playlists";

const getPlaylistInfo = async (request, response) => {
  const playlist = await knex(PLAYLISTS_TABLE)
    .select(
      "playlists.*",
      "events.name as eventName"
    )
    .join("events", "events.event_id", "=", "playlists.event_id")
    .where("playlists.id", id)
    .first();

  response.status(200).json({
    id: playlist.id,
    spotifyPlaylistId: playlist.spotify_playlist_id,
    playlistName: playlist.name,
    // playlistNotes: playlist.notes,
    eventName: playlist.eventName,
  });
};

export default getPlaylistInfo;
