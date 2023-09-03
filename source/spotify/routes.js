import express from "express";
import getTracks from "./getTracks/index.js";

const SERVICE_NAME = "spotify";

const router = express.Router();

router.get(`/${SERVICE_NAME}/tracks`, getTracks);

export default router;
