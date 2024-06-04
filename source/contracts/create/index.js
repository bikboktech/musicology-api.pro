import fetch from "node-fetch";
// import validateRequestBody from "./validateRequestBody";

const TEMPLATE_ID = "494b913f-a08a-4b57-9af0-b3c4eae352f8";

const createContract = async (request, response, next) => {
  //   const validatedRequestBody = await validateRequestBody(request, response);

  //   if (validatedRequestBody) {
  const requestData = {
    name: "Matej test", // Name your document
    embedded_signing: true,
    template_id: TEMPLATE_ID,
    recipients: [
      {
        id: 1,
        email: "matpaus@hotmail.com",
        placeholder_name: "client",
      },
    ],
    template_fields: [
      {
        api_id: "clientNameCRO",
        value: "Matej Paus",
      },
      {
        api_id: "clientNameENG",
        value: "Matej Paus",
      },
      {
        api_id: "clientIDCRO",
        value: "69",
      },
      {
        api_id: "clientIDENG",
        value: "69",
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
    console.log("Document created and sent for signing:", data);
  } catch (error) {
    console.error("Failed to send document for signing:", error);
  }

  response.status(203).json({
    // id: id,
    // spotifyPlaylistId: playlist.id,
    // eventId: validatedRequestBody.eventId,
    // playlistName: validatedRequestBody.playlistName,
    // trackIds: validatedRequestBody.trackIds,
  });
  //   }
};

export default createContract;
