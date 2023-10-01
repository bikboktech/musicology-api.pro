import knex from "../../common/data/database.js";
import validateRequestBody from "./validateRequestBody.js";

const QUOTES_TABLE = "quotes";

const getAQuote = async (request, response) => {
  const validatedRequestBody = await validateRequestBody(request, response);
  if (validatedRequestBody) {
    const [quoteID] = await knex(QUOTES_TABLE).insert({
      account_full_name: validatedRequestBody.clientName,
      account_email: validatedRequestBody.email,
      event_budget: validatedRequestBody.eventBudget,
      event_date: validatedRequestBody.eventDate,
      event_type_id: validatedRequestBody.eventType,
      event_location: validatedRequestBody.eventLocation,
      event_guest_count: validatedRequestBody.guestCount,
      event_duration: validatedRequestBody.eventDuration,
      marketing_type: validatedRequestBody.marketingType,
      quote_active: 0
    });

    const quote = await knex(QUOTES_TABLE).where('id', quoteID).first();
    response.status(200).json(quote);
  }
}

export default getAQuote;