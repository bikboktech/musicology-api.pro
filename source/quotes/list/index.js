import { DateTime } from "luxon";
import knex from "../../common/data/database.js";

const QUOTES_TABLE = "quotes";

const CLIENT_ID = 3;

const getQuoteList = async (request, response, next) => {
  try {
    if (request.user.accountType.id === CLIENT_ID) {
      throw new Error("Access denied");
    }

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
    }

    if (request.query.offset) {
      query.offset(request.query.offset);
    }

    const quotes = await query;

    response.status(200).json({
      data: quotes.map((quote) => ({
        id: quote.id,
        clientName: quote.full_name,
        eventDate: DateTime.fromFormat(quote.event_date, "yyyy-MM-dd").toFormat(
          "dd/MM/yyyy"
        ),
        location: quote.event_location,
        budget: quote.event_budget,
        approved: !quote.is_active,
      })),
      count: eventCount[0].count,
    });
  } catch (err) {
    next(err);
  }
};

export default getQuoteList;
