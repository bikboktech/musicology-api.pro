import fetch from "node-fetch";

import { SPOTIFY_CONFIG } from "../data/config.js";

const spotifyAuth = async (request, response, next) => {
  try {
    // console.log(SPOTIFY_CONFIG);

    const spotifyResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(
              SPOTIFY_CONFIG.clientId + ":" + SPOTIFY_CONFIG.clientSecret
            ).toString("base64"),
        },
        body: "grant_type=client_credentials",
      }
    );
    
    const spotifyUserSession = await spotifyResponse.json();

    request.context = {
      ...request.context,
      spotifyToken: spotifyUserSession.access_token,
    };

    next();
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};

export default spotifyAuth;
