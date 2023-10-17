import { object, string, number } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const EVENT_TYPES_TABLE = "event_types";

const SchemaCreateTemplatePlaylistInfo = object({
  eventTypeId: number().positive().required(),
  playlistName: string().required(),
  playlistNotes: string().nullable(),
  // createdBy: number().positive().required(),
});

const validateRequestBody = async (request, response) => {
  const eventType = await knex(EVENT_TYPES_TABLE)
    .where("id", request.body.eventTypeId)
    .first();

  if (!eventType) {
    return new Exception(404, `The selected event type doesn't exist`).handle(
      request,
      response
    );
  }

  // const account = await knex(ACCOUNTS_TABLE)
  //   .where("id", request.body.createdBy)
  //   .first();

  // if (!account) {
  //   return new Exception(404, `The selected account doesn't exist`).handle(
  //     request,
  //     response
  //   );
  // }

  try {
    return await SchemaCreateTemplatePlaylistInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
