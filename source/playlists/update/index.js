import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import Exception from "../../common/utils/exceptions.js";
import {
  getAuthenticationToken,
  updateSpotifyPlaylist,
  updateSpotifyPlaylistTracks,
} from "../../common/utils/spotify.js";

const PLAYLISTS_TABLE = "playlists";

const updatePlaylist = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    const authenticationToken = await getAuthenticationToken();

    await updateSpotifyPlaylist(
      validatedRequestBody.spotifyPlaylistId,
      validatedRequestBody.playlistName,
      authenticationToken
    );

    await updateSpotifyPlaylistTracks(
      validatedRequestBody.spotifyPlaylistId,
      validatedRequestBody.trackIds,
      authenticationToken
    );

    await knex(PLAYLISTS_TABLE)
      .update({
        name: validatedRequestBody.playlistName,
        // notes: validatedRequestBody.playlistNotes,
      })
      .where("id", request.params.playlistId);

    response.status(200).json({
      id: request.params.playlistId,
      spotifyPlaylistId: validatedRequestBody.spotifyPlaylistId,
      eventId: validatedRequestBody.eventId,
      playlistName: validatedRequestBody.name,
      trackIds: validatedRequestBody.trackIds,
    });
  }
};

export default updatePlaylist;
