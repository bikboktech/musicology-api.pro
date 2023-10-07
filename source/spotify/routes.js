import express from "express";
import getPlaylist from "./getPlaylist/index.js";
import getTracks from "./getTracks/index.js";
import { login, callback, refreshToken } from "./auth/index.js";

const SERVICE_NAME = "spotify";

const router = express.Router();

router.get(`/${SERVICE_NAME}/playlists/:playlistId`, getPlaylist);
router.get(`/${SERVICE_NAME}/tracks`, getTracks);

router.post(`/${SERVICE_NAME}/playlists`, createPlaylist);

router.get(`/${SERVICE_NAME}/login`, login);
router.get(`/${SERVICE_NAME}/callback`, callback);
router.get(`/${SERVICE_NAME}/refresh-token`, refreshToken);

export default router;
