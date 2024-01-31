import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const QUOTES_TABLE = "quotes";
const ACCOUNTS_TABLE = "accounts";

const CLIENT_ACCOUNT_TYPE_ID = 3;

const getAQuote = async (request, response) => {
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
      is_active: 1,
      extra_musician: validatedRequestBody.extraMusician,
      audio_support: validatedRequestBody.audioSupport,
      natural_approach_interactions:
        validatedRequestBody.naturalApproachInteractions,
      reference_playlist_link: validatedRequestBody.referencePlaylistLink,
    });

    const quote = await knex(QUOTES_TABLE).where("id", quoteID).first();

    response.status(200).json(quote);
  }
};

export default getAQuote;
