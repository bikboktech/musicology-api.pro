import { DateTime } from "luxon";
import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const ARTIST_ID = 2;
const CLIENT_ID = 3;

const getUpcomingEvents = async (request, response, next) => {
  try {
    const query = knex(EVENTS_TABLE)
      .select(
        // "events.*",
        "events.id as id",
        "events.event_name as event_name",
        "events.location as location",
        "events.contract_signed as contract_signed",
        "client.full_name as clientFullName",
        "artist.full_name as artistFullName",
        "event_types.name as eventTypeName",
      )
      .max("playlists.id as playlistId")
      .max("timelines.id as timelineId")
      .join("accounts as client", "events.client_id", "=", "client.id")
      .join("accounts as artist", "events.artist_id", "=", "artist.id")
      .join("event_types", "events.event_type_id", "=", "event_types.id")
      .leftJoin("playlists", "playlists.event_id", "=", "events.id")
      .leftJoin("timelines", "timelines.event_id", "=", "events.id")
      .where("events.date", ">", knex.raw("now()"))
      .orderBy("events.date")
      .groupBy([1, 2, 3, 4, 5, 6, 7]) // Group by all selected columns
      .limit(5);

    if (request.user.accountType.id === ARTIST_ID) {
      query.where("artist_id", request.user.id);
    } else if (request.user.accountType.id === CLIENT_ID) {
      query.where("client_id", request.user.id);
    }

    const events = await query;

    response.status(200).json(
      events.map((event) => ({
        id: event.id,
        eventName: event.event_name,
        eventType: event.eventTypeName,
        client: event.clientFullName,
        eventDate: DateTime.fromFormat(event.date, "yyyy-MM-dd").toFormat(
          "dd/MM/yyyy"
        ),
        artist: event.artistFullName,
        location: event.location,
        hasPlaylist: Boolean(event.playlistId),
        hasTimeline: Boolean(event.timelineId),
        signedContract: Boolean(event.contract_signed),
      }))
    );
  } catch (err) {
    next(err);
  }
};

export default getUpcomingEvents;
