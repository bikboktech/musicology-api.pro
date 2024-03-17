import express from "express";

import updateAccount from "./update/index.js";
import updatePassword from "./update/password.js";
import deleteAccounts from "./delete/index.js";
import getAccountList from "./list/index.js";
import getAccountInfo from "./info/index.js";
import verifyAccount from "./verify/index.js";

const SERVICE_NAME = "accounts";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, updateAccount);
router.put(`/${SERVICE_NAME}/:accountId`, updateAccount);
router.put(`/${SERVICE_NAME}/:accountId/password`, updatePassword);
router.delete(`/${SERVICE_NAME}`, deleteAccounts);
router.get(`/${SERVICE_NAME}`, getAccountList); // [?accountTypeId=<int>|?accountType=<str>]&active=<bool>
router.get(`/${SERVICE_NAME}/:accountId`, getAccountInfo);
router.post(`/${SERVICE_NAME}/:accountId/verify`, verifyAccount);

export default router;
