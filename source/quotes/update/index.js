import knex from "../../common/data/database.js";
import createContract from "../../common/utils/createContract.js";
import createSubscriber from "../../common/utils/mailerlite.js";
import notifyAccountCreated from "../../accounts/utils.js";
import validateRequestBody from "./validateRequestBody.js";
import { DateTime } from "luxon";

const ACCOUNTS_TABLE = "accounts";
const QUOTES_TABLE = "quotes";
const EVENTS_TABLE = "events";
const MAILERLITE_GROUP_NAME = "NEW CLIENTS";

const updateQuote = async (request, response, next) => {
  try {
    const validatedRequestBody = await validateRequestBody(request, response);

    if (validatedRequestBody) {
      await knex(QUOTES_TABLE)
        .update({
          is_active: 0,
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
        artist_id: request.user.id,
        event_name: `${quote.full_name} - ${quote.eventTypeName}`,
        event_type_id: quote.event_type_id,
        date: quote.event_date,
        guest_count: quote.event_guest_count,
        location: quote.event_location,
      });

      const contract = await createContract(
        eventId,
        quote.full_name,
        quote.eventTypeName,
        quote.email
      );

      if (contract) {
        await knex(EVENTS_TABLE)
          .update({
            contract_id: contract.id,
            contract_url: contract.recipients[0].embedded_signing_url,
          })
          .where("id", eventId);
      }

      await knex(ACCOUNTS_TABLE)
        .update({
          active: 1,
        })
        .where("id", quote.account_id);
      
      await createSubscriber(MAILERLITE_GROUP_NAME, quote, quote.event_date);
      await notifyAccountCreated(quote.accountId);

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
        active: quote.is_active,
        eventDate: DateTime.fromJSDate(quote.event_date).toFormat("dd/MM/yyyy"),
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
