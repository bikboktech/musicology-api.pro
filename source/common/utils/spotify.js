import fetch from "node-fetch";

const getSpotifyPlaylistId = (playlistUrl) => {
  const parts = playlistUrl.split("/");

  return parts[parts.length - 1];
};

const createSpotifyPlaylist = async (req, name) => {
  const { context } = req;

  const playlistResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/users/${process.env.SPOTIFY_USER_ID}/playlists`,
    {
      method: "POST",
      body: JSON.stringify({
        name: name,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.spotifyToken,
      },
    }
  ).catch((err) => console.log(err));

  const playlist = await playlistResponse.json();

  console.log(playlist);

  return playlist;
};

export { createSpotifyPlaylist, getSpotifyPlaylistId };
