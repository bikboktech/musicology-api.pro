import express from "express";

import updateAccount from "./update/index.js";
import updatePassword from "./update/password.js";
import deleteAccounts from "./delete/index.js";
import getAccountList from "./list/index.js";
import getAccountInfo from "./info/index.js";

const SERVICE_NAME = "accounts";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, updateAccount);
router.put(`/${SERVICE_NAME}/:accountId`, updateAccount);
router.post(`/${SERVICE_NAME}/password`, updatePassword);
router.delete(`/${SERVICE_NAME}`, deleteAccounts);
router.get(`/${SERVICE_NAME}`, getAccountList); // [?accountTypeId=<int>|?accountType=<str>]&active=<bool>
router.get(`/${SERVICE_NAME}/:accountId`, getAccountInfo);

export default router;
