/** Express route definitions providing playlist related functions
 * @module module:playlist_management/download
 * @requires express
 * @requires module:playlist_management/download/downloadPlaylist
 */

import downloadPlaylist from "./downloadPlaylist.js";
import getPlaylistData from "./getPlaylistData.js";

/**
 * Downloads a Spotify playlist on the Node server
 * and serves a .zip file as an attachment response
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const CLIENT_ID = 3;

const download = async (request, response, next) => {
  try {
    const { body, context } = request;

    if (request.user.accountType.id === CLIENT_ID) {
      throw new Error("Access denied");
    }

    const archive = await downloadPlaylist(body.playlistLink);

    const playlistData = await getPlaylistData(
      body.playlistLink,
      context.spotifyToken
    );

    const fileName = `${playlistData.name}.zip`;

    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );
    response.setHeader("Content-Type", "application/zip");

    archive.pipe(response);

    archive.finalize();
  } catch (error) {
    next(error);
  }
};

export default download;
