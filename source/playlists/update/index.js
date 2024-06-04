import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import notifyPlaylistUpdated from "../utils.js";
import {
  getAuthenticationToken,
  updateSpotifyPlaylist,
  updateSpotifyPlaylistTracks,
} from "../../common/utils/spotify.js";

const PLAYLISTS_TABLE = "playlists";

const updatePlaylist = async (request, response, next) => {
  try {
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

      await notifyPlaylistUpdated(request.params.playlistId);
      response.status(200).json({
        id: request.params.playlistId,
        spotifyPlaylistId: validatedRequestBody.spotifyPlaylistId,
        eventId: validatedRequestBody.eventId,
        playlistName: validatedRequestBody.playlistName,
        trackIds: validatedRequestBody.trackIds,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default updatePlaylist;
