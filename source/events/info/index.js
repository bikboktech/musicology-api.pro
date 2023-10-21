import { DateTime } from "luxon";

import knex from "../../common/data/database.js";
import Exception from "../../common/utils/exceptions.js";

const EVENTS_TABLE = "events";

const getEventInfo = async (request, response) => {
  const event = await knex(EVENTS_TABLE)
    .select(
      "events.*",
      "client.full_name as clientFullName",
      "artist.full_name as artistFullName",
      "event_types.name as eventTypeName"
    )
    .join("accounts as client", "events.client_id", "=", "client.id")
    .join("accounts as artist", "events.artist_id", "=", "artist.id")
    .join("event_types", "events.event_type_id", "=", "event_types.id")
    .where("events.id", request.params.eventId)
    .first();
  
  if (!event) {
    return new Exception(404, `Event not found`).handle(
      request,
      response
    )
  }
  
  response.status(200).json({
    id: event.id,
    additionalInfo: event.additional_info,
    eventName: event.event_name,
    eventType: {
      id: event.event_type_id,
      name: event.eventTypeName,
    },
    client: {
      id: event.client_id,
      fullName: event.clientFullName,
    },
    eventDate: DateTime.fromJSDate(event.date).toFormat("yyyy LLL dd"),
    guestCount: event.guest_count,
    artist: {
      id: event.artist_id,
      fullName: event.artistFullName,
    },
    location: event.location,
    venueName: event.venue_name,
    venueContact: event.venue_contact,
    address: event.address,
  });
};

export default getEventInfo;
