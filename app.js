import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

import playlistManagementRoutes from "./source/playlist-management/routes.js";
import spotifyRoutes from "./source/spotify/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", playlistManagementRoutes);
<<<<<<< Updated upstream
=======
app.use("/", spotifyRoutes);
app.use(handleError);
>>>>>>> Stashed changes

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
