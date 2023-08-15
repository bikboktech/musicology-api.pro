/** Express router providing playlist related routes
 * @module quote_management/routes
 * @requires express
 * @requires module:quote_management/getAQuote
 */
import express from "express";
import getAQuote from "./getAQuote/index.js";

/**
 * Service Name
 * @type {string}
 */
const SERVICE_NAME = "quote-management";

/**
 * Express router to mount quote management related functions on.
 * @type {object}
 * @const
 * @namespace quoteManagementRouter
 */
const router = express.Router();

/**
 * Route serving quote management functions
 * @name post/quote-management/getAQuote
 * @function
 * @memberof module:quote_management/getAQuote~quoteManagementRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post(`/${SERVICE_NAME}/getAQuote`, getAQuote);

export default router;
