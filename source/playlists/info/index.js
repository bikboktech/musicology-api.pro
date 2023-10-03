import knex from "../../common/data/database.js";

const PLAYLISTS_TABLE = "playlists";

const getPlaylistInfo = async (request, response) => {
  const playlist = await knex(PLAYLISTS_TABLE)
    .where("playlists.id", request.params.playlistId)
    .first();

  response.status(200).json({
    id: playlist.id,
    spotifyPlaylistId: playlist.spotify_playlist_id,
    playlistName: playlist.name,
    // playlistNotes: playlist.notes,
  });
};

export default getPlaylistInfo;
