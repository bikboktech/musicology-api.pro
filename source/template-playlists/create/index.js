import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import {
  addTracksToSpotifyPlaylist,
  createSpotifyPlaylist,
  getAuthenticationToken,
} from "../../common/utils/spotify.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const createTemplatePlaylist = async (request, response, next) => {
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

      const [id] = await knex(TEMPLATE_PLAYLISTS_TABLE).insert({
        event_type_id: validatedRequestBody.eventTypeId,
        spotify_playlist_id: playlist.id,
        name: validatedRequestBody.playlistName,
        // notes: validatedRequestBody.playlistNotes,
        // created_by: validatedRequestBody.createdBy,
      });

      const templatePlaylist = await knex(TEMPLATE_PLAYLISTS_TABLE)
        .select(
          "template_playlists.*",
          "event_types.id as eventTypeId",
          "event_types.name as eventTypeName"
        )
        // .join("event_types", "event_types.id", "=", "template_playlists.event_type_id")
        .where("template_playlists.id", id)
        .leftJoin(
          "event_types",
          "template_playlists.event_type_id",
          "=",
          "event_types.id"
        )
        .first();

      response.status(201).json({
        id: templatePlaylist.id,
        spotifyPlaylistId: templatePlaylist.spotify_playlist_id,
        playlistName: templatePlaylist.name,
        // playlistNotes: playlist.notes,
        eventType: {
          id: templatePlaylist.eventTypeId,
          name: templatePlaylist.eventTypeName,
        },
        trackIds: validatedRequestBody.trackIds,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default createTemplatePlaylist;
