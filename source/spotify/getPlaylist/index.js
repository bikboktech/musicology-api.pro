import fetch from "node-fetch";

const getPlaylist = async (req, res) => {
  const { context, params } = req;

  if (!params.playlistId) {
    throw new Error("Missing Playlist Id");
  }

  const spotifyResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/playlists/${params.playlistId}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + context.spotifyToken,
      },
    }
  );

  const playlist = await spotifyResponse.json();

  const playlistOutput = {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks?.items.map((item) => {
      let artists = "";

      item.track.artists.forEach((artist, index) => {
        if (index + 1 === item.track.artists.length) {
          artists.concat(artist.name);
        } else {
          artists.concat(`${artist.name}, `);
        }
      });

      return {
        artists,
        id: item.track.id,
        imageUrl:
          item.track.album.images[item.track.album.images.length - 1].url,
        name: item.track.name,
      };
    }),
    url: playlist.external_urls.spotify,
  };

  res.status(200).json(playlistOutput);
};

export default getPlaylist;
