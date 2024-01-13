import express from "express";

/* events related routes */
import createQuote from "./create/index.js";
import updateQuote from "./update/index.js";
import deleteQuotes from "./delete/index.js";
import getQuoteList from "./list/index.js";
import getQuoteInfo from "./info/index.js";

const SERVICE_NAME = "quotes";

const router = express.Router();

router.post(`/${SERVICE_NAME}`, createQuote);
router.put(`/${SERVICE_NAME}/:quoteId`, updateQuote);
router.delete(`/${SERVICE_NAME}`, deleteQuotes);
router.get(`/${SERVICE_NAME}`, getQuoteList);
router.get(`/${SERVICE_NAME}/:quoteId`, getQuoteInfo);

export default router;
