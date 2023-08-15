/** Validation function used against get-a-quote Form Data
 * @module module:quote_management/getAQuote/validateFormData
 * @requires express
 * @requires module:common/middlewares/handleError
*/
import handleError from "../../common/middlewares/handleError.js";

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
  var validatedFormData = { ...formData, _validation};
  if (!VALID_EVENT_DURATION.includes(formData.eventDuration)){
    validatedFormData._validation.status = 400;
    validatedFormData._validation.message = `Value ${formData.eventDuration} is not a valid eventDuration option. Please use one of [${VALID_EVENT_DURATION}]`;
    handleError(validatedFormData._validation, request, response);
  }

  if (!VALID_BUDGET.includes(formData.budget)){
    validatedFormData._validation.status = 400;
    validatedFormData._validation.message = `Value ${formData.budget} is not a valid budget option. Please use one of [${VALID_BUDGET}]`;
    handleError(validatedFormData._validation, request, response);
  }

  return validatedFormData;
}

export default validateFormData;
