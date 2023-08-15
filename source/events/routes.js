/** Express router providing playlist related routes
 * @module events/routes
 * @requires express
 * @requires module:events/eventTypes
 */
import express from "express";
import getEventTypes from "./eventTypes/index.js";

/**
 * Service Name
 * @type {string}
 */
const SERVICE_NAME = "events";

/**
 * Express router to mount quote management related functions on.
 * @type {object}
 * @const
 * @namespace eventsRouter
 */
const router = express.Router();

/**
 * Route serving quote management functions
 * @name get/events/getEventTypes
 * @function
 * @memberof module:events/getEventTypes~eventsRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get(`/${SERVICE_NAME}/getEventTypes`, getEventTypes);

export default router;