import express from "express";

import updateAccount from "./update/index.js";
import deleteAccounts from "./delete/index.js";
import getAccountList from "./list/index.js";
import getAccountInfo from "./info/index.js";

const SERVICE_NAME = "accounts";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, updateAccount);
router.put(`/${SERVICE_NAME}/:accountId`, updateAccount);
router.delete(`/${SERVICE_NAME}`, deleteAccounts);
router.get(`/${SERVICE_NAME}/:accountId`, getAccountInfo);
router.get(`/${SERVICE_NAME}`, getAccountList);

export default router;
