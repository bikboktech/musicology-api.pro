import knex from "../../common/data/database.js";

const ACCOUNTS_TABLE = "accounts";

const ADMIN_ID = 1;
const ARTIST_ID = 2;

const getArtists = async (request, response) => {
  const artists = await knex(ACCOUNTS_TABLE).whereIn("account_type_id", [
    ARTIST_ID,
    ADMIN_ID,
  ]);

  response
    .status(200)
    .json(
      artists.map((artist) => ({ id: artist.id, fullName: artist.full_name }))
    );
};

export default getArtists;
