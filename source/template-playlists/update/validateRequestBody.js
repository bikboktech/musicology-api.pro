import { object, string, number } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const TEMPLATE_PLAYLISTS_TABLE = "template_playlists";
const EVENT_TYPES_TABLE = "event_types";

const SchemaUpdateTemplatePlaylistInfo = object({
  eventTypeId: number().positive().defined().nullable(),
  spotifyPlaylistId: string().required(),
  playlistName: string().required(),
  // playlistNotes: string().nullable(),
  // updatedBy: number().positive().required(),
});

const validateRequestBody = async (request, response) => {
  const playlist = await knex(TEMPLATE_PLAYLISTS_TABLE)
    .where("id", request.params.playlistId)
    .first();

  if (!playlist) {
    return new Exception(
      404,
      `The selected template playlist doesn't exist`
    ).handle(request, response);
  }

  try {
    return await SchemaUpdateTemplatePlaylistInfo.validate({
      ...request.body,
      spotifyPlaylistId: playlist.spotify_playlist_id,
    });
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
