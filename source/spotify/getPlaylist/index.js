import { getSpotifyPlaylist } from "../../common/utils/spotify.js";

const getPlaylist = async (req, res) => {
  const { context, params } = req;

  if (!params.playlistId) {
    throw new Error("Missing Playlist Id");
  }

  const playlistOutput = await getSpotifyPlaylist(
    params.playlistId,
    context.spotifyToken
  );

  res.status(200).json(playlistOutput);
};

export default getPlaylist;
