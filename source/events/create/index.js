import { DateTime } from "luxon";
import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import fetch from "node-fetch";
import createContract from "../../common/utils/createContract.js";

const EVENTS_TABLE = "events";

const createEvent = async (request, response, next) => {
  try {
    const validatedRequestBody = await validateRequestBody(request, response);

    if (validatedRequestBody) {
      const [id] = await knex(EVENTS_TABLE).insert({
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
      });

      const event = await knex(EVENTS_TABLE)
        .select(
          "events.*",
          "client.full_name as clientFullName",
          "client.email as clientEmail",
          "artist.full_name as artistFullName",
          "event_types.name as eventTypeName"
        )
        .join("accounts as client", "events.client_id", "=", "client.id")
        .join("accounts as artist", "events.artist_id", "=", "artist.id")
        .join("event_types", "events.event_type_id", "=", "event_types.id")
        .where("events.id", id)
        .first();

      const contract = await createContract(
        event.id,
        event.clientFullName,
        event.eventTypeName,
        event.clientEmail
      );

      if (contract) {
        await knex(EVENTS_TABLE)
          .update({
            contract_id: contract.id,
            contract_url: contract.recipients[0].embedded_signing_url,
          })
          .where("id", id);
      }

      response.status(201).json({
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
        eventDate: DateTime.fromFormat(event.date, "yyyy-MM-dd").toFormat(
          "dd/MM/yyyy"
        ),
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
          id: contract.id,
          url: contract.recipients[0].embedded_signing_url,
          signed: false,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

export default createEvent;
