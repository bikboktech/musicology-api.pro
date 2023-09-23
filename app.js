import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";

import handleError from "./source/common/middlewares/handleError.js";
import spotifyAuth from "./source/common/middlewares/spotifyAuth.js";

dotenv.config();

import authRoutes from "./source/auth/routes.js";
import eventsRoutes from "./source/events/routes.js";
import playlistManagementRoutes from "./source/playlist-management/routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(spotifyAuth);
app.use("/", authRoutes);
app.use("/", eventsRoutes);
app.use("/", playlistManagementRoutes);
app.use(handleError);

const port = 8000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
