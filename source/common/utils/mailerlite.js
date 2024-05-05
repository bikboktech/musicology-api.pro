// For ECMAScript (ESM)
import MailerLite from '@mailerlite/mailerlite-nodejs';

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_TOKEN
});

const getGroupId = async (groupName) => {
  const params = {
    limit: 1,
    page: 1,
    filter: {
      name: groupName,
    }
  };

  const response = await mailerlite.groups.get(params);
  return response.data.data[0].id;
};

const createSubscriber = async (groupName, client, eventDate) => {
  const params = {
    email: client.email,
    fields: {
      name: client.fullName,
      date: eventDate
    },
    groups: [await getGroupId(groupName)],
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

export default createSubscriber;
