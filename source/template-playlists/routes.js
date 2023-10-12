import express from "express";

/* template-playlists related routes */
import createTemplatePlaylist from "./create/index.js";
import updateTemplatePlaylist from "./update/index.js";
import deleteTemplatePlaylists from "./delete/index.js";
import getTemplatePlaylistList from "./list/index.js";
import getTemplatePlaylistInfo from "./info/index.js";

const SERVICE_NAME = "template-playlists";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, createTemplatePlaylist);
router.put(`/${SERVICE_NAME}/:playlistId`, updateTemplatePlaylist);
router.delete(`/${SERVICE_NAME}`, deleteTemplatePlaylists);
router.get(`/${SERVICE_NAME}`, getTemplatePlaylistList);
router.get(`/${SERVICE_NAME}/:playlistId`, getTemplatePlaylistInfo);

export default router;
