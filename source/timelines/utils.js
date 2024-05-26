import knex from "../common/data/database.js";
import sendEmail from "../common/utils/email.js";

const EVENTS_TABLE = "events";
const ACCOUNTS_TABLE = "accounts";

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const subject = "A timeline was just updated";

const notifyTimelineUpdated = async (eventId) => {
  const notificationInfo = await knex(EVENTS_TABLE)
    .select(
      "events.id",
      `client.full_name as clientName`,
      `artist.email as artistEmail`,
      `${EVENTS_TABLE}.date as eventDate`
    )
    .where(`${EVENTS_TABLE}.id`, eventId)
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

  const textMessage = null;
  const htmlMessage = `<p><b>${notificationInfo.clientName}</b> with an upcoming event 
  (<b>${notificationInfo.eventDate}</b>) just updated their timeline.</p>
  <p>Check out the details: <a href="${process.env.MUSICOLOGY_URL}/events/${eventId}">
  ${process.env.MUSICOLOGY_URL}/events/${eventId}</a></p>`;

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

export default notifyTimelineUpdated;
