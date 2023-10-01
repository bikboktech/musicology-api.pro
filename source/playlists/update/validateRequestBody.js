import { object, string, number } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const PLAYLISTS_TABLE = "playlists";

const SchemaUpdatePlaylistInfo = object({
  eventId: number().positive().required(),
  spotifyPlaylistId: string().required(),
  playlistName: string().required(),
  playlistNotes: string().nullable(),
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
    return await SchemaUpdatePlaylistInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;