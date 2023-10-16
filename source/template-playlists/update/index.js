import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import Exception from "../../common/utils/exceptions.js";
import {
  getAuthenticationToken,
  updateSpotifyPlaylist,
  updateSpotifyPlaylistTracks,
} from "../../common/utils/spotify.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

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

    await knex(TEMPLATE_PLAYLISTS_TABLE)
      .update({
        event_type_id: validatedRequestBody.eventTypeId,
        spotify_playlist_id: validatedRequestBody.spotifyPlaylistId,
        name: validatedRequestBody.playlistName,
        // notes: validatedRequestBody.playlistNotes,
        // updated_by: validatedRequestBody.updatedBy,
        updated_at: knex.fn.now(6),
      })
      .where("id", request.params.playlistId);

    const playlist = await knex(TEMPLATE_PLAYLISTS_TABLE)
      .select(
        "template_playlists.*",
        "event_types.id as eventTypeId",
        "event_types.name as eventTypeName"
      )
      .where("template_playlists.id", request.params.playlistId)
      .leftJoin(
        "event_types",
        "template_playlists.event_type_id",
        "=",
        "event_types.id"
      )
      .first();

    response.status(203).json({
      id: playlist.id,
      spotifyPlaylistId: playlist.spotify_playlist_id,
      playlistName: playlist.name,
      // playlistNotes: playlist.notes,
      eventType: {
        id: playlist.eventTypeId,
        name: playlist.eventTypeName,
      },
      trackIds: validatedRequestBody.trackIds,
    });
  }
};

export default updatePlaylist;
