import { object, string, number, date } from "yup";
import Exception from "../../../common/middlewares/exceptions.js";
import knex from "../../../common/data/database.js";

const EVENTS_TABLE = "events";
const ACCOUNTS_TABLE = "accounts";
const EVENT_TYPES_TABLE = "event_types";
const CLIENT_ID = 3;
const ARTIST_ID = 2;
const ADMIN_ID = 1;

const SchemaCreateEventInfo = object({
  clientId: number().positive().required(),
  artistId: number().positive().required(),
  eventTypeId: number().positive().required(),
  eventDate: date().required(),
  guestCount: number().positive().nullable(),
  location: string().nullable(),
  venueName: string().nullable(),
  venueContact: string().nullable(),
  duration: string().nullable(),
  additionalArtists: string().nullable(),
  additionalInfo: string().nullable(),
});

const validateRequestBody = async (request, response) => {
  const event = await knex(EVENTS_TABLE)
    .where("id", request.params.eventId)
    .first();

  if (!event) {
    return new Exception(404, `This event doesn't exist`).handle(
      request,
      response
    );
  }

  const client = await knex(ACCOUNTS_TABLE)
    .where("id", request.body.clientId)
    .andWhere("account_type_id", CLIENT_ID)
    .first();

  if (!client) {
    return new Exception(404, `The selected client doesn't exist`).handle(
      request,
      response
    );
  }

  const artist = await knex(ACCOUNTS_TABLE)
    .where("id", request.body.artistId)
    .whereIn("account_type_id", [ADMIN_ID, ARTIST_ID])
    .first();

  if (!artist) {
    return new Exception(404, `The selected artist doesn't exist`).handle(
      request,
      response
    );
  }

  const eventType = await knex(EVENT_TYPES_TABLE)
    .where("id", request.body.eventTypeId)
    .first();

  if (!eventType) {
    return new Exception(404, `The selected event type doesn't exist`).handle(
      request,
      response
    );
  }

  try {
    return await SchemaCreateEventInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
