import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authMiddleware from "./source/common/middlewares/authMiddleware.js";
import spotifyAuth from "./source/common/middlewares/spotifyAuth.js";

dotenv.config();

import accountRoutes from "./source/accounts/routes.js";
import accountTypeRoutes from "./source/account-types/routes.js";
import authRoutes from "./source/auth/routes.js";
import contractRoutes from "./source/contracts/routes.js";
import eventsRoutes from "./source/events/routes.js";
import playlistsRoutes from "./source/playlists/routes.js";
import playlistManagementRoutes from "./source/playlist-management/routes.js";
import spotifyRoutes from "./source/spotify/routes.js";
import quotesRoutes from "./source/quotes/routes.js";
import templatePlaylistsRoutes from "./source/template-playlists/routes.js";
import timelinesRoutes from "./source/timelines/routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authMiddleware);
app.use(spotifyAuth);
app.use("/", accountRoutes);
app.use("/", accountTypeRoutes);
app.use("/", authRoutes);
app.use("/", contractRoutes);
app.use("/", eventsRoutes);
app.use("/", playlistManagementRoutes);
app.use("/", playlistsRoutes);
app.use("/", spotifyRoutes);
app.use("/", quotesRoutes);
app.use("/", templatePlaylistsRoutes);
app.use("/", timelinesRoutes);

const port = 8000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
