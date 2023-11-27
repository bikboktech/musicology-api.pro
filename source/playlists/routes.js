import express from "express";

/* playlists related routes */
import createPlaylist from "./create/index.js";
import updatePlaylist from "./update/index.js";
import deletePlaylists from "./delete/index.js";
import getPlaylistList from "./list/index.js";
import getPlaylistInfo from "./info/index.js";

const SERVICE_NAME = "playlists";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, createPlaylist);
router.put(`/${SERVICE_NAME}/:playlistId`, updatePlaylist);
router.delete(`/${SERVICE_NAME}`, deletePlaylists);
router.get(`/${SERVICE_NAME}`, getPlaylistList);
router.get(`/${SERVICE_NAME}/:eventId`, getPlaylistInfo);
// router.get(`/${SERVICE_NAME}/:eventId`, getPlaylistInfo);

export default router;
