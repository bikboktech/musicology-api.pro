/** Validation function used against get-a-quote Form Data
 * @module module:quote_management/getAQuote/validateFormData
 * @requires express
 * @requires module:common/middlewares/handleError
*/
import handleError from "../../common/middlewares/handleError.js";
import knex from "../../common/data/database.js";

const EVENT_TYPES_TABLE = "event_types";
const VALID_EVENT_DURATION = [
  "3hours",
  "6hours",
  "other"
];

const VALID_BUDGET = [
  "cheapest",
  "2-3",
  "3-6",
  "6-more"
];

const J = require('joi');

const FORM_SCHEMA = J.object().keys({
  eventType: J.number().integer().min(1).max(10).required(),
  eventDuration: J.string().includes(VALID_EVENT_DURATION),
  budget: J.string().includes(VALID_BUDGET)
})

/**
 * Validates get-a-quote Form Data 
 *
 * @param {*} request.body
 * @param {*} request
 * @param {*} response
 */
const validateFormData = async (formData, request, response) => {
  // var _validation = {
  //   status: 200,
  //   message: undefined
  // };

  const eventType = await knex(EVENT_TYPES_TABLE).where('id', formData.eventType).first();
  const result = J.validate({ ...formData, eventType})
  // if (!eventType) {
  //   validatedFormData._validation.status = 404;
  //   validatedFormData._validation.message = `Value ${formData.eventType} is not a valid eventType option, expecting an integer]`;
  //   handleError(validatedFormData._validation, request, response);
  // }

  // var validatedFormData = { ...formData, _validation};
  // if (!VALID_EVENT_DURATION.includes(formData.eventDuration)){
  //   validatedFormData._validation.status = 400;
  //   validatedFormData._validation.message = `Value ${formData.eventDuration} is not a valid eventDuration option. Please use one of [${VALID_EVENT_DURATION}]`;
  //   handleError(validatedFormData._validation, request, response);
  // }

  // if (!VALID_BUDGET.includes(formData.budget)){
  //   validatedFormData._validation.status = 400;
  //   validatedFormData._validation.message = `Value ${formData.budget} is not a valid budget option. Please use one of [${VALID_BUDGET}]`;
  //   handleError(validatedFormData._validation, request, response);
  // }

  return result;
}

export default validateFormData;
