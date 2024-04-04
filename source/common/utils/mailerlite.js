// For ECMAScript (ESM)
import MailerLite from '@mailerlite/mailerlite-nodejs';

const DEFAULT_GROUP_NAME = "TEST ANDREA";

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_TOKEN
});

const getGroupId = async (name = null) => {
  const params = {
    limit: 1,
    // page: 1,
    filter: {
      name: name || DEFAULT_GROUP_NAME,
    }
  };

  const response = await mailerlite.groups.get(params);
  return response.data.data[0].id;
};

const createSubscriber = async (client) => {
  const params = {
    email: client.email,
    fields: {
      name: client.fullName.split(" ")[0],
      last_name: client.fullName.split(" ").slice(1).join(" "),
      phone: client.phone
    },
    groups: [getGroupId()],
    status: "active", // possible statuses: active, unsubscribed, unconfirmed, bounced or junk.
    subscribed_at: new Date().toISOString().slice(0, 19).replace("T", " "), // yyyy-MM-dd HH:mm:ss
    ip_address: null,
    opted_in_at: null, // yyyy-MM-dd HH:mm:ss
    optin_ip: null,
    unsubscribed_at: null // yyyy-MM-dd HH:mm:ss
  };
  
  const response = await mailerlite.subscribers.createOrUpdate(params);
  return response.data.data.id;
};
