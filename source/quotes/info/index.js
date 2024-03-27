import { DateTime } from "luxon";

import knex from "../../common/data/database.js";

const QUOTES_TABLE = "quotes";

const CLIENT_ID = 3;

const getQuoteInfo = async (request, response, next) => {
  try {
    if (request.user.accountType.id === CLIENT_ID) {
      throw new Error("Access denied");
    }

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

    if (!quote) {
      response.status(200).json({});
    } else {
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
        approved: !quote.is_active,
        eventDate: DateTime.fromJSDate(quote.event_date).toFormat("dd/MM/yyyy"),
        clientName: quote.account_full_name,
        guestCount: quote.event_guest_count,
        eventLocation: quote.event_location,
        eventDuration: quote.event_duration,
        budget: quote.event_budget,
        marketingType: quote.marketing_type,
        hoursOfEntertainment: quote.hours_of_entertainment,
        extraMusician: quote.extra_musician,
        audioSupport: quote.audio_support,
        naturalApproachInteractions: quote.natural_approach_interactions,
        referencePlaylistLink: quote.reference_playlist_link,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default getQuoteInfo;
