import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";

import spotifyAuth from "./source/common/middlewares/spotifyAuth.js";

dotenv.config();

import accountRoutes from "./source/accounts/routes.js";
import authRoutes from "./source/auth/routes.js";
import eventsRoutes from "./source/events/routes.js";
import playlistManagementRoutes from "./source/playlist-management/routes.js";
import spotifyRoutes from "./source/spotify/routes.js";

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
app.use("/", accountRoutes);
app.use("/", authRoutes);
app.use("/", eventsRoutes);
app.use("/", playlistManagementRoutes);
app.use("/", spotifyRoutes);

const port = 8000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
