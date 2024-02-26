import express from "express";

// import getClients from "./getClients/index.js"; // TODO: remove
// import getArtists from "./getArtists/index.js"; // TODO: remove

import updateAccount from "./update/index.js";
import deleteAccounts from "./delete/index.js";
import getAccountList from "./list/index.js";
import getAccountInfo from "./info/index.js";
import verifyAccount from "./info/index.js";

const SERVICE_NAME = "accounts";

const router = express.Router();

// router.get(`/${SERVICE_NAME}/clients`, getClients); // TODO: remove
// router.get(`/${SERVICE_NAME}/artists`, getArtists); // TODO: remove

router.post(`/${SERVICE_NAME}`, updateAccount);
router.put(`/${SERVICE_NAME}/:accountId`, updateAccount);
router.delete(`/${SERVICE_NAME}`, deleteAccounts);
router.get(`/${SERVICE_NAME}/:accountId`, getAccountInfo);
router.get(`/${SERVICE_NAME}`, getAccountList); // [?accountTypeId=<int>|?accountType=<str>]&active=<bool>
router.post(`/${SERVICE_NAME}/verify`, verifyAccount);


export default router;
