import { array, object, number } from "yup";
import Exception from "../../common/utils/exceptions.js";

const SchemaCreateEventInfo = object({
  ids: array().of(number().positive().required()),
});

const validateRequestBody = async (request, response) => {
  try {
    return await SchemaCreateEventInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
