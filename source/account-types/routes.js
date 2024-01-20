import express from "express";

import getAccountTypeList from "./list/index.js";

const SERVICE_NAME = "account-types";

const router = express.Router();

router.get(`/${SERVICE_NAME}`, getAccountTypeList);

export default router;
