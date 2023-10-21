import express from "express";

/* timelines related routes */
import createTimeline from "./create/index.js";
import updateTimeline from "./update/index.js";
import deleteTimelines from "./delete/index.js";
import getTimelineList from "./list/index.js";
import getTimelineInfo from "./info/index.js";

const SERVICE_NAME = "timelines";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, createTimeline);
router.put(`/${SERVICE_NAME}/:timelineId`, updateTimeline);
router.delete(`/${SERVICE_NAME}`, deleteTimelines);
router.get(`/${SERVICE_NAME}`, getTimelineList);
router.get(`/${SERVICE_NAME}/:timelineId`, getTimelineInfo);
// router.get(`/${SERVICE_NAME}/:eventId`, getTimelineInfo);

export default router;
