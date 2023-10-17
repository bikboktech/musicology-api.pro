import { object, string, array } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const PLAYLISTS_TABLE = "playlists";

const SchemaUpdatePlaylistInfo = object({
  playlistName: string().required(),
  playlistNotes: string().nullable(),
  trackIds: array().of(string().required()).min(1).required(),
});

const validateRequestBody = async (request, response) => {
  const playlist = await knex(PLAYLISTS_TABLE)
    .where("id", request.params.playlistId)
    .first();

  if (!playlist) {
    return new Exception(404, `The selected playlist doesn't exist`).handle(
      request,
      response
    );
  }

  try {
    return await SchemaUpdatePlaylistInfo.validate({
      ...request.body,
      spotifyPlaylistId: playlist.spotify_playlist_id,
    });
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
