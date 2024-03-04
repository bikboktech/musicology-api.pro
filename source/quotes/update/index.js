import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import { DateTime } from "luxon";
import Exception from "../../common/utils/exceptions.js";

const ACCOUNTS_TABLE = "accounts";
const QUOTES_TABLE = "quotes";
const EVENTS_TABLE = "events";

const updateQuote = async (request, response, next) => {
  try {
    const validatedRequestBody = await validateRequestBody(request, response);

    if (validatedRequestBody) {
      await knex(QUOTES_TABLE)
        .update({
          quote_active: 0,
        })
        .where("id", request.params.quoteId);

      const quote = await knex(QUOTES_TABLE)
        .select(
          "quotes.*",
          "accounts.id as accountId",
          "accounts.email",
          "accounts.full_name",
          "event_types.name as eventTypeName"
        )
        .join("event_types", "quotes.event_type_id", "=", "event_types.id")
        .join("accounts", "quotes.account_id", "=", "accounts.id")
        .where("quotes.id", request.params.quoteId)
        .first();

      const [eventId] = await knex(EVENTS_TABLE).insert({
        client_id: quote.account_id,
        event_name: `${quote.full_name} - ${quote.eventTypeName}`,
        event_type_id: quote.event_type_id,
        date: quote.event_date,
        guest_count: quote.event_guest_count,
        location: quote.event_location,
      });

      await knex(ACCOUNTS_TABLE)
        .update({
          active: 1,
        })
        .where("id", quote.account_id);

      response.status(200).json({
        id: quote.id,
        eventType: {
          id: quote.event_type_id,
          name: quote.eventTypeName,
        },
        account: {
          id: quote.accountId,
          fullName: quote.full_name,
          email: quote.email,
        },
        active: quote.quote_active,
        eventDate: DateTime.fromJSDate(quote.date).toFormat("yyyy LLL dd"),
        clientName: quote.account_full_name,
        guestCount: quote.event_guest_count,
        eventLocation: quote.event_location,
        eventDuration: quote.event_duration,
        budget: quote.event_budget,
        marketingType: quote.marketing_type,
        extraMusician: quote.extra_musician,
        audioSupport: quote.audio_support,
        naturalApproachInteractions: quote.natural_approach_interactions,
        referencePlaylistLink: quote.reference_playlist_link,
        eventId,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default updateQuote;
