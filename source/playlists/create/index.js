import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import Exception from "../../common/utils/exceptions.js";

const PLAYLISTS_TABLE = "playlists";

const createPlaylist = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    const [id] = await knex(PLAYLISTS_TABLE).insert({
      event_id: validatedRequestBody.eventId,
      spotify_playlist_id: validatedRequestBody.spotifyPlaylistId,
      name: validatedRequestBody.playlistName,
      notes: validatedRequestBody.playlistNotes,
    });

    const playlist = await knex(PLAYLISTS_TABLE)
      .select(
        "playlist.*",
        "events.name as eventName",
        "client.full_name as clientFullName",
        "artist.full_name as artistFullName",
        "event_types.name as eventTypeName"
      )
      .join("events", "events.event_id", "=", "playlists.event_id")
      .join("accounts as artist", "events.artist_id", "=", "artist.id")
      .join("accounts as artist", "events.artist_id", "=", "artist.id")
      .join("event_types", "events.event_type_id", "=", "event_types.id")
      .where("playlists.id", id)
      .first();

    response.status(203).json({
      id: playlist.id,
      playlistName: playlist.name,
      playlistNotes: playlist.notes,
      eventName: playlist.eventName,
    });
  }
};

export default createPlaylist;
