import { object, string, number, date } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const EVENT_TYPES_TABLE = "event_types";

const SchemaCreateQuote = object({
  email: string().required(),
  eventTypeId: number().required(),
  eventDate: date().required(),
  clientName: string().required(),
  guestCount: number().required(),
  eventLocation: string().required(),
  eventDuration: string(),
  eventBudget: string(),
  marketingType: string(),
  extraMusician: string(),
  audioSupport: bool(),
  naturalApproachInteractions: string().required(),
  referencePlaylistLink: string(),
});

const validateRequestBody = async (request, response) => {
  const eventType = await knex(EVENT_TYPES_TABLE)
    .where("id", request.body.eventTypeId)
    .first();

  if (!eventType) {
    return new Exception(
      404,
      `Value ${eventType} is not a valid eventType option, expecting an integer`
    ).handle(request, response);
  }

  try {
    return await SchemaCreateQuote.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
