/** Express router providing playlist related routes
 * @module playlist_management/routes
 * @requires express
 * @requires module:playlist_management/download
 */
import express from "express";
import download from "./download/index.js";

/**
 * Service Name
 * @type {string}
 */
const SERVICE_NAME = "playlist-management";

/**
 * Express router to mount playlist download related functions on.
 * @type {object}
 * @const
 * @namespace playlistRouter
 */
const router = express.Router();

/**
 * Route serving playlist download (.zip).
 * @name post/playlist-management/download
 * @function
 * @memberof module:playlist_management/download~playlistRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post(`/${SERVICE_NAME}/download`, download);

export default router;
