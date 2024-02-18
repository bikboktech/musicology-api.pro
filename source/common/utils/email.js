import AWS from "aws-sdk";

AWS.config.update({ region: "eu-central-1" });
const awsSes = new AWS.SES({ apiVersion: "2010-12-01" });


const sendEmail = (toAddresses, fromAddress, subject, textMessage, htmlMessage) => {
  var Message = {
    Subject: {
      Charset: "UTF-8",
      Data: subject,
    },
    Body: {}
  }
  if (htmlMessage) {
    Message.Body.Html = {
      Charset: "UTF-8",
      Data: htmlMessage,
    }
  }
  if (textMessage) {
    Message.Body.Text = {
      Charset: "UTF-8",
      Data: textMessage,
    }
  }

  var params = {
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: Message,
    Source: fromAddress,
  };

  return awsSes.sendEmail(params).promise();
}

export default sendEmail;