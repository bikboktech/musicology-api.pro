/** Express route helper functions
 * @module module:playlist_management/download/downloadPlaylist
 * @requires deemix
 * @requires deezer-js
 * @requires archiver
 */
import deemix from "deemix";
import { Deezer } from "deezer-js";
import archiver from "archiver";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import { SPOTIFY_CONFIG, DEEZER_SETTINGS } from "../../common/data/config.js";

/**
 * Bitrate used to generate a downloadObject
 * @type {number}
 */
const BITRATE = 9;

/**
 * Converts a Spotify playlist into a Deezer playlist
 * and downloads the playlist using deemix
 * @param {string} playlistLink Spotify playlist link (e.g. https://open.spotify.com/playlist/6307XqC1bD3oKK9pIp2QWs?si=98afdfccfeed40ff)
 * @returns object pointing to the .zip file with the downloaded playlist content
 */
const downloadPlaylist = async (playlistLink) => {
  const spotify = new deemix.plugins.spotify(__dirname + "/../../../");

  const dz = new Deezer();

  spotify.setCredentials(SPOTIFY_CONFIG.clientId, SPOTIFY_CONFIG.clientSecret);

  // console.log(process.env.DEEZER_EMAIL, process.env.DEEZER_PASSWORD, "deezer");

  const deezerAccessToken = await deemix.utils.deezer.getAccessToken(
    process.env.DEEZER_EMAIL,
    process.env.DEEZER_PASSWORD
  );

  console.log(deezerAccessToken, "deezerAccessToken");

  const arl = await deemix.utils.deezer.getArlFromAccessToken(
    deezerAccessToken
  );

  console.log(arl, "arl");

  await dz.login_via_arl(arl);

  const Downloader = deemix.downloader.Downloader;

  const downloadObject = await deemix.generateDownloadObject(
    dz,
    playlistLink,
    BITRATE,
    {
      spotify,
    }
  );

  const convertedDownloadObject = await spotify.convert(
    dz,
    downloadObject,
    DEEZER_SETTINGS
  );

  const downloadJob = new Downloader(
    dz,
    convertedDownloadObject,
    DEEZER_SETTINGS
  );

  await downloadJob.start();

  const archive = archiver("zip", { zlib: { level: 9 } });

  const dir = path.join(__dirname, "/../../common/data/downloads");

  archive.directory(dir, false);

  return archive;
};

export default downloadPlaylist;
