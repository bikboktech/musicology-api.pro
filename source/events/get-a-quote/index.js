/** Express route definitions providing quote management related functions
 * @module module:events/get-a-quote
 * @requires express
 * @requires module:events/get-a-quote/validateFormData
 * @requires module:common/data/database
*/

import knex from "../../common/data/database.js";
import validateFormData from "./validateFormData.js";

const QUOTES_TABLE = "quotes";

/**
 * Validates get-a-quote Form Data 
 * and creates a new Quote
 *
 * @param {*} request
 * @param {*} response
 */
const getAQuote = async (request, response) => {
  const validatedFormData = await validateFormData(request, response);
  if (validatedFormData) {
    const [quoteID] = await knex(QUOTES_TABLE).insert({
      account_full_name: validatedFormData.clientName,
      account_email: validatedFormData.email,
      event_budget: validatedFormData.eventBudget,
      event_date: validatedFormData.eventDate,
      event_type_id: validatedFormData.eventType,
      event_location: validatedFormData.eventLocation,
      event_guest_count: validatedFormData.guestCount,
      event_duration: validatedFormData.eventDuration,
      marketing_type: validatedFormData.marketingType,
      quote_active: 0
    });

    const quote = await knex(QUOTES_TABLE).where('id', quoteID).first();
    response.status(200).json(quote);
  }
}

export default getAQuote;