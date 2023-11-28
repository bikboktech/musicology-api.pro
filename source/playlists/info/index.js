import knex from "../../common/data/database.js";
import { getSpotifyPlaylist } from "../../common/utils/spotify.js";

const PLAYLISTS_TABLE = "playlists";

const getPlaylistInfo = async (request, response) => {
  const { context, params } = request;

  let playlist;

  if (params.eventId) {
    playlist = await knex(PLAYLISTS_TABLE)
      .where("playlists.event_id", params.eventId)
      .first();
  } else {
    playlist = await knex(PLAYLISTS_TABLE)
      .where("playlists.id", params.playlistId)
      .first();
  }

  if (!playlist) {
    response.status(200).json({});
  } else {
    const playlistOutput = await getSpotifyPlaylist(
      playlist.spotify_playlist_id,
      context.spotifyToken
    );

    response.status(200).json({
      id: playlist.id,
      spotifyPlaylistId: playlist.spotify_playlist_id,
      name: playlist.name,
      // playlistNotes: playlist.notes,
      tracks: playlistOutput.tracks,
    });
  }
};

export default getPlaylistInfo;