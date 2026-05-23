import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import notifyPlaylistUpdated from "../utils.js";
import {
  addTracksToSpotifyPlaylist,
  createSpotifyPlaylist,
  getAuthenticationToken,
} from "../../common/utils/spotify.js";

const PLAYLISTS_TABLE = "playlists";

const createPlaylist = async (request, response, next) => {
  try {
    const validatedRequestBody = await validateRequestBody(request, response);

    if (validatedRequestBody) {
      const authenticationToken = await getAuthenticationToken();

      const playlist = await createSpotifyPlaylist(
        validatedRequestBody.playlistName,
        authenticationToken
      );

      if (!playlist) {
        throw new Error("Playlist creation failed");
      }

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

      await notifyPlaylistUpdated(id);

      response.status(201).json({
        id: id,
        spotifyPlaylistId: playlist.id,
        eventId: validatedRequestBody.eventId,
        playlistUrl: playlist.external_urls.spotify,
        playlistName: validatedRequestBody.playlistName,
        trackIds: validatedRequestBody.trackIds,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default createPlaylist;
