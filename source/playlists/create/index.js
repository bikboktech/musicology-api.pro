import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import { createSpotifyPlaylist } from "../../common/utils/spotify.js";

const PLAYLISTS_TABLE = "playlists";
const EVENTS_TABLE = "events";

const createPlaylist = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  console.log(validatedRequestBody);

  const playlistId = await createSpotifyPlaylist(
    request,
    validatedRequestBody.playlistName
  );

  // if (validatedRequestBody) {
  //   const [id] = await knex(PLAYLISTS_TABLE).insert({
  //     event_id: validatedRequestBody.eventId,
  //     spotify_playlist_id: validatedRequestBody.spotifyPlaylistId,
  //     name: validatedRequestBody.playlistName,
  //     // notes: validatedRequestBody.playlistNotes,
  //   });

  //   const playlist = await knex(PLAYLISTS_TABLE)
  //     .select("playlists.*", "events.name as eventName")
  //     .join("events", "events.event_id", "=", "playlists.event_id")
  //     .where("playlists.id", id)
  //     .first();

  //   response.status(203).json({
  //     id: playlist.id,
  //     spotifyPlaylistId: playlist.spotify_playlist_id,
  //     playlistName: playlist.name,
  //     // playlistNotes: playlist.notes,
  //     eventName: playlist.eventName,
  //   });
  // }
};

export default createPlaylist;
