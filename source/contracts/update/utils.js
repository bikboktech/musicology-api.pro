import sendEmail from "../../common/utils/email.js";

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_RECEIVER = process.env.MUSICOLOGY_EMAIL_RECEIVER;
const subject = "New contract was just signed";

const notifyContractCreated = (request, response, eventId) => {
  const textMessage = null;
  const htmlMessage = `<p>Hurray 🥳</p><br><p>${request.user.fullName} just signed their contract!</p>
  <p>Check out the details: <a href="${process.env.MUSICOLOGY_URL}/events/${eventId}">
  ${process.env.MUSICOLOGY_URL}/events/${eventId}</a></p>`;

  try {
    sendEmail(
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

export default notifyContractCreated;
