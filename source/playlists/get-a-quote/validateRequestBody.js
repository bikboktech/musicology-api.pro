import { object, string, number, date } from 'yup';
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const EVENT_TYPES_TABLE = "event_types";
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

const validateRequestBody = async (request, response) => {
  const eventType = await knex(
    EVENT_TYPES_TABLE).where('id', request.body.eventType).first()

  if (!eventType) {
    return new Exception(
      404, `Value ${eventType} is not a valid eventType option, expecting an integer`
    ).handle(request, response);
  }

  try {
    return await SchemaGetAQuote.validate(request.body);
  } catch (err) {
    return new Exception(
      400, err.toString()
    ).handle(request, response);
  }
}

export default validateRequestBody;
