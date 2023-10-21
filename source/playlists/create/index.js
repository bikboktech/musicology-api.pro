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
    
    var playlist = createSpotifyPlaylist(
      validatedRequestBody.playlistName,
      authenticationToken
    )

    await addTracksToSpotifyPlaylist(
      playlist.id,
      validatedRequestBody.trackIds,
      authenticationToken
    );

    const [id] = await knex(PLAYLISTS_TABLE).insert({
      event_id: validatedRequestBody.eventId,
      spotify_playlist_id: playlist.id,
      name: playlist.name,
      // notes: validatedRequestBody.playlistNotes,
    });

    playlist = await knex(PLAYLISTS_TABLE)
      .select(
        "playlists.*",
        "events.event_name as eventName"
      )
      .where("playlists.id", id)
      .join("events", "events.id", "=", "playlists.event_id")
      .first();
  

    response.status(203).json({
      id: playlist.id,
      eventName: playlist.eventName,
      spotifyPlaylistId: playlist.spotify_playlist_id,
      playlistName: playlist.name,
      trackIds: validatedRequestBody.trackIds,
      // playlistNotes: playlist.notes,
    });
  }
};

export default createPlaylist;
