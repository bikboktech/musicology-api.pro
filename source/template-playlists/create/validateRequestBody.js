import { object, string, number, array } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const EVENT_TYPES_TABLE = "event_types";

const SchemaCreateTemplatePlaylistInfo = object({
  eventTypeId: number().positive().defined().nullable(),
  playlistName: string().required(),
  playlistNotes: string().nullable(),
  trackIds: array().of(string().required()).min(1).required(),
  // createdBy: number().positive().required(),
});

const validateRequestBody = async (request, response) => {
  try {
    return await SchemaCreateTemplatePlaylistInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
