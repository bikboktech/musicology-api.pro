import { EmailClient } from "@azure/communication-email";

// This code retrieves your connection string from an environment variable.
const connectionString = `endpoint=${process.env.AZ_EMAIL_ENDPOINT};accesskey=${process.env.AZ_EMAIL_ACCESSKEY}`;
const client = new EmailClient(connectionString);

const sendEmail = (
  fromAddress,
  toAddresses,
  subject,
  textMessage,
  htmlMessage
) => {
  const emailMessage = {
    senderAddress: fromAddress,
    replyTo: [
      { 
        address: process.env.MUSICOLOGY_EMAIL_RECEIVER,
        displayName: "Musicology Team"
      }
    ],
    content: {
      subject: subject,
      plainText: textMessage,
      html: htmlMessage,
    },
    recipients: {
      to: toAddresses.map((address) => {
        return { address: address };
      }),
    },
  };

  client.beginSend(emailMessage);
  return true;
};

export default sendEmail;
