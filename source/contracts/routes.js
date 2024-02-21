import express from "express";

import createContract from "./create/index.js";
import downloadContractPDF from "./downloadPDF/index.js";
import updateContract from "./update/index.js";

const SERVICE_NAME = "contracts";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, createContract);
router.put(`/${SERVICE_NAME}/:contractId`, updateContract);
router.get(`/${SERVICE_NAME}/:contractId/pdf`, downloadContractPDF);

export default router;
