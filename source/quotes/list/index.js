import { DateTime } from "luxon";
import knex from "../../common/data/database.js";

const QUOTES_TABLE = "quotes";

const getQuoteList = async (request, response, next) => {
  const query = knex(QUOTES_TABLE)
    .select("quotes.*", "accounts.full_name")
    .join("accounts", "quotes.account_id", "=", "accounts.id");

  if (request.query.search) {
    query.where((builder) =>
      builder
        .orWhere("accounts.full_name", "like", `%${request.query.search}%`)
        .orWhere("event_date", "like", `%${request.query.search}%`)
        .orWhere("event_location", "like", `%${request.query.search}%`)
        .orWhere("event_budget", "like", `%${request.query.search}%`)
    );
  }

  if (request.query.sortField && request.query.sortDirection) {
    query.orderBy(request.query.sortField, request.query.sortDirection);
  }

  const countQuery = query.clone().count("quotes.id as count");
  const eventCount = await countQuery;

  if (request.query.limit) {
    query.limit(request.query.limit);
  } else {
    query.limit(5);
  }

  if (request.query.offset) {
    query.offset(request.query.offset);
  }

  const quotes = await query;

  response.status(200).json({
    data: quotes.map((quote) => ({
      id: quote.id,
      clientName: quote.full_name,
      eventDate: DateTime.fromJSDate(quote.event_date).toFormat("yyyy LLL dd"),
      location: quote.event_location,
      budget: quote.event_budget,
      approved: !quote.quote_active,
    })),
    count: eventCount[0].count,
  });
};

export default getQuoteList;
