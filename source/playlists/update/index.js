import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import Exception from "../../common/utils/exceptions.js";

const EVENTS_TABLE = "events";

const updateEvent = async (request, response, next) => {
  const validatedRequestBody = await validateRequestBody(request, response);

  if (validatedRequestBody) {
    await knex(EVENTS_TABLE)
      .update({
        client_id: validatedRequestBody.clientId,
        artist_id: validatedRequestBody.artistId,
        event_name: validatedRequestBody.eventName,
        event_type_id: validatedRequestBody.eventTypeId,
        date: validatedRequestBody.eventDate,
        guest_count: validatedRequestBody.guestCount,
        location: validatedRequestBody.location,
        venue_name: validatedRequestBody.venueName,
        venue_contact: validatedRequestBody.venueContact,
        duration: validatedRequestBody.duration,
        additional_artists: validatedRequestBody.additionalArtists,
        additional_info: validatedRequestBody.additionalInfo,
        updated_at: knex.raw("now()"),
      })
      .where("id", request.params.eventId);

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
      eventDate: event.date,
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
  }
};

export default updateEvent;
