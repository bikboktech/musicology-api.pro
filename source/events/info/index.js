import { DateTime } from "luxon";

import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const ARTIST_ID = 2;
const CLIENT_ID = 3;

const getEventInfo = async (request, response) => {
  const query = knex(EVENTS_TABLE)
    .select(
      "events.*",
      "client.full_name as clientFullName",
      "artist.full_name as artistFullName",
      "event_types.name as eventTypeName"
    )
    .join("accounts as client", "events.client_id", "=", "client.id")
    .leftJoin("accounts as artist", "events.artist_id", "=", "artist.id")
    .join("event_types", "events.event_type_id", "=", "event_types.id")
    .where("events.id", request.params.eventId)
    .first();

  if (request.user.accountType.id === ARTIST_ID) {
    query.where("artist_id", request.user.id);
  } else if (request.user.accountType.id === CLIENT_ID) {
    query.where("client_id", request.user.id);
  }

  const event = await query;

  if (!event) {
    response.status(200).json({});
  } else {
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
      contract: {
        id: event.contract_id,
        url: event.contract_url,
        signed: event.contract_signed,
      },
    });
  }
};

export default getEventInfo;
