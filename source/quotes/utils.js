import sendEmail from "../common/utils/email.js";

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_RECEIVER = process.env.MUSICOLOGY_EMAIL_RECEIVER;
const subject = "New event questionnaire submitted";

const notifyQuoteCreated = async (
  clientName,
  eventDate,
  quoteId
) => {
  const textMessage = null;
  const htmlMessage = `<p>Hurray 🥳</p><br><b>${clientName}</b> just submitted an event questionnaire for <b>${eventDate.toUTCString()}</b>!
  <p>Check out the details: <a href="${process.env.MUSICOLOGY_URL}/quotes/${quoteId}">
  ${process.env.MUSICOLOGY_URL}/quotes/${quoteId}</a></p>`;

  try {
    await sendEmail(
      EMAIL_SENDER,
      [EMAIL_RECEIVER],
      subject,
      textMessage,
      htmlMessage
    );
  } catch (err) {
    throw new Error("Error sending email to user");
  }
};

export default notifyQuoteCreated;
