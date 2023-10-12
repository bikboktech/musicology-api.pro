import knex from "../../common/data/database.js";
import Exception from "../../common/utils/exceptions.js";

const PLAYLISTS_TABLE = "playlists";

const getPlaylistInfo = async (request, response) => {
  const playlist = await knex(PLAYLISTS_TABLE)
    .where("playlists.id", request.params.playlistId)
    .first();
  
  if (!playlist) {
    return new Exception(404, `Playlist not found`).handle(
      request,
      response
    )
  }

  response.status(200).json({
    id: playlist.id,
    spotifyPlaylistId: playlist.spotify_playlist_id,
    playlistName: playlist.name,
    // playlistNotes: playlist.notes,
  });
};

export default getPlaylistInfo;
