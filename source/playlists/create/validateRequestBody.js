import { object, string, number, array } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const SchemaCreatePlaylistInfo = object({
  eventId: number().positive().required(),
  playlistName: string().required(),
  playlistNotes: string().nullable(),
  trackIds: array().of(string().required()).min(1).required(),
});

const validateRequestBody = async (request, response) => {
  const event = await knex(EVENTS_TABLE)
    .where("id", request.body.eventId)
    .first();

  if (!event) {
    return new Exception(404, `The selected event doesn't exist`).handle(
      request,
      response
    );
  }

  try {
    return await SchemaCreatePlaylistInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
