import Exception from '../../common/utils/exceptions.js'
import knex from '../../common/data/database.js';
import createResetToken from '../../common/utils/resetTokens.js';
import sendEmail from '../../common/utils/email.js';

const ACCOUNTS_TABLE_NAME = "accounts";
const fromEmail = "info@musicology.pro";
const subject = "Password Reset Request at musicology.pro";

const passwordReset = async (request, response) => {
  const { email } = request.body;

  const user = await knex(ACCOUNTS_TABLE_NAME).where('email', email).first();

  if (!user){
    return new Exception(
      404, `User not found`
    ).handle(request, response);
  }

  console.log("User found")
  const token = await createResetToken(user);
  const textMessage = null;
  const htmlMessage = `<p>You have requested a password reset for your musicology.pro account.</p><br>
  <p>Click <a href="http://localhost:8000/accounts/password-reset/request?token=${token}">
  http://localhost:8000/accounts/password-reset/request?token=${token}
  </a> to reset your password.</p>`

  sendEmail(fromEmail, [email], subject, textMessage, htmlMessage)
    .then(function (data) {
      console.log(data.MessageId);
      response.status(204).send("OK");
    })
    .catch(function (err) {
      console.error(err, err.stack);
      response.status(502).send(err);
    });
}
  
export default passwordReset;