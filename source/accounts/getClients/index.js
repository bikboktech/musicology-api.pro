import knex from "../../common/data/database.js";

const ACCOUNTS_TABLE = "accounts";

const CLIENT_ID = 3;

const getClients = async (request, response) => {
  const clients = await knex(ACCOUNTS_TABLE).where(
    "account_type_id",
    CLIENT_ID
  );

  response
    .status(200)
    .json(
      clients.map((client) => ({ id: client.id, fullName: client.full_name }))
    );
};

export default getClients;
