import fetch from "node-fetch";

const TEMPLATE_ID = "0f9c2897-2e3a-4f97-b529-383e94a018cb";

const createContract = async (id, name, eventType, email) => {
  const requestData = {
    name: `${name}_${eventType}_contract`,
    embedded_signing: true,
    template_id: TEMPLATE_ID,
    recipients: [
      {
        id,
        email,
        placeholder_name: "client",
      },
    ],
    template_fields: [
      {
        api_id: "clientNameCRO",
        value: name,
      },
      {
        api_id: "clientNameENG",
        value: name,
      },
    ],
  };

  const config = {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.SIGN_WELL_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };

  let contract = {};

  try {
    const response = await fetch(
      `https://www.signwell.com/api/v1/document_templates/documents`,
      config
    );

    contract = await response.json();

    return contract;
  } catch (error) {
    console.error("Failed to send document for signing:", error);
  }
};

export default createContract;
