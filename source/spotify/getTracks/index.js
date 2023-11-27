import fetch from "node-fetch";

const getTracks = async (req, res) => {
  const { context, query } = req;
  console.log("req: ", req);

  let limit = query.limit ?? 50;
  let offset = query.offset ?? 0;
  let search = query.search ?? "";

  console.log(`Spotify search URL: ${process.env.SPOTIFY_API_URL}/search?q=track:${search}&type=track,artist&limit=${limit}&offset=${offset}`);
  const spotifyResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/search?q=track:${search}&type=track,artist&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + context.spotifyToken,
      },
    }
  );
  console.log("spotifyResponse: ", spotifyResponse);

  const { tracks } = await spotifyResponse.json();

  console.log("tracks: ", tracks);

  const tracksOutput = tracks?.items.map((track) => {
    let artists = "";

    track.artists.forEach((artist, index) => {
      if (index + 1 === track.artists.length) {
        artists = artists.concat(artist.name);
      } else {
        artists = artists.concat(`${artist.name}, `);
      }
    });

    return {
      artists,
      id: track.id,
      imageUrl: track.album.images[track.album.images.length - 1].url,
      name: track.name,
    };
  });

  res.status(200).json(tracksOutput || []);
};

export default getTracks;
