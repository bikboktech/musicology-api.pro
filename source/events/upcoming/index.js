import { DateTime } from "luxon";
import knex from "../../common/data/database.js";

const EVENTS_TABLE = "events";

const ARTIST_ID = 2;
const CLIENT_ID = 3;

const getUpcomingEvents = async (request, response, next) => {
  try {
    const query = knex(EVENTS_TABLE)
      .select(
        "events.*",
        "client.full_name as clientFullName",
        "artist.full_name as artistFullName",
        "event_types.name as eventTypeName",
        "playlists.id as playlistId",
        "timelines.id as timelineId"
      )
      .join("accounts as client", "events.client_id", "=", "client.id")
      .join("accounts as artist", "events.artist_id", "=", "artist.id")
      .join("event_types", "events.event_type_id", "=", "event_types.id")
      .leftJoin("playlists", "playlists.event_id", "=", "events.id")
      .leftJoin("timelines", "timelines.event_id", "=", "events.id")
      .where("events.date", ">", knex.raw("now()"))
      .orderBy("events.date")
      .groupBy("events.id")
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
        eventDate: DateTime.fromJSDate(event.date).toFormat("dd/MM/yyyy"),
        artist: event.artistFullName,
        location: event.location,
        hasPlaylist: Boolean(event.playlistId),
        hasTimeline: Boolean(events.timelineId),
        signedContract: Boolean(events.contract_signed),
      }))
    );
  } catch (err) {
    next(err);
  }
};

export default getUpcomingEvents;
