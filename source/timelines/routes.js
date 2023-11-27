import express from "express";

/* timelines related routes */
import updateTimeline from "./update/index.js";
import deleteTimelines from "./delete/index.js";
import getTimelineList from "./list/index.js";
import getTimelineInfo from "./info/index.js";

const SERVICE_NAME = "timelines";

const router = express.Router();

router.put(`/${SERVICE_NAME}`, updateTimeline);
router.delete(`/${SERVICE_NAME}`, deleteTimelines);
router.get(`/${SERVICE_NAME}`, getTimelineList);
router.get(`/${SERVICE_NAME}/:eventId`, getTimelineInfo);
// router.get(`/${SERVICE_NAME}/:eventId`, getTimelineInfo);

export default router;
