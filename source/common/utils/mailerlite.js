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
    },
    groups: [await getGroupId(groupName)],
    status: "active", // possible statuses: active, unsubscribed, unconfirmed, bounced or junk.
    subscribed_at: new Date().toISOString().slice(0, 19).replace("T", " "), // yyyy-MM-dd HH:mm:ss
    ip_address: null,
    opted_in_at: null, // yyyy-MM-dd HH:mm:ss
    optin_ip: null,
    unsubscribed_at: null // yyyy-MM-dd HH:mm:ss
  };

  if (eventDate !== undefined && eventDate !== null) {
    // MailerLite date fields expect "yyyy-MM-dd". events.date is a MySQL DATE
    // column, which the driver returns as a JS Date object; serialise it to the
    // expected format instead of a full ISO datetime string.
    params.fields.date = new Date(eventDate).toISOString().slice(0, 10);
  }

  try {
    const response = await mailerlite.subscribers.createOrUpdate(params);
    return response.data.data.id;
  } catch (error) {
    // Surface MailerLite's actual response so failures like 413/422 are not opaque.
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(
        `MailerLite createOrUpdate failed (${status}): ${JSON.stringify(data)}`
      );
    }
    throw error;
  }
};

export default createSubscriber;
