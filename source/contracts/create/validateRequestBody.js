import { object, string } from "yup";
import Exception from "../../common/utils/exceptions.js";

const SchemaCreateContract = object({
  clientName: string().required(),
  clientId: string().required(),
  clientEmail: string().required(),
});

const validateRequestBody = async (request, response) => {
  try {
    return await SchemaCreateContract.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  }
};

export default validateRequestBody;
