import Exception from "../../common/utils/exceptions.js";
import knex from "../../common/data/database.js";
import createResetToken from "../../common/utils/resetTokens.js";
import sendEmail from "../../common/utils/email.js";

const ACCOUNTS_TABLE_NAME = "accounts";
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const CHANGE_PASSWORD_URL = process.env.CHANGE_PASSWORD_URL;
const subject = "Password Reset Request at musicology.pro";

const passwordReset = async (request, response) => {
  const { email } = request.body.email;

  const user = await knex(ACCOUNTS_TABLE_NAME).where("email", email).first();

  if (!user) {
    return new Exception(404, `User not found`).handle(request, response);
  }

  console.log("User found");
  const token = await createResetToken(user);
  const textMessage = null;
  const htmlMessage = `<p>You have requested a password reset for your musicology.pro account.</p><br>
  <p>Click <a href="${CHANGE_PASSWORD_URL}?token=${token}">
  ${CHANGE_PASSWORD_URL}?token=${token}
  </a> to reset your password.</p>`;

  await sendEmail(EMAIL_SENDER, [email], subject, textMessage, htmlMessage)
    .then(function (data) {
      response.status(204).send("OK");
    })
    .catch(function (err) {
      console.error(err, err.stack);
      response.status(502).send(err);
    });
};

export default passwordReset;
