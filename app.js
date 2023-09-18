import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import spotifyAuth from "./source/common/middlewares/spotifyAuth.js";
import handleError from "./source/common/middlewares/handleError.js";

dotenv.config();

import playlistManagementRoutes from "./source/playlist-management/routes.js";
import authRoutes from "./source/auth/routes.js";
import eventsRoutes from "./source/events/routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(spotifyAuth);
app.use("/", playlistManagementRoutes);
app.use("/", authRoutes);
app.use("/", eventsRoutes);
app.use(handleError);

const port = 8000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
