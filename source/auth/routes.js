/** Express router providing playlist related routes
 * @module auth/routes
 * @requires express
 * @requires module:auth/download
 */
import express from "express";
import login from "./login/index.js";

/**
 * Service Name
 * @type {string}
 */
const SERVICE_NAME = "auth";

/**
 * Express router to mount playlist download related functions on.
 * @type {object}
 * @const
 * @namespace authRouter
 */
const router = express.Router();

/**
 * Route serving playlist download (.zip).
 * @name post/auth/download
 * @function
 * @memberof module:playlist_management/download~authRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post(`/${SERVICE_NAME}/login`, login);

export default router;
