/** Express router providing playlist related routes
 * @module events/routes
 * @requires express
 * @requires module:events/event-types
 * @requires module:events/get-a-quote
 */
import express from "express";
import getEventTypes from "./event-types/index.js";
import getAQuote from "./get-a-quote/index.js";
import createEventInfo from "./event-info/createEventInfo/index.js";
import updateEventInfo from "./event-info/updateEventInfo/index.js";

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
router.get(`/${SERVICE_NAME}/event-types`, getEventTypes);

/**
 * Route serving quote management functions
 * @name get/events/getAQuote
 * @function
 * @memberof module:events/getAQuote~eventsRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post(`/${SERVICE_NAME}/get-a-quote`, getAQuote);

router.post(`/${SERVICE_NAME}/event-info`, createEventInfo);
router.put(`/${SERVICE_NAME}/event-info/:eventId`, updateEventInfo);

export default router;
