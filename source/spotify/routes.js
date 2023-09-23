import express from "express";
import createPlaylist from "./createPlaylist/index.js";
import getPlaylist from "./getPlaylist/index.js";
import getTracks from "./getTracks/index.js";

const SERVICE_NAME = "spotify";

const router = express.Router();

router.get(`/${SERVICE_NAME}/playlists/:playlistId`, getPlaylist);
router.get(`/${SERVICE_NAME}/tracks`, getTracks);

router.post(`/${SERVICE_NAME}/playlists`, createPlaylist);

export default router;
