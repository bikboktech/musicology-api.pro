import knex from "../../common/data/database.js";
import sendEmail from "../../common/utils/email.js";
import createResetToken from "../../common/utils/resetTokens.js";

const ACCOUNTS_TABLE = "accounts";

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const CHANGE_PASSWORD_URL = process.env.CHANGE_PASSWORD_URL;
const subject = "Welcome to musicology.pro 🎉";

const notifyAccountCreated = async (request, response, accountId) => {
  const user = await knex(ACCOUNTS_TABLE).where("id", accountId).first();
  const toEmail = user.email;

  const token = await createResetToken(user);
  const textMessage = null;
  const htmlMessage = `<p>Your musicology.pro account has been verified!</p>
  <p>The <b>email address</b> where you received this message <b>is your username</b> on <a href="${process.env.MUSICOLOGY_URL}">
  musicology.pro</a>.</p>
  <p>Please note that you will need to create your own password before you can log in.</p>
  <p>Click <a href="${CHANGE_PASSWORD_URL}?token=${token}">
  ${CHANGE_PASSWORD_URL}?token=${token}</a> to access your account.</p>
  <br><p>Excited to have you on board!</p>
  <p>Yours, Musicology Team</p>`;

  try {
    await sendEmail(EMAIL_SENDER, [toEmail], subject, textMessage, htmlMessage);
  } catch (err) {
    throw new Error("Error sending email to user");
  }
};

export default notifyAccountCreated;
