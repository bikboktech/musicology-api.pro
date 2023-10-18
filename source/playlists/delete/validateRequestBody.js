import { array, object, number } from "yup";
import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";

const PLAYLISTS_TABLE = 'playlists';

const SchemaDeletePlaylistInfo = object({
  ids: array().of(number().positive().required()).required(),
});


const validateRequestBody = async (request, response) => {
  let validatedBody = null;
  try {
    validatedBody = await SchemaDeletePlaylistInfo.validate(request.body);
  } catch (err) {
    return new Exception(400, err.toString()).handle(request, response);
  } 
  
  if (validatedBody !== null) {
    const playlists = await knex(PLAYLISTS_TABLE).whereIn("id", validatedBody.ids);
    if (playlists.length == 0) {
      return new Exception(404, `The selected playlists do not exist`).handle(
        request,
        response
      );
    }
    return validatedBody;
  }

};

export default validateRequestBody;
