import knex from "../common/data/database.js";
import sendEmail from "../common/utils/email.js";

const PLAYLISTS_TABLE = "playlists";
const EVENTS_TABLE = "events";
const ACCOUNTS_TABLE = "accounts";

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const subject = "A playlist was just updated";

const notifyPlaylistUpdated = async (playlistId) => {
  const notificationInfo = await knex(PLAYLISTS_TABLE)
    .select(
      `${EVENTS_TABLE}.id as eventId`,
      `client.full_name as clientName`,
      `artist.email as artistEmail`,
      `${EVENTS_TABLE}.date as eventDate`
    )
    .where(`${PLAYLISTS_TABLE}.id`, playlistId)
    .join(
      EVENTS_TABLE,
      `${PLAYLISTS_TABLE}.event_id`,
      "=",
      `${EVENTS_TABLE}.id`
    )
    .join(
      `${ACCOUNTS_TABLE} as client`, 
      `${EVENTS_TABLE}.client_id`, 
      "=", 
      "client.id"
    )
    .join(
      `${ACCOUNTS_TABLE} as artist`, 
      `${EVENTS_TABLE}.artist_id`, 
      "=", 
      "artist.id"
    ).first();

  console.log(notificationInfo);
  const textMessage = null;
  const htmlMessage = `<p><b>${notificationInfo.clientName}</b> with an upcoming event 
  (<b>${notificationInfo.eventDate.toUTCString()}</b>) just updated their playlist.</p>
  <p>Check out the details: <a href="${process.env.MUSICOLOGY_URL}/events/${notificationInfo.eventId}">
  ${process.env.MUSICOLOGY_URL}/events/${notificationInfo.eventId}</a></p>`;

  try {
    await sendEmail(
      EMAIL_SENDER,
      [
        ...new Set([
          process.env.MUSICOLOGY_EMAIL_RECEIVER, 
          notificationInfo.artistEmail
        ])
      ],
      subject,
      textMessage,
      htmlMessage
    );
  } catch (err) {
    throw new Error("Error sending email to user");
  }
};

export default notifyPlaylistUpdated;
