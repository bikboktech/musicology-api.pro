import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import {
  addTracksToSpotifyPlaylist,
  createSpotifyPlaylist,
  getAuthenticationToken,
} from "../../common/utils/spotify.js";

const PLAYLISTS_TABLE = "playlists";

const createPlaylist = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    const authenticationToken = await getAuthenticationToken();

    const playlist = await createSpotifyPlaylist(
      validatedRequestBody.playlistName,
      authenticationToken
    );

    await addTracksToSpotifyPlaylist(
      playlist.id,
      validatedRequestBody.trackIds,
      authenticationToken
    );

    const [id] = await knex(PLAYLISTS_TABLE).insert({
      event_id: validatedRequestBody.eventId,
      spotify_playlist_id: playlist.id,
      name: validatedRequestBody.playlistName,
      // notes: validatedRequestBody.playlistNotes,
    });

    response.status(203).json({
      id: id,
      spotifyPlaylistId: playlist.id,
      eventId: validatedRequestBody.eventId,
      playlistName: validatedRequestBody.name,
      trackIds: validatedRequestBody.trackIds,
    });
  }
};

export default createPlaylist;
