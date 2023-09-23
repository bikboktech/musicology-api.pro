/** Validation function used against get-a-quote Form Data
 * @module module:quote_management/getAQuote/validateFormData
 * @requires express
 * @requires module:common/middlewares/handleError
 * @requires module:common/middlewares/exceptions
*/

import { object, string, number, date } from 'yup';
import Exception from "../../common/middlewares/exceptions.js";
import knex from "../../common/data/database.js";

const EventTypesTable = "event_types";
const ValidEventDuration = [
  "3hours",
  "6hours",
  "other"
];

const ValidBudget = [
  "cheapest",
  "2-3",
  "3-6",
  "6-more"
];

const SchemaGetAQuote = object({
  email: string().required(),
  eventType: number().required(),
  eventDate: date().required(),
  clientName: string().required(),
  guestCount: number().required(),
  eventLocation: string().required(),
  eventDuration: string().oneOf(ValidEventDuration),
  budget: string().oneOf(ValidBudget),
  marketingType: string(),
})

/**
 * Validates get-a-quote Form Data 
 *
 * @param {*} request
 * @param {*} response
 */
const validateFormData = async (request, response) => {
  const formData = request.body;
  const eventType = await knex(
    EventTypesTable).where('id', formData.eventType).first()

  if (!eventType) {
    return new Exception(
      404, `Value ${eventType} is not a valid eventType option, expecting an integer`
    ).handle(request, response);
  }

  try {
    return await SchemaGetAQuote.validate(formData);
  } catch (err) {
    return new Exception(
      400, err.toString()
    ).handle(request, response);
  }
}

export default validateFormData;
