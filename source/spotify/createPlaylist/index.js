import fetch from "node-fetch";

const createPlaylist = async (req, res) => {
  const { context, body } = req;

  const playlistResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/users/${process.env.SPOTIFY_USER_ID}/playlists`,
    {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.spotifyToken,
      },
    }
  );

  const playlist = await playlistResponse.json();

  res.status(200).json(playlist);
};

export default createPlaylist;
