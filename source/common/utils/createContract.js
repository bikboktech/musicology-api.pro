import fetch from "node-fetch";

const TEMPLATE_ID = "0e41ca9e-9185-417d-b9df-c4caaed2fa7c";

const createContract = async (id, name, eventType, email) => {
  const requestData = {
    name: `${name}_${eventType}_contract`,
    embedded_signing: true,
    template_id: TEMPLATE_ID,
    recipients: [
      {
        id,
        email,
        placeholder_name: "Client",
      },
    ],
    template_fields: [
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

  try {
    const response = await fetch(
      `https://www.signwell.com/api/v1/document_templates/documents`,
      config
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "SignWell rejected document creation:",
        response.status,
        data
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to send document for signing:", error);
    return null;
  }
};

export default createContract;
