import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import fetch from "node-fetch";

const EVENTS_TABLE = "events";

const TEMPLATE_ID = "494b913f-a08a-4b57-9af0-b3c4eae352f8";

const createEvent = async (request, response, next) => {
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

    const requestData = {
      name: `${event.clientFullName}_${event.eventTypeName}_contract`,
      test_mode: true,
      embedded_signing: true,
      template_id: TEMPLATE_ID,
      recipients: [
        {
          id,
          email: event.clientEmail,
          placeholder_name: "client",
        },
      ],
      template_fields: [
        {
          api_id: "clientNameCRO",
          value: event.clientFullName,
        },
        {
          api_id: "clientNameENG",
          value: event.clientFullName,
        },
        {
          api_id: "clientIDCRO",
          value: "12345",
        },
        {
          api_id: "clientIDENG",
          value: "12345",
        },
      ],
    };

    const config = {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.SIGN_WELL_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    let contract = {};

    try {
      const response = await fetch(
        `https://www.signwell.com/api/v1/document_templates/documents`,
        config
      );

      contract = await response.json();

      await knex(EVENTS_TABLE)
        .update({
          contract_id: contract.id,
          contract_url: contract.recipients[0].embedded_signing_url,
        })
        .where("id", id);
    } catch (error) {
      console.error("Failed to send document for signing:", error);
    }

    response.status(203).json({
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
      contract: {
        id: contract.id,
        url: contract.recipients[0].embedded_signing_url,
        signed: false,
      },
    });
  }
};

export default createEvent;
