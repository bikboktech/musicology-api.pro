import { EmailClient } from "@azure/communication-email";

// This code retrieves your connection string from an environment variable.
const connectionString = `endpoint=${process.env.AZ_EMAIL_ENDPOINT};accesskey=${process.env.AZ_EMAIL_ACCESSKEY}`;
const client = new EmailClient(connectionString);


const sendEmail = async (fromAddress, toAddresses, subject, textMessage, htmlMessage) => {
  const emailMessage = {
    senderAddress: fromAddress,
    content: {
        subject: subject,
        plainText: textMessage,
        html: htmlMessage
    },
    recipients: {
        to: toAddresses.map((address) => { return { address: address } }),
    },
  };

  const poller = await client.beginSend(emailMessage);
  const result = await poller.pollUntilDone();
  return result;
}

export default sendEmail;