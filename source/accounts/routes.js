import express from "express";

import getClients from "./getClients/index.js";
import getArtists from "./getArtists/index.js";

const SERVICE_NAME = "accounts";

const router = express.Router();

router.get(`/${SERVICE_NAME}/clients`, getClients);
router.get(`/${SERVICE_NAME}/artists`, getArtists);

export default router;
