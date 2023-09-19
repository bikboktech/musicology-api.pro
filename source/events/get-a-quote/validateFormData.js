/** Validation function used against get-a-quote Form Data
 * @module module:quote_management/getAQuote/validateFormData
 * @requires express
 * @requires module:common/middlewares/handleError
*/
import handleError from "../../common/middlewares/handleError.js";
import knex from "../../common/data/database.js";
import Joi from "joi";

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

const formSchema = Joi.object().keys({
  clientName: Joi.string(),
  eventType: Joi.number().integer().required(),
  eventDuration: Joi.string().valid(...VALID_EVENT_DURATION),
  budget: Joi.string().valid(...VALID_BUDGET)
})

/**
 * Validates get-a-quote Form Data 
 *
 * @param {*} request.body
 * @param {*} request
 * @param {*} response
 */
const validateFormData = async (formData, request, response) => {
  var _validation = {
    status: 200,
    message: undefined
  };

  const eventType = await knex(EVENT_TYPES_TABLE).where('id', formData.eventType).first();
  if (!eventType) {
    _validation.status = 404;
    _validation.message = `Value ${formData.eventType} is not a valid eventType option, expecting an integer]`;
    handleError(_validation, request, response);
  }

  try {
    return await formSchema.validateAsync(formData, formSchema);
  } catch (err) {
    _validation.status = 400;
    _validation.message = err.toString();
    handleError(_validation, request, response);
  }
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
}

export default validateFormData;
