import knex from "../../common/data/database.js";
import fetch from "node-fetch";

const EVENTS_TABLE = "events";

const downloadContractPDF = async (request, response) => {
  try {
    const pdfResponse = await fetch(
      `https://www.signwell.com/api/v1/documents/${request.params.contractId}/completed_pdf`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.SIGN_WELL_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (pdfResponse.ok) {
      const event = await knex(EVENTS_TABLE)
        .select(
          "events.*",
          "client.full_name as clientFullName",
          "event_types.name as eventTypeName"
        )
        .join("accounts as client", "events.client_id", "=", "client.id")
        .join("event_types", "events.event_type_id", "=", "event_types.id")
        .where("events.contract_id", request.params.contractId)
        .first();

      response.setHeader("Content-Type", "application/pdf");
      response.setHeader(
        "Content-Disposition",
        `attachment; filename=${encodeURIComponent(event.clientFullName)}_${
          event.eventTypeName
        }_contract.pdf`
      );

      pdfResponse.body.pipe(response);
    } else {
      console.error("Failed to fetch PDF from external API");
      response.status(500).send("Failed to download PDF");
    }
  } catch (error) {
    console.error("Failed to send document for signing:", error);
  }

  // 47631eff-9aaa-48de-bd42-4b9b401d035f
};

export default downloadContractPDF;
