import { DateTime } from "luxon";
import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const ARTIST_ID = 2;
const CLIENT_ID = 3;

const getEventList = async (request, response, next) => {
  try {
    const query = knex(EVENTS_TABLE)
      .select(
        "events.*",
        "client.full_name as clientFullName",
        "artist.full_name as artistFullName",
        "event_types.name as eventTypeName"
      )
      .join("accounts as client", "events.client_id", "=", "client.id")
      .leftJoin("accounts as artist", "events.artist_id", "=", "artist.id")
      .join("event_types", "events.event_type_id", "=", "event_types.id");

    if (request.user.accountType.id === ARTIST_ID) {
      query.where("artist_id", request.user.id);
    } else if (request.user.accountType.id === CLIENT_ID) {
      query.where("client_id", request.user.id);
    }

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

    const countQuery = query.clone().count("events.id as count");
    const eventCount = await countQuery;

    if (request.query.limit) {
      query.limit(request.query.limit);
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
        eventDate: DateTime.fromFormat(event.date, "yyyy-MM-dd").toFormat(
          "dd/MM/yyyy"
        ),
        artist: event.artistFullName,
        location: event.location,
      })),
      count: eventCount[0].count,
    });
  } catch (err) {
    next(err);
  }
};

export default getEventList;
