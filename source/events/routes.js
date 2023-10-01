import express from "express";

/* events routes dependencies */
import getEventTypes from "./list/types/index.js";

/** quotes related routes */
import getAQuote from "./get-a-quote/index.js";

/* events related routes */
import createEvent from "./create/index.js";
import updateEvent from "./update/index.js";
import deleteEvents from "./delete/index.js";
import getEventList from "./list/index.js";
import getEventInfo from "./info/index.js";

const SERVICE_NAME = "events";

const router = express.Router();

router.get(`/${SERVICE_NAME}/types`, getEventTypes);
router.post(`/${SERVICE_NAME}/get-a-quote`, getAQuote);
router.post(`/${SERVICE_NAME}/create`, createEvent);
router.put(`/${SERVICE_NAME}/update/:eventId`, updateEvent);
router.delete(`/${SERVICE_NAME}`, deleteEvents);
router.get(`/${SERVICE_NAME}`, getEventList);
router.get(`/${SERVICE_NAME}/:eventId`, getEventInfo);

export default router;
