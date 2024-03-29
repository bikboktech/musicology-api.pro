import knex from "../../common/data/database.js";
import { getSpotifyPlaylist } from "../../common/utils/spotify.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";

const getTemplatePlaylistInfo = async (request, response, next) => {
  const { params, context } = request;

  try {
    const playlist = await knex(TEMPLATE_PLAYLISTS_TABLE)
      .select(
        "template_playlists.*",
        "event_types.id as eventTypeId",
        "event_types.name as eventTypeName"
      )
      .where("template_playlists.id", params.playlistId)
      .leftJoin(
        "event_types",
        "template_playlists.event_type_id",
        "=",
        "event_types.id"
      )
      .first();

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
        playlistUrl: playlistOutput.url,
        eventType: {
          id: playlist.eventTypeId,
          name: playlist.eventTypeName,
        },
        tracks: playlistOutput.tracks,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default getTemplatePlaylistInfo;
