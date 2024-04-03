import knex from "../../common/data/database.js";
import sendEmail from "../../common/utils/email.js";
import createResetToken from "../../common/utils/resetTokens.js"

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
  <p>Please note that you will need to create your own password before you can log in.</p>
  <p>Click <a href="${CHANGE_PASSWORD_URL}?token=${token}">
  ${CHANGE_PASSWORD_URL}?token=${token}</a> to access your account.</p>`

  await sendEmail(EMAIL_SENDER, [toEmail], subject, textMessage, htmlMessage)
    .then(function (data) {
      response.status(204).send("OK");
    })
    .catch(function (err) {
      console.error(err, err.stack);
      response.status(502).send(err);
    });
};

export default notifyAccountCreated;
