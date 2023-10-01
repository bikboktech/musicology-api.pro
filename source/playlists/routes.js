import express from "express";

/* playlists related routes */
import createPlaylist from "./create/index.js";
import updatePlaylist from "./update/index.js";
import deletePlaylists from "./delete/index.js";
import getPlaylistList from "./list/index.js";
import getPlaylistInfo from "./info/index.js";

const SERVICE_NAME = "playlists";

const router = express.Router();

router.post(`/${SERVICE_NAME}/create`, createPlaylist);
router.put(`/${SERVICE_NAME}/update/:playlistId`, updatePlaylist);
router.delete(`/${SERVICE_NAME}`, deletePlaylists);
router.get(`/${SERVICE_NAME}`, getPlaylistList);
router.get(`/${SERVICE_NAME}/:playlistId`, getPlaylistInfo);

export default router;
