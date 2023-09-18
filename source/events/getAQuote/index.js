/** Express route definitions providing quote management related functions
 * @module module:quote_management/getAQuote
 * @requires express
 * @requires module:quote_management/getAQuote/validateFormData
 * @requires module:common/data/database
*/

import knex from "../../common/data/database.js";
import validateFormData from "./validateFormData.js";

const ACCOUNT_TYPES_TABLE = "account_types";
const ACCOUNTS_TABLE = "accounts";
const EVENT_TYPES_TABLE = "event_types";
const EVENTS_TABLE = "events";
const EVENT_ACCOUNTS_TABLE = "event_accounts";

/**
 * Validates get-a-quote Form Data 
 * and creates a new Quote
 *
 * @param {*} request
 * @param {*} response
 */
const getAQuote = async (request, response) => {
  const validatedFormData = await validateFormData(request.body, request, response);

  const accountType = await knex(ACCOUNT_TYPES_TABLE).where('name', 'Client').first();
  const eventType = await knex(EVENT_TYPES_TABLE).where('id', validatedFormData.eventType).first();
  const administrator = await knex(ACCOUNTS_TABLE).where('full_name', 'Administrator').first();

  const account = {
    account_type_id: accountType.id,
    full_name: validatedFormData.clientName,
    email: validatedFormData.email,
    active: 0,
    marketing_type: validatedFormData.marketingType,
    updated_by: administrator.id
  };
  const event = {
    date: validatedFormData.eventDate,
    event_type_id: eventType.id,
    guest_count: validatedFormData.guestCount,
    location: validatedFormData.eventLocation,
    duration: validatedFormData.eventDuration,
    updated_by: administrator.id
  };

  const [accountID] = await knex(ACCOUNTS_TABLE).insert(account);
  const [eventID] = await knex(EVENTS_TABLE).insert(event);

  const eventAccount = {
    account_client_id: accountID,
    event_id: eventID,
    budget: validatedFormData.budget,
    package_booked: 0
  }
  const [eventAccountID] = await knex(EVENT_ACCOUNTS_TABLE).insert(eventAccount);

  response.status(validatedFormData._validation.status).json(validatedFormData);
}

export default getAQuote;