import { DateTime } from "luxon";
import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const getEvents = async (request, response, next) => {
  const query = knex(EVENTS_TABLE)
    .select(
      "events.*",
      "client.full_name as clientFullName",
      "artist.full_name as artistFullName",
      "event_types.name as eventTypeName"
    )
    .join("accounts as client", "events.client_id", "=", "client.id")
    .join("accounts as artist", "events.artist_id", "=", "artist.id")
    .join("event_types", "events.event_type_id", "=", "event_types.id");

  const eventCount = await knex(EVENTS_TABLE).count("events.id as count");

  if (request.query.search) {
    query.where((builder) =>
      builder
        .orWhere("event_name", "like", `%${request.query.search}%`)
        .orWhere("event_types.name", "like", `%${request.query.search}%`)
        .orWhere("client.full_name", "like", `%${request.query.search}%`)
        .orWhere("date", "like", `%${request.query.search}%`)
        .orWhere("artist.full_name", "like", `%${request.query.search}%`)
        .orWhere("location", "like", `%${request.query.search}%`)
    );
  }

  if (request.query.sortField && request.query.sortDirection) {
    query.orderBy(request.query.sortField, request.query.sortDirection);
  }

  if (request.query.limit) {
    query.limit(request.query.limit);
  } else {
    query.limit(5);
  }

  if (request.query.offset) {
    query.offset(request.query.offset);
  }

  const events = await query;

  response.status(200).json({
    data: events.map((event) => ({
      id: event.id,
      eventName: event.event_name,
      eventType: event.eventTypeName,
      client: event.clientFullName,
      eventDate: DateTime.fromJSDate(event.date).toFormat("yyyy LLL dd"),
      artist: event.artistFullName,
      location: event.location,
    })),
    count: eventCount[0].count,
  });
};

export default getEvents;
