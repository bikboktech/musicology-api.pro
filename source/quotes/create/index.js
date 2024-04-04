import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";
import createSubscriber from "../../common/utils/mailerlite.js";

const QUOTES_TABLE = "quotes";
const ACCOUNTS_TABLE = "accounts";

const CLIENT_ACCOUNT_TYPE_ID = 3;
const MAILERLITE_GROUP_NAME = "TEST - NEW LEADS";

const getAQuote = async (request, response, next) => {
  try {
    const validatedRequestBody = await validateRequestBody(request, response);
    if (validatedRequestBody) {
      const [accountId] = await knex(ACCOUNTS_TABLE).insert({
        account_type_id: CLIENT_ACCOUNT_TYPE_ID,
        full_name: validatedRequestBody.clientName,
        email: validatedRequestBody.email,
        active: 0,
      });

      const [quoteID] = await knex(QUOTES_TABLE).insert({
        account_id: accountId,
        event_date: validatedRequestBody.eventDate,
        event_type_id: validatedRequestBody.eventTypeId,
        event_location: validatedRequestBody.eventLocation,
        event_guest_count: validatedRequestBody.guestCount,
        event_budget: validatedRequestBody.eventBudget,
        marketing_type: validatedRequestBody.marketingType,
        hours_of_entertainment: validatedRequestBody.hoursOfEntertainment,
        is_active: 1,
        extra_musician: validatedRequestBody.extraMusician,
        audio_support: validatedRequestBody.audioSupport,
        natural_approach_interactions:
          validatedRequestBody.naturalApproachInteractions,
        reference_playlist_link: validatedRequestBody.referencePlaylistLink,
      });

      const quote = await knex(QUOTES_TABLE).where("id", quoteID).first();

      const client = {
        email: validatedRequestBody.email,
        fullName: validatedRequestBody.clientName
      };
      await createSubscriber(MAILERLITE_GROUP_NAME, client);
      response.status(201).json(quote);
    }
  } catch (err) {
    next(err);
  }
};

export default getAQuote;
